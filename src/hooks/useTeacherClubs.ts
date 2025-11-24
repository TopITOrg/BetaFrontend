// hooks/useTeacherClubs.ts
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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
    teacher_id: number;
}

interface UseTeacherClubsResult {
    clubs: TeacherClub[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useTeacherClubs = (): UseTeacherClubsResult => {
    const [clubs, setClubs] = useState<TeacherClub[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchTeacherClubs = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user) {
                console.log('No user found');
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8080/clubs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
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
                // Детальная отладка фильтрации
                const teacherClubs: TeacherClub[] = data.clubs
                    .filter((club: any) => {
                        const clubTeacherId = club.teacher_id || club.TeacherID;
                        const userId = user.id;
                        const isMatch = Number(clubTeacherId) === Number(userId);

                        console.log(`Filtering: "${club.name}" - teacher_id: ${clubTeacherId}, user_id: ${userId}, match: ${isMatch}`);

                        return isMatch;
                    })
                    .map((club: any) => ({
                        id: club.id || club.ID,
                        name: club.name || club.Name,
                        description: club.description || club.Description,
                        sport_type: club.sport_type || club.SportType,
                        teacher: club.teacher || club.Teacher,
                        teacher_id: club.teacher_id || club.TeacherID,
                        total_places: club.total_places || club.TotalPlaces,
                        place: club.place || club.Place,
                        education_level: club.education_level || club.EducationLevel,
                        required_workout_per_week: club.required_workout_per_week || club.RequiredWorkoutPerWeek
                    }));

                console.log('Final teacher clubs:', teacherClubs);
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