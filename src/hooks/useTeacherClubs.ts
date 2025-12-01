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

            console.log('=== Начало загрузки клубов ===');
            console.log('ID тренера:', user?.id);

            // Получаем все клубы
            const response = await api.post('/clubs/', {
                limit: 1000,
                offset: 0
            });

            const data = response.data;
            console.log('=== Полный ответ от /clubs/ ===', data);

            // Проанализируем структуру ответа
            console.log('Тип данных:', typeof data);
            console.log('Ключи объекта:', data ? Object.keys(data) : 'data is null');

            // Попробуем разные варианты извлечения массива клубов
            let clubsArray: any[] = [];

            // Вариант 1: ответ уже массив
            if (Array.isArray(data)) {
                clubsArray = data;
                console.log('Ответ - массив, размер:', clubsArray.length);
            }
            // Вариант 2: ответ в поле 'clubs'
            else if (data && data.clubs && Array.isArray(data.clubs)) {
                clubsArray = data.clubs;
                console.log('Ответ в поле "clubs", размер:', clubsArray.length);
            }
            // Вариант 3: ответ в поле 'Clubs'
            else if (data && data.Clubs && Array.isArray(data.Clubs)) {
                clubsArray = data.Clubs;
                console.log('Ответ в поле "Clubs", размер:', clubsArray.length);
            }
            // Вариант 4: поищем любой массив в объекте
            else if (data && typeof data === 'object') {
                for (const key in data) {
                    if (Array.isArray(data[key])) {
                        console.log(`Найден массив в поле "${key}"`);
                        clubsArray = data[key];
                        break;
                    }
                }
            }

            if (clubsArray.length === 0) {
                console.warn('Не найден массив клубов в ответе');
                console.log('Весь ответ:', JSON.stringify(data, null, 2));
                setClubs([]);
                return;
            }

            // Выведем первый клуб для анализа структуры
            if (clubsArray[0]) {
                console.log('Первый клуб в массиве:', clubsArray[0]);
                console.log('Ключи первого клуба:', Object.keys(clubsArray[0]));
            }

            // Преобразуем все клубы в единый формат
            const allClubs: TeacherClub[] = clubsArray.map((club: any) => {
                // Определяем значения полей с учетом разных вариантов написания
                const clubData = {
                    id: club.id || club.ID || 0,
                    name: club.name || club.Name || '',
                    description: club.description || club.Description || '',
                    sport_type: club.sport_type || club.SportType || club.sportType || '',
                    teacher: club.teacher || club.Teacher || '',
                    teacher_id: club.teacher_id || club.TeacherID || club.teacherId || 0,
                    total_places: club.total_places || club.TotalPlaces || club.totalPlaces || null,
                    taken_places: club.taken_places || club.TakenPlaces || club.takenPlaces || 0,
                    place: club.place || club.Place || '',
                    education_level: club.education_level || club.EducationLevel || club.educationLevel || '',
                    required_workout_per_week: club.required_workout_per_week || club.RequiredWorkoutPerWeek || club.requiredWorkoutPerWeek || 0
                };

                console.log(`Клуб "${clubData.name}": teacher_id=${clubData.teacher_id}`);
                return clubData;
            });

            // Фильтруем клубы текущего тренера
            const teacherId = user?.id;
            const teacherClubs = allClubs.filter(club => {
                console.log(`Фильтрация: club.teacher_id=${club.teacher_id}, user.id=${teacherId}, совпадение=${club.teacher_id === teacherId}`);
                return club.teacher_id === teacherId;
            });

            console.log('Всего клубов:', allClubs.length);
            console.log('Клубов тренера:', teacherClubs.length);
            console.log('Клубы тренера:', teacherClubs);

            setClubs(teacherClubs);

        } catch (err: any) {
            console.error('Ошибка при загрузке секций тренера:', err);
            if (err.response) {
                console.error('Данные ошибки:', err.response.data);
                console.error('Статус ошибки:', err.response.status);
            }
            setError(err.message || 'Не удалось загрузить данные о секциях');
            setClubs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            console.log('Запуск загрузки клубов для тренера ID:', user.id);
            fetchTeacherClubs();
        } else {
            console.log('Пользователь не авторизован или нет ID');
            setLoading(false);
            setError('Пользователь не авторизован');
            setClubs([]);
        }
    }, [user]);

    return {
        clubs,
        loading,
        error,
        refetch: fetchTeacherClubs
    };
};