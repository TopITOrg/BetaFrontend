import {useEffect, useState} from 'react';
import {useAuth} from '../../contexts/AuthContext';
import api from '../lib/api';

export interface StudentClub {
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

interface UseStudentClubsResult {
    clubs: StudentClub[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useStudentClubs = (): UseStudentClubsResult => {
    const [clubs, setClubs] = useState<StudentClub[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAuth();

    const fetchStudentClubs = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user?.id) {
                setClubs([]);
                setLoading(false);
                return;
            }

            console.log('Fetching student clubs for user:', user.id);

            // Получаем заявки студента - ИСПРАВЛЕНО на POST
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            // Отправляем POST запрос с JSON телом
            const responseRequests = await fetch('http://localhost:8080/club-join-requests/get', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    // Можно добавить limit и offset если нужно
                    limit: 100,
                    offset: 0
                }),
            });

            if (!responseRequests.ok) {
                throw new Error(`Ошибка загрузки заявок: ${responseRequests.status}`);
            }

            const dataRequests = await responseRequests.json();

            // Фильтруем только approved заявки
            const approvedRequests = (dataRequests.club_join_requests || []).filter(
                (req: any) => req.Status && req.Status.toLowerCase() === 'approved'
            );

            console.log('Approved requests:', approvedRequests);

            if (approvedRequests.length === 0) {
                setClubs([]);
                return;
            }

            // Получаем информацию о клубах из approved заявок
            const clubIds = approvedRequests.map((req: any) => req.ClubID);
            const uniqueClubIds = [...new Set(clubIds)];

            // Получаем все клубы и фильтруем только те, в которых студент состоит
            const response = await api.post('/clubs/', {
                limit: 1000,
                offset: 0
            });

            const allClubs = response.data.clubs || [];

            // Фильтруем клубы по ID из approved заявок
            const studentClubs: StudentClub[] = allClubs
                .filter((club: any) => uniqueClubIds.includes(club.ID))
                .map((club: any) => ({
                    id: club.ID,
                    name: club.Name,
                    description: club.Description,
                    sport_type: club.SportType,
                    teacher: club.Teacher,
                    total_places: club.TotalPlaces,
                    place: club.Place,
                    education_level: club.EducationLevel,
                    required_workout_per_week: club.RequiredWorkoutPerWeek
                }));

            console.log('Student clubs (dynamic):', studentClubs);
            setClubs(studentClubs);

        } catch (err) {
            console.error('Error in fetchStudentClubs:', err);
            setError('Не удалось загрузить данные о секциях');
            setClubs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role?.toLowerCase() === 'student') {
            fetchStudentClubs();
        } else {
            setLoading(false);
        }
    }, [user]);

    return {
        clubs,
        loading,
        error,
        refetch: fetchStudentClubs
    };
};