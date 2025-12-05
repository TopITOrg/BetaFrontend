'use client';

import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';

interface User {
    id: number;
    full_name: string;
    email: string;
    role: string;
    social_network_link?: string;
    phone_number?: string;
    birth_date?: string;
    group_id?: number;
    group_name?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User, tokens: { access_token: string; refresh_token: string }) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    fetchUserData: () => Promise<void>; // Новая функция для загрузки данных
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Функция для загрузки данных пользователя
    const fetchUserData = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/users/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();

                // Форматируем дату рождения для хранения
                const formattedUserData = {
                    ...userData,
                    birth_date: userData.birth_date
                        ? new Date(userData.birth_date).toISOString()
                        : undefined,
                };

                localStorage.setItem('user_data', JSON.stringify(formattedUserData));
                setUser(formattedUserData);
                setIsAuthenticated(true);
            } else {
                console.error('Failed to fetch user data:', response.status);
                // Если токен невалидный, делаем логаут
                if (response.status === 401) {
                    logout();
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user_data');

        if (token && userData) {
            try {
                // Сначала устанавливаем данные из localStorage
                const parsedUserData = JSON.parse(userData);
                setUser(parsedUserData);
                setIsAuthenticated(true);

                // Затем загружаем актуальные данные с сервера
                fetchUserData();
            } catch (error) {
                console.error('Error parsing user data:', error);
                logout();
            }
        } else {
            setIsLoading(false);
        }
    }, [fetchUserData]);

    const login = async (userData: User, tokens: { access_token: string; refresh_token: string }) => {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);

        // Сохраняем базовые данные
        const userToStore = {
            ...userData,
            birth_date: userData.birth_date || undefined,
        };

        localStorage.setItem('user_data', JSON.stringify(userToStore));
        setUser(userToStore);
        setIsAuthenticated(true);

        // Загружаем полные данные
        await fetchUserData();
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');

        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = {...user, ...userData};
            localStorage.setItem('user_data', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            login,
            logout,
            updateUser,
            fetchUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};