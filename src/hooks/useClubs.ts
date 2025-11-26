// hooks/useClubs.ts
import { useState, useEffect } from 'react';

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

export interface ClubData {
    id?: number;
    title: string;
    availableSpots: string;
    location: string;
    workoutsPerWeek: string;
    skillLevel: string;
    description: string;
    sportType: string; // Добавлено новое поле
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

    const fetchClubs = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:8080/clubs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    limit: 100,
                    offset: 0
                }),
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }

            const data = await response.json();

            if (data.clubs && Array.isArray(data.clubs)) {
                const transformedClubs: ClubData[] = data.clubs.map((club: ClubFromBackend) => {
                    const availableSpots = club.TotalPlaces ? `${club.TotalPlaces}` : '0';

                    return {
                        title: club.Name,
                        availableSpots: availableSpots,
                        location: club.Place,
                        workoutsPerWeek: club.RequiredWorkoutPerWeek.toString(),
                        skillLevel: club.EducationLevel,
                        description: club.Description,
                        sportType: club.SportType, // Добавлено
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
        fetchClubs();
    }, []);

    return {
        clubs,
        loading,
        error,
        refetch: fetchClubs
    };
};