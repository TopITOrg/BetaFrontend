import {useState} from 'react';

interface UpdateWorkoutData {
    id: number;
    start_date?: string;
    end_date?: string;
    cancelled?: boolean;
}

interface UseUpdateWorkoutResult {
    updateWorkout: (data: UpdateWorkoutData) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export const useUpdateWorkout = (): UseUpdateWorkoutResult => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateWorkout = async (data: UpdateWorkoutData) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const response = await fetch('http://localhost:8080/workouts/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Ошибка обновления: ${response.status}`);
            }
        } catch (err) {
            console.error('Ошибка при обновлении тренировки:', err);
            setError('Не удалось обновить тренировку');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateWorkout,
        loading,
        error
    };
};