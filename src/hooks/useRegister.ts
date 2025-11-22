import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

interface RegisterData {
    full_name: string;
    social_network_link: string;
    phone_number: string;
    email: string;
    birth_date: string;
    password: string;
    group_id?: number | null;
}

interface RegisterResponse {
    id: number;
    full_name: string;
    social_network_link: string;
    phone_number: string;
    email: string;
    birth_date: string;
    role: string;
    group_id?: number;
    group_name?: string;
    created_at: string;
    updated_at: string;
    access_token: string;
    refresh_token: string;
}

export const useRegister = () => {
    const router = useRouter();

    return useMutation<RegisterResponse, Error, RegisterData>({
        mutationFn: async (userData: RegisterData) => {
            // Преобразуем дату в формат ISO
            const formattedData = {
                ...userData,
                birth_date: new Date(userData.birth_date).toISOString(),
                group_id: userData.group_id || null
            };

            const response = await api.post('/users/create', formattedData);
            return response.data;
        },
        onSuccess: (data) => {
            // Сохраняем токены
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            // Перенаправляем пользователя
            router.push('/clubs');
        },
    });
};