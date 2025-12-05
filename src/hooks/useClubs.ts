import { useEffect, useState } from 'react';
import type { ClubData } from '@/components/ClubCard';
import { useAuth } from '../../contexts/AuthContext';

interface UseClubsResult {
    clubs: ClubData[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useClubs = (): UseClubsResult => {
    const [clubs, setClubs] = useState<ClubData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, isAuthenticated } = useAuth();

    const fetchClubs = async () => {
        try {
            setLoading(true);
            setError(null);

            // Получаем токен, если есть
            const token = localStorage.getItem('access_token');

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            // Добавляем токен только если пользователь авторизован
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/clubs/`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    limit: 100,
                    offset: 0
                }),
            });

            if (!response.ok) {
                // Для неавторизованных пользователей все равно показываем клубы
                if (response.status === 401 && !isAuthenticated) {
                    console.log('Пользователь не авторизован, показываем пустой список клубов');
                    setClubs([]);
                    return;
                }

                // Для авторизованных пользователей показываем ошибку
                if (response.status === 401) {
                    setError('Ошибка авторизации. Пожалуйста, войдите снова.');
                } else {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }
                return;
            }

            const data = await response.json();
            console.log('Данные всех секций:', data);

            if (data.clubs && Array.isArray(data.clubs)) {
                const transformedClubs: ClubData[] = data.clubs.map((club: any) => {
                    const totalPlaces = club.TotalPlaces || 0;
                    const takenPlaces = club.TakenPlaces || 0;
                    const freePlaces = Math.max(0, totalPlaces - takenPlaces);

                    console.log(`Секция "${club.Name}": всего=${totalPlaces}, занято=${takenPlaces}, свободно=${freePlaces}`);

                    return {
                        title: club.Name,
                        availableSpots: `${freePlaces} из ${totalPlaces}`,
                        location: club.Place,
                        workoutsPerWeek: club.RequiredWorkoutPerWeek?.toString() || '1',
                        skillLevel: club.EducationLevel,
                        description: club.Description,
                        id: club.ID,
                        sportType: club.SportType,
                        totalPlaces: totalPlaces,
                        takenPlaces: takenPlaces,
                    };
                });

                console.log('Преобразованные секции:', transformedClubs);
                setClubs(transformedClubs);
            } else {
                throw new Error('Неверный формат данных от сервера');
            }
        } catch (err) {
            console.error('Ошибка при загрузке секций:', err);
            setError('Не удалось загрузить данные о секциях');
            setClubs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClubs();
    }, [isAuthenticated]);

    return {
        clubs,
        loading,
        error,
        refetch: fetchClubs
    };
};