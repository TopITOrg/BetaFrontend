import { useState } from 'react';

interface CreateWorkoutData {
    club_id: number;
    start_date: string;
    end_date: string;
}

interface UseCreateWorkoutResult {
    createWorkout: (data: CreateWorkoutData) => Promise<any>;
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/workouts/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseText = await response.text();

            if (!response.ok) {
                console.error('Backend error response:', responseText);

                let errorMessage = 'Не удалось создать тренировку';
                try {
                    // Пробуем распарсить JSON
                    const errorJson = JSON.parse(responseText);
                    if (errorJson.message) {
                        errorMessage = errorJson.message;
                    }
                } catch {
                    // Если не JSON, показываем как есть
                    if (responseText) {
                        errorMessage = responseText;
                    }
                }

                throw new Error(`Ошибка ${response.status}: ${errorMessage}`);
            }

            // Пробуем распарсить успешный ответ
            try {
                const result = JSON.parse(responseText);
                console.log('Workout created successfully:', result);
                return result;
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                throw new Error('Некорректный ответ от сервера');
            }

        } catch (err) {
            console.error('Ошибка при создании тренировки:', err);
            const errorMessage = err instanceof Error ? err.message : 'Не удалось создать тренировку';
            setError(errorMessage);
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