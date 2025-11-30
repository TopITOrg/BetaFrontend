import {useState} from 'react';

interface CreateWorkoutData {
    club_id: number;
    start_date: string;
    end_date: string;
}

interface UseCreateWorkoutResult {
    createWorkout: (data: CreateWorkoutData) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export const useCreateWorkout = (): UseCreateWorkoutResult => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createWorkout = async (data: CreateWorkoutData) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            console.log('Creating workout with data:', data);

            const response = await fetch('http://localhost:8080/workouts/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend error response:', errorText);
                throw new Error(`Ошибка создания: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Workout created successfully:', result);

        } catch (err) {
            console.error('Ошибка при создании тренировки:', err);
            setError('Не удалось создать тренировку');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createWorkout,
        loading,
        error
    };
};