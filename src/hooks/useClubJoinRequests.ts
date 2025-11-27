import {useEffect, useState} from 'react';

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

// Добавляем экспорт интерфейсов параметров и результата
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

    const fetchRequests = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const queryParams = new URLSearchParams();
            if (params.club_id !== undefined) queryParams.append('club_id', params.club_id.toString());
            if (params.user_id !== undefined) queryParams.append('user_id', params.user_id.toString());
            if (params.status) queryParams.append('status', params.status);
            if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
            if (params.offset !== undefined) queryParams.append('offset', params.offset.toString());

            const url = `http://localhost:8080/club-join-requests/get?${queryParams}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }

            const data = await response.json();

            // Преобразуем данные из серверного формата в наш формат
            const formattedRequests: ClubJoinRequest[] = (data.club_join_requests || []).map((serverRequest: any) => ({
                id: serverRequest.ID,
                club_id: serverRequest.ClubID,
                club_name: serverRequest.ClubName,
                user_id: serverRequest.UserID,
                user_name: serverRequest.UserName,
                status: serverRequest.Status,
                created_at: serverRequest.CreatedAt,
                updated_at: serverRequest.UpdatedAt,
            }));

            setRequests(formattedRequests);
        } catch (err) {
            console.error('Ошибка при загрузке заявок:', err);
            setError('Не удалось загрузить данные о заявках');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [params.club_id, params.user_id, params.status, params.limit, params.offset]);

    return {
        requests,
        loading,
        error,
        refetch: fetchRequests
    };
};