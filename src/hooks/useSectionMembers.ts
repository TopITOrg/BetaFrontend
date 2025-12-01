import { useCallback, useEffect, useState } from 'react';
import api from '../lib/api';

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

            // Используем snake_case, как в бекенде
            const response = await api.post('/club-join-requests/get', {
                club_id: selectedClubId,  // snake_case
                status: 'approved',
                limit: 1000,
                offset: 0
            });

            const data = response.data;
            console.log('Полный ответ от /club-join-requests/get:', data);

            // Согласно GetClubJoinRequestsResponse, поле называется ClubJoinRequests
            if (data.ClubJoinRequests && Array.isArray(data.ClubJoinRequests)) {
                console.log('Найдено заявок:', data.ClubJoinRequests.length);
                console.log('Первая заявка:', data.ClubJoinRequests[0]);

                const approvedMembers = data.ClubJoinRequests.map((request: any) => ({
                    ID: request.id || request.ID || 0,
                    UserID: request.user_id || request.UserID || 0,
                    UserName: request.user_name || request.UserName || '',
                    ClubID: request.club_id || request.ClubID || 0,
                    ClubName: request.club_name || request.ClubName || '',
                    Status: request.status || request.Status || '',
                    CreatedAt: request.created_at || request.CreatedAt || '',
                    UpdatedAt: request.updated_at || request.UpdatedAt || ''
                }));

                console.log('Преобразованные участники:', approvedMembers);
                setMembers(approvedMembers);
            } else {
                console.warn('Неожиданный формат ответа или пустой массив:', data);
                setMembers([]);
            }
        } catch (err: any) {
            console.error('Ошибка при получении участников:', err);

            // Подробное логирование ошибки
            if (err.response) {
                console.error('Статус ошибки:', err.response.status);
                console.error('Данные ошибки:', err.response.data);
                console.error('Заголовки ошибки:', err.response.headers);

                if (err.response.status === 401) {
                    setError('Ошибка авторизации. Пожалуйста, войдите снова.');
                } else if (err.response.status === 403) {
                    setError('У вас нет прав для просмотра заявок.');
                } else if (err.response.status === 404) {
                    setError('Эндпоинт не найден. Проверьте URL.');
                } else {
                    setError(`Ошибка сервера: ${err.response.status} - ${err.response.data?.message || 'Неизвестная ошибка'}`);
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