import {useEffect, useState} from 'react';
import {useAuth} from '../../contexts/AuthContext';

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

            // Получаем заявки студента со статусом "approved"
            const joinRequestsResponse = await fetch('http://localhost:8080/club_join_requests/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user?.id,
                    status: 'approved',
                    limit: 1000,
                    offset: 0
                }),
            });

            if (!joinRequestsResponse.ok) {
                throw new Error(`Ошибка загрузки заявок: ${joinRequestsResponse.status}`);
            }

            const joinRequestsData = await joinRequestsResponse.json();
            console.log('Approved join requests:', joinRequestsData);

            if (joinRequestsData.club_join_requests && Array.isArray(joinRequestsData.club_join_requests)) {
                // Получаем ID всех клубов, в которых студент состоит
                const clubIds = joinRequestsData.club_join_requests.map((request: any) => request.club_id);

                if (clubIds.length === 0) {
                    setClubs([]);
                    setLoading(false);
                    return;
                }

                // Получаем информацию о каждом клубе
                const clubDetailsPromises = clubIds.map(async (clubId: number) => {
                    const clubResponse = await fetch('http://localhost:8080/club/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: clubId
                        }),
                    });

                    if (!clubResponse.ok) {
                        console.error(`Ошибка загрузки клуба ${clubId}: ${clubResponse.status}`);
                        return null;
                    }

                    const clubData = await clubResponse.json();
                    return clubData;
                });

                const clubDetails = await Promise.all(clubDetailsPromises);

                // Фильтруем null значения и преобразуем данные
                const validClubs: StudentClub[] = clubDetails
                    .filter(club => club !== null)
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

                console.log('Student clubs:', validClubs);
                setClubs(validClubs);
            } else {
                setClubs([]);
            }
        } catch (err) {
            console.error('Ошибка при загрузке секций студента:', err);
            setError('Не удалось загрузить данные о секциях');
            setClubs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role?.toLowerCase() === 'student') {
            fetchStudentClubs();
        }
    }, [user]);

    return {
        clubs,
        loading,
        error,
        refetch: fetchStudentClubs
    };
};