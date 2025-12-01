import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../lib/api';

export interface TeacherClub {
    id: number;
    name: string;
    description: string;
    sport_type: string;
    teacher: string;
    teacher_id: number;
    total_places: number | null;
    taken_places: number;
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
    const { user } = useAuth();

    const fetchTeacherClubs = async () => {
        try {
            setLoading(true);
            setError(null);

            // Получаем все клубы
            const response = await api.post('/clubs/', {
                limit: 1000,
                offset: 0
            });

            const data = response.data;
            console.log('=== DEBUG: Ответ от /clubs/ ===', data);

            if (data.clubs && Array.isArray(data.clubs)) {
                // Фильтруем клубы текущего тренера
                const teacherClubs: TeacherClub[] = [];

                for (const club of data.clubs) {
                    // Проверяем, что это клуб текущего тренера
                    // Используем TeacherID (с заглавной, как в JSON)
                    if (club.TeacherID === user?.id) {
                        console.log(`Найден клуб тренера: ${club.Name}, TakenPlaces = ${club.TakenPlaces}`);

                        teacherClubs.push({
                            id: club.ID,
                            name: club.Name,
                            description: club.Description,
                            sport_type: club.SportType,
                            teacher: club.Teacher,
                            teacher_id: club.TeacherID,
                            total_places: club.TotalPlaces || 0,
                            taken_places: club.TakenPlaces || 0, // Используем TakenPlaces из ответа
                            place: club.Place,
                            education_level: club.EducationLevel,
                            required_workout_per_week: club.RequiredWorkoutPerWeek
                        });
                    }
                }

                console.log('Клубы тренера:', teacherClubs);
                setClubs(teacherClubs);
            } else {
                throw new Error('Неверный формат данных от сервера');
            }
        } catch (err: any) {
            console.error('Ошибка при загрузке секций тренера:', err);
            setError(err.message || 'Не удалось загрузить данные о секциях');
            setClubs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            console.log('Загружаем клубы для тренера ID:', user.id);
            fetchTeacherClubs();
        } else {
            setLoading(false);
            setError('Пользователь не авторизован');
        }
    }, [user]);

    return {
        clubs,
        loading,
        error,
        refetch: fetchTeacherClubs
    };
};