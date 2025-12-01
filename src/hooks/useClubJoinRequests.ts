import {useEffect, useState} from 'react';
import { useAuth } from '../../contexts/AuthContext';

export interface ClubJoinRequest {
    id: number;
    club_id: number;
    club_name: string;
    user_id: number;
    user_name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface UseClubJoinRequestsParams {
    club_id?: number;
    user_id?: number;
    status?: string;
    limit?: number;
    offset?: number;
}

export interface UseClubJoinRequestsResult {
    requests: ClubJoinRequest[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useClubJoinRequests = (params: UseClubJoinRequestsParams = {}): UseClubJoinRequestsResult => {
    const [requests, setRequests] = useState<ClubJoinRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchRequests = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            // Создаем тело запроса в формате JSON
            const requestBody: any = {};

            // Для студентов автоматически добавляем их user_id
            if (user?.role?.toLowerCase() === 'student') {
                requestBody.user_id = user.id;
            } else {
                // Для админов/учителей используем переданный user_id или ничего
                if (params.user_id !== undefined) {
                    requestBody.user_id = params.user_id;
                }
            }

            // Добавляем другие параметры если они есть
            if (params.club_id !== undefined) {
                requestBody.club_id = params.club_id;
            }
            if (params.status !== undefined) {
                requestBody.status = params.status;
            }
            if (params.limit !== undefined) {
                requestBody.limit = params.limit;
            }
            if (params.offset !== undefined) {
                requestBody.offset = params.offset;
            }

            console.log('Fetching club join requests with body:', requestBody);

            // Отправляем POST запрос с JSON телом
            const response = await fetch('http://localhost:8080/club-join-requests/get', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                if (response.status === 403 && user?.role?.toLowerCase() === 'student') {
                    throw new Error('У вас нет прав для просмотра чужих заявок');
                }
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }

            const data = await response.json();
            console.log('Club join requests response:', data);

            // Преобразуем данные из серверного формата в наш формат
            const formattedRequests: ClubJoinRequest[] = (data.club_join_requests || []).map((serverRequest: any) => ({
                id: serverRequest.ID || serverRequest.id,
                club_id: serverRequest.ClubID || serverRequest.club_id,
                club_name: serverRequest.ClubName || serverRequest.club_name,
                user_id: serverRequest.UserID || serverRequest.user_id,
                user_name: serverRequest.UserName || serverRequest.user_name,
                status: serverRequest.Status || serverRequest.status,
                created_at: serverRequest.CreatedAt || serverRequest.created_at,
                updated_at: serverRequest.UpdatedAt || serverRequest.updated_at,
            }));

            setRequests(formattedRequests);
        } catch (err) {
            console.error('Ошибка при загрузке заявок:', err);
            setError(err instanceof Error ? err.message : 'Не удалось загрузить данные о заявках');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [params.club_id, params.user_id, params.status, params.limit, params.offset, user?.id]);

    return {
        requests,
        loading,
        error,
        refetch: fetchRequests
    };
};