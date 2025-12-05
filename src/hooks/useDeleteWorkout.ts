import {useState} from 'react';

interface UseDeleteWorkoutResult {
    deleteWorkout: (workoutId: number) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export const useDeleteWorkout = (): UseDeleteWorkoutResult => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteWorkout = async (workoutId: number) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/workouts/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: workoutId}),
            });

            if (!response.ok) {
                throw new Error(`Ошибка удаления: ${response.status}`);
            }
        } catch (err) {
            console.error('Ошибка при удалении тренировки:', err);
            setError('Не удалось удалить тренировку');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteWorkout,
        loading,
        error
    };
};