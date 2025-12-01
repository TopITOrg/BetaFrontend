import { useCallback, useEffect, useState } from 'react';
import api from '../lib/api';

export interface SectionMember {
    id: number;
    user_id: number;
    user_name: string;
    club_id: number;
    club_name: string;
    status: string;
    created_at: string;
    updated_at: string;
    user_email?: string;
    user_phone?: string;
    user_snl?: string;
    group_name?: string;
}

interface UseSectionMembersProps {
    clubId?: number;
}

export const useSectionMembers = ({ clubId }: UseSectionMembersProps = {}) => {
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
            console.log('=== DEBUG: Отправляем запрос на заявки ===');
            console.log('Club ID:', selectedClubId);

            const response = await api.post('/club-join-requests/get', {
                club_id: selectedClubId,
                status: 'approved',
                limit: 1000,
                offset: 0
            });

            const data = response.data;
            console.log('Полный ответ от /club-join-requests/get:', data);

            if (data.club_join_requests && Array.isArray(data.club_join_requests)) {
                console.log('Найдено заявок:', data.club_join_requests.length);

                const approvedMembers: SectionMember[] = data.club_join_requests.map((request: any) => ({
                    id: request.id || request.ID || 0,
                    user_id: request.user_id || request.UserID || 0,
                    user_name: request.user_name || request.UserName || '',
                    club_id: request.club_id || request.ClubID || 0,
                    club_name: request.club_name || request.ClubName || '',
                    status: request.status || request.Status || '',
                    created_at: request.created_at || request.CreatedAt || '',
                    updated_at: request.updated_at || request.UpdatedAt || '',
                    user_email: request.user_email || request.UserEmail || '',
                    user_phone: request.user_phone || request.UserPhone || '',
                    user_snl: request.user_snl || request.UserSnl || '',
                    group_name: request.group_name || request.GroupName || ''
                }));

                console.log('Преобразованные участники:', approvedMembers);
                setMembers(approvedMembers);
            } else if (data.ClubJoinRequests && Array.isArray(data.ClubJoinRequests)) {
                console.log('Найдено заявок:', data.ClubJoinRequests.length);

                const approvedMembers: SectionMember[] = data.ClubJoinRequests.map((request: any) => ({
                    id: request.id || request.ID || 0,
                    user_id: request.user_id || request.UserID || 0,
                    user_name: request.user_name || request.UserName || '',
                    club_id: request.club_id || request.ClubID || 0,
                    club_name: request.club_name || request.ClubName || '',
                    status: request.status || request.Status || '',
                    created_at: request.created_at || request.CreatedAt || '',
                    updated_at: request.updated_at || request.UpdatedAt || '',
                    user_email: request.user_email || request.UserEmail || '',
                    user_phone: request.user_phone || request.UserPhone || '',
                    user_snl: request.user_snl || request.UserSnl || '',
                    group_name: request.group_name || request.GroupName || ''
                }));

                console.log('Преобразованные участники:', approvedMembers);
                setMembers(approvedMembers);
            } else {
                console.warn('Неожиданный формат ответа или пустой массив:', data);
                setMembers([]);
            }
        } catch (err: any) {
            console.error('Ошибка при получении участников:', err);

            if (err.response) {
                console.error('Статус ошибки:', err.response.status);
                console.error('Данные ошибки:', err.response.data);

                if (err.response.status === 401) {
                    setError('Ошибка авторизации. Пожалуйста, войдите снова.');
                } else if (err.response.status === 403) {
                    setError('У вас нет прав для просмотра заявок.');
                } else if (err.response.status === 404) {
                    setError('Эндпоинт не найден. Проверьте URL.');
                } else if (err.response.status === 400) {
                    setError('Неверные параметры запроса.');
                } else {
                    setError(`Ошибка сервера: ${err.response.status}`);
                }
            } else if (err.request) {
                console.error('Запрос был сделан, но ответ не получен:', err.request);
                setError('Не удалось получить ответ от сервера. Проверьте подключение.');
            } else {
                console.error('Ошибка настройки запроса:', err.message);
                setError('Ошибка при отправке запроса: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log('useEffect: clubId изменился:', clubId);
        fetchMembers(clubId);
    }, [clubId, fetchMembers]);

    const refetch = () => {
        console.log('Ручной перезапрос участников для clubId:', clubId);
        fetchMembers(clubId);
    };

    return { members, loading, error, refetch };
};