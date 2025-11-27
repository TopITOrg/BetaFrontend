import {useEffect, useState} from 'react';
import {useAuth} from '../../contexts/AuthContext';

export interface TeacherApplication {
    id: number;
    club_id: number;
    club_name: string;
    user_id: number;
    user_name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface UseTeacherApplicationsResult {
    applications: TeacherApplication[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useTeacherApplications = (): UseTeacherApplicationsResult => {
    const [applications, setApplications] = useState<TeacherApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAuth();

    const fetchTeacherApplications = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            // ВРЕМЕННО: используем моковые данные, пока не настроен бэкенд
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockApplications: TeacherApplication[] = [
                {
                    id: 1,
                    club_id: 1,
                    club_name: 'Футбол',
                    user_id: 15,
                    user_name: 'Иванов Иван',
                    status: 'pending',
                    created_at: '2024-04-20T10:00:00',
                    updated_at: '2024-04-20T10:00:00'
                },
                {
                    id: 2,
                    club_id: 5,
                    club_name: 'Баскетбол',
                    user_id: 16,
                    user_name: 'Петров Петр',
                    status: 'approved',
                    created_at: '2024-04-19T10:00:00',
                    updated_at: '2024-04-19T10:00:00'
                }
            ];

            console.log('Using mock teacher applications data');
            setApplications(mockApplications);

        } catch (err) {
            console.error('Ошибка при загрузке заявок учителя:', err);
            setError('Не удалось загрузить данные о заявках');
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && (user.role?.toLowerCase() === 'teacher' || user.role?.toLowerCase() === 'admin')) {
            fetchTeacherApplications();
        }
    }, [user]);

    return {
        applications,
        loading,
        error,
        refetch: fetchTeacherApplications
    };
};