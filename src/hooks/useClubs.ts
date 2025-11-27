import {useEffect, useState} from 'react';
import type {ClubData} from '@/components/ClubCard';
import {useAuth} from '../../contexts/AuthContext';

export interface ClubFromBackend {
    ID: number;
    Name: string;
    Description: string;
    SportTypeID: number;
    SportType: string;
    TeacherID: number;
    Teacher: string;
    TotalPlaces: number | null;
    Place: string;
    EducationLevelID: number;
    EducationLevel: string;
    RequiredWorkoutPerWeek: number;
    CreatedAt: string;
    UpdatedAt: string;
}

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
    const {user, isAuthenticated} = useAuth();

    const fetchClubs = async () => {
        try {
            setLoading(true);
            setError(null);

            // Проверяем аутентификацию
            if (!isAuthenticated) {
                setError('Пользователь не авторизован');
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('Токен авторизации не найден');
                setLoading(false);
                return;
            }

            console.log('Sending clubs request with token:', token); // Debug log

            const response = await fetch('http://localhost:8080/clubs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    limit: 100,
                    offset: 0
                }),
            });

            console.log('Clubs response status:', response.status); // Debug log

            if (!response.ok) {
                if (response.status === 401) {
                    setError('Ошибка авторизации');
                } else {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }
                return;
            }

            const data = await response.json();
            console.log('Clubs data received:', data); // Debug log

            if (data.clubs && Array.isArray(data.clubs)) {
                const transformedClubs: ClubData[] = data.clubs.map((club: ClubFromBackend) => {
                    return {
                        title: club.Name,
                        availableSpots: club.TotalPlaces ? `${club.TotalPlaces}` : '0',
                        location: club.Place,
                        workoutsPerWeek: club.RequiredWorkoutPerWeek.toString(),
                        skillLevel: club.EducationLevel,
                        description: club.Description,
                        id: club.ID
                    };
                });

                setClubs(transformedClubs);
            } else {
                throw new Error('Неверный формат данных от сервера');
            }
        } catch (err) {
            console.error('Ошибка при загрузке клубов:', err);
            setError('Не удалось загрузить данные о клубах');
            setClubs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchClubs();
        } else {
            setLoading(false);
            setError('Пользователь не авторизован');
        }
    }, [isAuthenticated]);

    return {
        clubs,
        loading,
        error,
        refetch: fetchClubs
    };
};
