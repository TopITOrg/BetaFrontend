import {useEffect, useState} from 'react';
import {useAuth} from '../../contexts/AuthContext';

export interface TeacherClub {
    id: number;
    name: string;
    description: string;
    sport_type: string;
    teacher: string;
    total_places: number | null;
    place: string;
    education_level: string;
    required_workout_per_week: number;
}

interface UseTeacherClubsResult {
    clubs: TeacherClub[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useTeacherClubs = (): UseTeacherClubsResult => {
    const [clubs, setClubs] = useState<TeacherClub[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAuth();

    // hooks/useTeacherClubs.ts
    const fetchTeacherClubs = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:8080/clubs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    limit: 1000,
                    offset: 0
                }),
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }

            const data = await response.json();
            console.log('All clubs data:', data);

            if (data.clubs && Array.isArray(data.clubs)) {
                console.log('Current user ID:', user?.id);

                const teacherClubs: TeacherClub[] = data.clubs
                    .filter((club: any) => {
                        console.log(`Checking club: ${club.Name}, TeacherID: ${club.TeacherID}, User ID: ${user?.id}`);
                        return club.TeacherID === user?.id;
                    })
                    .map((club: any) => ({
                        id: club.ID,
                        name: club.Name,
                        description: club.Description,
                        sport_type: club.SportType,
                        teacher: club.Teacher,
                        teacher_id: club.TeacherID,
                        total_places: club.TotalPlaces,
                        place: club.Place,
                        education_level: club.EducationLevel,
                        required_workout_per_week: club.RequiredWorkoutPerWeek
                    }));

                console.log('Filtered teacher clubs:', teacherClubs);
                setClubs(teacherClubs);
            } else {
                throw new Error('Неверный формат данных от сервера');
            }
        } catch (err) {
            console.error('Ошибка при загрузке секций тренера:', err);
            setError('Не удалось загрузить данные о секциях');
            setClubs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTeacherClubs();
        }
    }, [user]);

    return {
        clubs,
        loading,
        error,
        refetch: fetchTeacherClubs
    };
};