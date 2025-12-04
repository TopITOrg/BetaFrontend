import {useState} from 'react';

interface UseUpdateClubJoinRequestResult {
    updateRequest: (requestId: number, status: string) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export const useUpdateClubJoinRequest = (): UseUpdateClubJoinRequestResult => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateRequest = async (requestId: number, status: string) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/club-join-requests/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({status}),
            });

            if (!response.ok) {
                throw new Error(`Ошибка обновления: ${response.status}`);
            }

            // Успешное обновление
        } catch (err) {
            console.error('Ошибка при обновлении заявки:', err);
            setError('Не удалось обновить заявку');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateRequest,
        loading,
        error
    };
};