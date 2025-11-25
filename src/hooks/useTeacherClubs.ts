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
    sport_type_id: number;
    education_level_id: number;
}

interface UseTeacherClubsResult {
    clubs: TeacherClub[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

interface UseClubResult {
    club: TeacherClub | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Основной хук для получения списка клубов преподавателя
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
                return;
            }

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch('http://localhost:8080/clubs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
                        sport_type_id: club.sport_type_id || club.SportTypeID,
                        teacher: club.teacher || club.Teacher,
                        teacher_id: club.teacher_id || club.TeacherID,
                        total_places: club.total_places || club.TotalPlaces,
                        place: club.place || club.Place,
                        education_level: club.education_level || club.EducationLevel,
                        education_level_id: club.education_level_id || club.EducationLevelID,
                        required_workout_per_week: club.required_workout_per_week || club.RequiredWorkoutPerWeek
                    }));

                console.log('Final teacher clubs:', teacherClubs);
                setClubs(teacherClubs);
            } else {
                throw new Error('Неверный формат данных от сервера');
            }
        } catch (err) {
            console.error('Ошибка при загрузке секций тренера:', err);
            setError(err instanceof Error ? err.message : 'Не удалось загрузить данные о секциях');
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

// Хук для получения конкретного клуба по ID
export const useClub = (clubId: string | number): UseClubResult => {
    const [club, setClub] = useState<TeacherClub | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClub = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Токен не найден');
            }

            // Используем endpoint для получения конкретного клуба
            const response = await fetch('http://localhost:8080/clubs/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: parseInt(clubId as string)
                }),
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки клуба: ${response.status}`);
            }

            const clubData = await response.json();
            console.log('Club data:', clubData);

            // Преобразуем данные в единый формат
            const formattedClub: TeacherClub = {
                id: clubData.id || clubData.ID,
                name: clubData.name || clubData.Name,
                description: clubData.description || clubData.Description,
                sport_type: clubData.sport_type || clubData.SportType,
                sport_type_id: clubData.sport_type_id || clubData.SportTypeID,
                teacher: clubData.teacher || clubData.Teacher,
                teacher_id: clubData.teacher_id || clubData.TeacherID,
                total_places: clubData.total_places || clubData.TotalPlaces,
                place: clubData.place || clubData.Place,
                education_level: clubData.education_level || clubData.EducationLevel,
                education_level_id: clubData.education_level_id || clubData.EducationLevelID,
                required_workout_per_week: clubData.required_workout_per_week || clubData.RequiredWorkoutPerWeek
            };

            setClub(formattedClub);
        } catch (err) {
            console.error('Ошибка при загрузке клуба:', err);
            setError(err instanceof Error ? err.message : 'Не удалось загрузить данные о клубе');
            setClub(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clubId) {
            fetchClub();
        }
    }, [clubId]);

    return {
        club,
        loading,
        error,
        refetch: fetchClub
    };
};

// Хук для быстрого получения клуба из уже загруженного списка
export const useClubFromList = (clubId: string | number): TeacherClub | null => {
    const { clubs } = useTeacherClubs();

    return clubs.find(club => club.id === parseInt(clubId as string)) || null;
};