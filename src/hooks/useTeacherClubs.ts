import {useEffect, useState} from 'react';
import {useAuth} from '../../contexts/AuthContext';
import api from '../lib/api';

export interface TeacherClub {
    id: number;
    name: string;
    description: string;
    sport_type: string;
    teacher: string;
    teacher_id: number; // Добавляем teacher_id
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

    const fetchTeacherClubs = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/clubs/', {
                limit: 1000,
                offset: 0
            });

            const data = response.data;
            console.log('All clubs from server:', data.clubs); // Для отладки

            if (data.clubs && Array.isArray(data.clubs)) {
                // Правильно маппим поля из ответа сервера
                const teacherClubs: TeacherClub[] = data.clubs
                    .filter((club: any) => {
                        // Проверяем разные возможные названия полей
                        const teacherId = club.TeacherID || club.teacher_id || club.teacherId;
                        console.log(`Club ${club.Name}: TeacherID = ${teacherId}, User ID = ${user?.id}`); // Для отладки
                        return teacherId === user?.id;
                    })
                    .map((club: any) => ({
                        id: club.ID || club.id,
                        name: club.Name || club.name,
                        description: club.Description || club.description,
                        sport_type: club.SportType || club.sport_type,
                        teacher: club.Teacher || club.teacher,
                        teacher_id: club.TeacherID || club.teacher_id || club.teacherId,
                        total_places: club.TotalPlaces || club.total_places,
                        place: club.Place || club.place,
                        education_level: club.EducationLevel || club.education_level,
                        required_workout_per_week: club.RequiredWorkoutPerWeek || club.required_workout_per_week
                    }));

                console.log('Filtered teacher clubs:', teacherClubs); // Для отладки
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