import {useCallback, useEffect, useState} from 'react';
import api from '../lib/api'; // Используем тот же axios инстанс, что и в useTeacherClubs

export interface SectionMember {
    ID: number;
    UserID: number;
    UserName: string;
    ClubID: number;
    ClubName: string;
    Status: string;
    CreatedAt: string;
    UpdatedAt: string;
}

interface UseSectionMembersProps {
    clubId?: number;
}

export const useSectionMembers = ({clubId}: UseSectionMembersProps = {}) => {
    const [members, setMembers] = useState<SectionMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = useCallback(async (selectedClubId?: number) => {
        if (!selectedClubId) {
            setMembers([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Используем api.post, как в useTeacherClubs
            const response = await api.post('/club-join-requests/get', {
                club_id: selectedClubId,
                status: 'approved'
            });

            const data = response.data;
            console.log('Members data from server:', data);

            // Пробуем оба варианта названия поля
            if (data.ClubJoinRequests) {
                setMembers(data.ClubJoinRequests);
            } else if (data.club_join_requests) {
                setMembers(data.club_join_requests);
            } else {
                console.warn('Неожиданный формат ответа:', data);
                setMembers([]);
            }
        } catch (err: any) {
            console.error('Error fetching members:', err);

            // Более информативная ошибка
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Ошибка авторизации. Пожалуйста, войдите снова.');
                } else if (err.response.status === 404) {
                    setError('Эндпоинт не найден. Проверьте настройки API.');
                } else {
                    setError(`Ошибка сервера: ${err.response.status} - ${err.response.data?.message || 'Неизвестная ошибка'}`);
                }
            } else {
                setError(err.message || 'Неизвестная ошибка');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers(clubId);
    }, [clubId, fetchMembers]);

    const refetch = () => {
        fetchMembers(clubId);
    };

    return {members, loading, error, refetch};
};