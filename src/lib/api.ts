import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Просто добавляем токен к каждому запросу
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Простая обработка ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data?.message) {
            error.message = error.response.data.message;
        }

        // Если 401 - просто логируем, не пытаемся обновлять токен
        if (error.response?.status === 401) {
            console.error('401 Unauthorized - token might be invalid or expired');
        }

        return Promise.reject(error);
    }
);

export default api;