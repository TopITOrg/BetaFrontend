'use client'
import { Calendar, Mail, Phone, Send, User, Lock} from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

interface FormData {
    full_name: string;
    social_network_link: string;
    phone_number: string;
    email: string;
    birth_date: string;
    password: string;
}

export function EditProfileForm() {
    const {user, updateUser} = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        full_name: '',
        social_network_link: '',
        phone_number: '',
        email: '',
        birth_date: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            const formatDateForInput = (dateString: string | undefined): string => {
                if (!dateString) return '';
                try {
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) {
                        return '';
                    }
                    // Исправленная строка - добавляем проверку на undefined
                    const isoString = date.toISOString();
                    return isoString.split('T')[0] || '';
                } catch {
                    return '';
                }
            };

            setFormData({
                full_name: user.full_name ?? '',
                social_network_link: user.social_network_link ?? '',
                phone_number: user.phone_number ?? '',
                email: user.email ?? '',
                birth_date: formatDateForInput(user.birth_date),
                password: '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('access_token');
            if (!token || !user?.id) {
                setError('Токен не найден. Пожалуйста, войдите снова.');
                setIsLoading(false);
                return;
            }

            const updateData: any = {
                id: user.id,
            };

            if (formData.full_name.trim() && formData.full_name !== user.full_name) {
                updateData.full_name = formData.full_name;
            }
            if (formData.social_network_link !== user.social_network_link) {
                updateData.social_network_link = formData.social_network_link || null;
            }
            if (formData.phone_number !== user.phone_number) {
                updateData.phone_number = formData.phone_number || null;
            }
            if (formData.email.trim() && formData.email !== user.email) {
                updateData.email = formData.email;
            }

            // Для даты проверяем, изменилась ли она
            if (formData.birth_date) {
                const newBirthDate = new Date(formData.birth_date).toISOString();
                const oldBirthDate = user.birth_date ? new Date(user.birth_date).toISOString() : null;
                if (newBirthDate !== oldBirthDate) {
                    updateData.birth_date = newBirthDate;
                }
            }

            if (formData.password.trim()) {
                updateData.password = formData.password;
            }

            if (Object.keys(updateData).length === 1) {
                setError('Нет изменений для сохранения');
                setIsLoading(false);
                return;
            }

            const response = await fetch('http://localhost:8080/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const responseText = await response.text();

            let responseData;
            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch {
                setError('Неверный формат ответа от сервера');
                setIsLoading(false);
                return;
            }

            if (response.ok) {
                updateUser({
                    full_name: responseData.full_name,
                    social_network_link: responseData.social_network_link,
                    phone_number: responseData.phone_number,
                    email: responseData.email,
                    birth_date: responseData.birth_date,
                    group_id: responseData.group_id,
                    group_name: responseData.group_name,
                });

                setSuccess('Профиль успешно обновлен!');
                setFormData(prev => ({...prev, password: ''}));
            } else {
                setError(responseData.message || `Ошибка ${response.status} при обновлении профиля`);
            }
        } catch {
            setError('Произошла ошибка при обновлении профиля');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-5 w-full">
            <h1 className="text-black font-bold text-4xl">Редактирование профиля</h1>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-md">
                <div className="relative w-full">
                    <Input
                        name="full_name"
                        placeholder="ФИО"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        disabled={isLoading}
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>

                <div className="relative w-full">
                    <Input
                        name="social_network_link"
                        placeholder="Telegram аккаунт"
                        value={formData.social_network_link}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        disabled={isLoading}
                    />
                    <Send className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>

                <div className="relative w-full">
                    <Input
                        name="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        disabled={isLoading}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>

                <div className="relative w-full">
                    <Input
                        name="phone_number"
                        placeholder="Номер телефона"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        disabled={isLoading}
                    />
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>

                <div className="relative w-full">
                    <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        disabled={isLoading}
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>

                <div className="relative w-full">
                    <Input
                        name="password"
                        type="password"
                        placeholder="Новый пароль"
                        value={formData.password}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        disabled={isLoading}
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>

                {error && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 text-sm text-center">{success}</p>
                    </div>
                )}

                <div className="flex gap-3 w-full justify-center">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Сохранение...</span>
                            </>
                        ) : (
                            'Сохранить'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}