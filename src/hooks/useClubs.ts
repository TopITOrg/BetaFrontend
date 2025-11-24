import type { ClubFromAPI } from '@/types/club'; // Добавьте type
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface GetClubsParams {
    limit?: number;
    offset?: number;
    name?: string;
    place?: string;
    sport_type?: string;
    teacher?: string;
    education_level?: string;
}

interface GetClubsResponse {
    Clubs: ClubFromAPI[];
}

export const useClubs = (params: GetClubsParams = {}) => {
    return useQuery({
        queryKey: ['clubs', params],
        queryFn: async (): Promise<ClubFromAPI[]> => {
            const response = await api.post<GetClubsResponse>('/clubs', {
                limit: 100,
                offset: 0,
                ...params
            });
            return response.data.Clubs;
        },
        staleTime: 5 * 60 * 1000,
    });
};