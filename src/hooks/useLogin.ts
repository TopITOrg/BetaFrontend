import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
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

export const useLogin = () => {
    const router = useRouter();

    return useMutation<LoginResponse, Error, LoginData>({
        mutationFn: async (loginData: LoginData) => {
            const response = await api.post('/users/login', loginData);
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