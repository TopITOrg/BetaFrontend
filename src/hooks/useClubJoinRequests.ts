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

interface UseClubJoinRequestsParams {
    club_id?: number;
    user_id?: number;
    status?: string;
    limit?: number;
    offset?: number;
}

interface UseClubJoinRequestsResult {
    requests: ClubJoinRequest[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useClubJoinRequests = (params: UseClubJoinRequestsParams = {}): UseClubJoinRequestsResult => {
    const [requests, setRequests] = useState<ClubJoinRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const queryParams = new URLSearchParams();
            if (params.club_id) queryParams.append('club_id', params.club_id.toString());
            if (params.user_id) queryParams.append('user_id', params.user_id.toString());
            if (params.status) queryParams.append('status', params.status);
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.offset) queryParams.append('offset', params.offset.toString());

            const response = await fetch(`http://localhost:8080/club-join-requests/get?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }

            const data = await response.json();
            setRequests(data.club_join_requests || []);
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