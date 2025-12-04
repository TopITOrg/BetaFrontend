'use client'
import {Calendar, Lock, Mail, Phone, Send, Trash2, User, X} from "lucide-react";
import {useEffect, useState} from "react";
import {Input} from "./ui/input";
import {useAuth} from "../../contexts/AuthContext";
import {useRouter} from "next/navigation";

interface FormData {
    full_name: string;
    social_network_link: string;
    phone_number: string;
    email: string;
    birth_date: string;
    password: string;
}

export function EditProfileForm() {
    const {user, updateUser, fetchUserData, logout} = useAuth();
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        if (!user || !user.full_name) {
            fetchUserData();
        }
    }, [fetchUserData]);

    useEffect(() => {
        if (user) {
            const formatDateForInput = (dateString: string | undefined): string => {
                if (!dateString) return '';
                try {
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) {
                        return '';
                    }
                    return date.toISOString().split('T')[0] || '';
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

            if (formData.birth_date) {
                const newBirthDate = new Date(formData.birth_date).toISOString();
                const oldBirthDate = user.birth_date ? new Date(user.birth_date).toISOString() : null;
                if (newBirthDate !== oldBirthDate) {
                    updateData.birth_date = newBirthDate;
                }
            } else if (user.birth_date) {
                updateData.birth_date = null;
            }

            if (formData.password.trim()) {
                updateData.password = formData.password;
            }

            if (Object.keys(updateData).length === 1) {
                setError('Нет изменений для сохранения');
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/users/update`, {
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

                await fetchUserData();

                setSuccess('Профиль успешно обновлен!');
                setFormData(prev => ({...prev, password: ''}));
            } else {
                setError(responseData.message || `Ошибка ${response.status} при обновлении профиля`);
            }
        } catch (error) {
            console.error('Update error:', error);
            setError('Произошла ошибка при обновлении профиля');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user?.id) return;

        setIsDeleting(true);
        setDeleteError('');

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setDeleteError('Токен не найден. Пожалуйста, войдите снова.');
                setIsDeleting(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/users/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: user.id,
                    password: deletePassword
                }),
            });

            const responseText = await response.text();
            let responseData;

            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch {
                setDeleteError('Неверный формат ответа от сервера');
                setIsDeleting(false);
                return;
            }

            if (response.ok) {
                setSuccess('Аккаунт успешно удален!');

                if (logout) {
                    logout();
                } else {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }

                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setDeleteError(responseData.message || `Ошибка ${response.status} при удалении аккаунта`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            setDeleteError('Произошла ошибка при удалении аккаунта');
        } finally {
            setIsDeleting(false);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                <h1 className="text-black font-bold text-4xl">Редактирование профиля</h1>
                <div className="text-gray-500">Загрузка данных...</div>
            </div>
        );
    }

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
                                <div
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Сохранение...</span>
                            </>
                        ) : (
                            'Сохранить'
                        )}
                    </button>
                </div>

                <div className="w-full mt-8 pt-6 border-t border-gray-300">
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full px-6 py-3 bg-gray-100 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <Trash2 size={18}/>
                        Удалить аккаунт
                    </button>
                </div>
            </form>

            {/* Модальное окно подтверждения удаления */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Удаление аккаунта</h2>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeletePassword('');
                                    setDeleteError('');
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300 flex items-center justify-center"
                                disabled={isDeleting}
                            >
                                <X size={20} className="text-gray-600"/>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="text-center">
                                <div
                                    className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="text-red-500" size={28}/>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Вы уверены, что хотите удалить аккаунт?
                                </h3>
                                <p className="text-gray-600">
                                    Это действие необратимо. Все ваши данные будут удалены.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Введите пароль для подтверждения *
                                </label>
                                <div className="relative">
                                    <Input
                                        type="password"
                                        placeholder="Текущий пароль"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        className="rounded-xl border-gray-300 border p-2 w-full pr-10"
                                        disabled={isDeleting}
                                    />
                                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                          size={20}/>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    * Обязательное поле
                                </div>
                            </div>

                            {deleteError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm text-center">{deleteError}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeletePassword('');
                                        setDeleteError('');
                                    }}
                                    className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                                        hover:text-blue-500 hover:border-blue-500 hover:bg-gray-200 hover:scale-105
                                        transition-all duration-400 ease-in-out h-[48px] w-1/2 flex items-center justify-center"
                                    type="button"
                                    disabled={isDeleting}
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="rounded-xl font-bold border-2 bg-red-500 text-white border-red-500
                                        hover:bg-red-600 hover:border-red-600 hover:text-white hover:scale-105
                                        transition-all duration-400 ease-in-out h-[48px] w-1/2 flex items-center justify-center"
                                    type="button"
                                    disabled={isDeleting || !deletePassword}
                                >
                                    {isDeleting ? "Удаление..." : "Удалить аккаунт"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}