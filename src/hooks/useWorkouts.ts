import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export interface Workout {
    id: number;
    club_id: number;
    club_name: string;
    start_date: string;
    end_date: string;
    cancelled: boolean;
    created_at: string;
    updated_at: string;
}

interface UseWorkoutsResult {
    workouts: Workout[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useWorkouts = (clubId?: number): UseWorkoutsResult => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchWorkouts = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            // Если передан clubId, загружаем тренировки для конкретной секции
            if (clubId) {
                const response = await fetch('http://localhost:8080/workouts/getByClub', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        club_id: clubId,
                        limit: 100,
                        offset: 0
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }

                const data = await response.json();
                const transformedWorkouts: Workout[] = data.workouts.map((workout: any) => ({
                    id: workout.id,
                    club_id: workout.club_id,
                    club_name: workout.club_name,
                    start_date: workout.start_date,
                    end_date: workout.end_date,
                    cancelled: workout.cancelled,
                    created_at: workout.created_at,
                    updated_at: workout.updated_at
                }));

                setWorkouts(transformedWorkouts);
            } else {
                // TODO: Реализовать загрузку всех тренировок для студента
                // Пока используем моковые данные
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockWorkouts: Workout[] = [
                    {
                        id: 1,
                        club_id: 1,
                        club_name: 'Скалолазание',
                        start_date: '2024-04-23T13:00:00',
                        end_date: '2024-04-23T14:30:00',
                        cancelled: false,
                        created_at: '2024-04-20T10:00:00',
                        updated_at: '2024-04-20T10:00:00'
                    },
                    {
                        id: 2,
                        club_id: 1,
                        club_name: 'Скалолазание',
                        start_date: '2024-04-25T14:00:00',
                        end_date: '2024-04-25T16:00:00',
                        cancelled: false,
                        created_at: '2024-04-20T10:00:00',
                        updated_at: '2024-04-20T10:00:00'
                    }
                ];

                setWorkouts(mockWorkouts);
            }
        } catch (err) {
            console.error('Ошибка при загрузке тренировок:', err);
            setError('Не удалось загрузить данные о тренировках');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, [clubId]);

    return {
        workouts,
        loading,
        error,
        refetch: fetchWorkouts
    };
};