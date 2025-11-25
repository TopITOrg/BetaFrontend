'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Profile } from '@/components/Profile';
import { useClub } from '@/hooks/useTeacherClubs';
import { Input } from '@/components/ui/input';
import { Tag, FileText, MapPin, User, Calendar, GraduationCap, Users, Activity } from "lucide-react";

interface FormData {
    name: string;
    description: string;
    total_places: number | null;
    place: string;
    required_workout_per_week: number;
}

export default function EditSectionPage() {
    const params = useParams();
    const router = useRouter();
    const { club, loading, error, refetch } = useClub(params.id as string);
    const [updating, setUpdating] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        total_places: null,
        place: '',
        required_workout_per_week: 0,
    });

    // Заполняем форму данными клуба при загрузке
    useEffect(() => {
        if (club) {
            setFormData({
                name: club.name,
                description: club.description,
                total_places: club.total_places,
                place: club.place,
                required_workout_per_week: club.required_workout_per_week,
            });
        }
    }, [club]);

    // Обработка изменения формы
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'total_places' || name === 'required_workout_per_week'
                ? (value === '' ? null : Number(value))
                : value
        }));
    };

    // Сохранение изменений
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!club) return;

        setUpdating(true);
        setSuccess('');

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('Токен не найден');
                return;
            }

            const updateData = {
                name: formData.name !== club.name ? formData.name : undefined,
                description: formData.description !== club.description ? formData.description : undefined,
                total_places: formData.total_places !== club.total_places ? formData.total_places : undefined,
                place: formData.place !== club.place ? formData.place : undefined,
                required_workout_per_week: formData.required_workout_per_week !== club.required_workout_per_week
                    ? formData.required_workout_per_week
                    : undefined,
            };

            // Удаляем undefined поля
            Object.keys(updateData).forEach(key => {
                if (updateData[key as keyof typeof updateData] === undefined) {
                    delete updateData[key as keyof typeof updateData];
                }
            });

            // Если нет изменений
            if (Object.keys(updateData).length === 0) {
                setSuccess('Нет изменений для сохранения');
                setUpdating(false);
                return;
            }

            const response = await fetch(`http://localhost:8080/clubs/update/${club.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка обновления');
            }

            setSuccess('Секция успешно обновлена!');
            await refetch(); // Обновляем данные клуба
        } catch (err) {
            console.error('Ошибка при обновлении:', err);
            alert(err instanceof Error ? err.message : 'Произошла ошибка при обновлении секции');
        } finally {
            setUpdating(false);
        }
    };

    // Удаление секции
    const handleDelete = async () => {
        if (!club) return;

        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('Токен не найден');
                return;
            }

            const response = await fetch(`http://localhost:8080/clubs/delete/${club.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                router.push('/edit');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Ошибка при удалении секции');
            }
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            alert('Произошла ошибка при удалении секции');
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <Navbar/>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-lg">Загрузка...</div>
                </div>
            </main>
        );
    }

    if (error || !club) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <Navbar/>
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="text-lg text-red-500">{error || 'Секция не найдена'}</div>
                    <button
                        onClick={() => router.push('/edit')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Назад к профилю
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar/>

            <div className="flex">
                <div className="w-1/3">
                    <Profile/>
                </div>

                <div className="flex-1 p-8 max-w-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-black font-bold text-4xl">Редактирование секции</h1>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={deleteLoading}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            {deleteLoading ? 'Удаление...' : 'Удалить секцию'}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-md">
                        {/* Название */}
                        <div className="relative w-full">
                            <Input
                                name="name"
                                placeholder="Название секции"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled={loading}
                                required
                            />
                            <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {/* Описание */}
                        <div className="relative w-full">
              <textarea
                  name="description"
                  placeholder="Описание секции"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2 resize-none"
                  disabled={loading}
                  required
              />
                            <FileText className="absolute right-3 top-3 text-gray-500" size={20}/>
                        </div>

                        {/* Место проведения */}
                        <div className="relative w-full">
                            <Input
                                name="place"
                                placeholder="Место проведения"
                                value={formData.place}
                                onChange={handleInputChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled={loading}
                                required
                            />
                            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {/* Тренер (только чтение) */}
                        <div className="relative w-full">
                            <Input
                                placeholder="Тренер"
                                value={club.teacher}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {/* Тренировок в неделю */}
                        <div className="relative w-full">
                            <Input
                                name="required_workout_per_week"
                                type="number"
                                placeholder="Тренировок в неделю"
                                value={formData.required_workout_per_week}
                                onChange={handleInputChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled={loading}
                                required
                                min="1"
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {/* Уровень обучения (только чтение) */}
                        <div className="relative w-full">
                            <Input
                                placeholder="Уровень обучения"
                                value={club.education_level}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled
                            />
                            <GraduationCap className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {/* Количество мест */}
                        <div className="relative w-full">
                            <Input
                                name="total_places"
                                type="number"
                                placeholder="Количество мест"
                                value={formData.total_places || ''}
                                onChange={handleInputChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled={loading}
                                min="1"
                            />
                            <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {/* Вид спорта (только чтение) */}
                        <div className="relative w-full">
                            <Input
                                placeholder="Вид спорта"
                                value={club.sport_type}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled
                            />
                            <Activity className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {success && (
                            <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-600 text-sm text-center">{success}</p>
                            </div>
                        )}

                        <div className="flex gap-3 w-full justify-center">
                            <button
                                type="submit"
                                disabled={updating}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {updating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Сохранение...</span>
                                    </>
                                ) : (
                                    'Сохранить изменения'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/edit')}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Модальное окно подтверждения удаления */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-bold mb-4">Удаление секции</h3>
                        <p className="mb-6 text-gray-600">
                            Вы уверены, что хотите удалить секцию "{club.name}"? Это действие нельзя отменить.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {deleteLoading ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}