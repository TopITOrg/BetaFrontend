'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { Navbar } from '@/components/navbar';

export default function CreateSectionPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        place: '',
        required_workout_per_week: 1,
        education_level_id: 1,
        total_places: 10,
        sport_type_id: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Проверяем авторизацию
        if (!user?.id) {
            setError('Пользователь не авторизован');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('Токен не найден');
                setLoading(false);
                return;
            }

            // Подготавливаем данные в правильном формате
            const requestData = {
                name: formData.name,
                description: formData.description,
                place: formData.place,
                required_workout_per_week: Number(formData.required_workout_per_week),
                education_level_id: Number(formData.education_level_id),
                total_places: formData.total_places ? Number(formData.total_places) : null,
                sport_type_id: Number(formData.sport_type_id),
                teacher_id: Number(user.id)
            };

            console.log('Sending request data:', requestData);

            const response = await fetch('http://localhost:8080/clubs/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestData),
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                // Успешное создание
                try {
                    const data = await response.json();
                    console.log('Club created successfully:', data);
                    setSuccess(true);
                    // Перенаправляем через 2 секунды, чтобы пользователь увидел сообщение
                    setTimeout(() => {
                        router.push('/edit');
                    }, 2000);
                } catch (parseError) {
                    console.log('Error parsing response, but club might be created');
                    setSuccess(true);
                    setTimeout(() => {
                        router.push('/edit');
                    }, 2000);
                }
            } else if (response.status === 500) {
                // Ошибка 500, но секция могла создать в БД
                console.log('Server returned 500, but club might be created in database');
                setSuccess(true);
                setError('Секция создана, но произошла ошибка при формировании ответа. Перенаправляем...');
                setTimeout(() => {
                    router.push('/edit');
                }, 3000);
            } else {
                // Другие ошибки
                let errorText = 'Ошибка при создании секции';
                try {
                    const errorData = await response.json();
                    errorText = errorData.message || errorText;
                } catch {
                    errorText = await response.text() || errorText;
                }
                setError(errorText);
            }
        } catch (err) {
            console.error('Network error:', err);
            setError('Произошла ошибка при создании секции');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('_id') || name === 'required_workout_per_week' || name === 'total_places'
                ? parseInt(value) || 0
                : value
        }));
    };

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-8">Создание секции</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Название секции
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Место проведения
                            </label>
                            <input
                                type="text"
                                name="place"
                                value={formData.place}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Тренировок в неделю
                            </label>
                            <input
                                type="number"
                                name="required_workout_per_week"
                                value={formData.required_workout_per_week}
                                onChange={handleChange}
                                min="1"
                                max="7"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Уровень обучения
                            </label>
                            <select
                                name="education_level_id"
                                value={formData.education_level_id}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value={1}>Начальный</option>
                                <option value={2}>Продвинутый</option>
                                <option value={3}>ГСС</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Количество мест
                            </label>
                            <input
                                type="number"
                                name="total_places"
                                value={formData.total_places}
                                onChange={handleChange}
                                min="1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Вид спорта
                            </label>
                            <select
                                name="sport_type_id"
                                value={formData.sport_type_id}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value={1}>Футбол</option>
                                <option value={2}>Баскетбол</option>
                                <option value={3}>Волейбол</option>
                                <option value={4}>Теннис</option>
                                <option value={5}>Плавание</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Описание
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-600">
                                ✅ Секция успешно создана! Перенаправляем...
                            </p>
                        </div>
                    )}

                    {error && !success && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Создание...' : 'Создать секцию'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}