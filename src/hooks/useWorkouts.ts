import { useEffect, useState } from 'react';
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
    const { isAuthenticated } = useAuth();

    const fetchWorkouts = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/workouts/getByClub`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    club_id: clubId || 0,
                    limit: 100,
                    offset: 0
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.workouts && Array.isArray(data.workouts)) {
                const validWorkouts = data.workouts
                    .filter((w: any) => w.start_date && w.end_date)
                    .map((workout: any) => ({
                        id: Number(workout.id),
                        club_id: Number(workout.club_id),
                        club_name: workout.club_name || 'Unknown',
                        start_date: workout.start_date,
                        end_date: workout.end_date,
                        cancelled: Boolean(workout.cancelled),
                        created_at: workout.created_at,
                        updated_at: workout.updated_at
                    }));

                setWorkouts(validWorkouts);
            } else {
                setWorkouts([]);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load workouts');
            setWorkouts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchWorkouts();
        } else {
            setLoading(false);
            setError('User not authenticated');
        }
    }, [clubId, isAuthenticated]);

    return {
        workouts,
        loading,
        error,
        refetch: fetchWorkouts
    };
};