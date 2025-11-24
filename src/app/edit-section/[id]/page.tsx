'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useTeacherClubs } from '@/hooks/useTeacherClubs';

interface ClubData {
    id: number;
    name: string;
    description: string;
    sport_type: string;
    teacher: string;
    total_places: number | null;
    place: string;
    education_level: string;
    required_workout_per_week: number;
}

export default function EditSectionPage() {
    const params = useParams();
    const router = useRouter();
    const { clubs, loading: clubsLoading, error: clubsError } = useTeacherClubs();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [localError, setLocalError] = useState('');

    // Находим нужный клуб из уже загруженных данных
    const club = clubs.find(c => c.id === parseInt(params.id as string));

    useEffect(() => {
        if (!clubsLoading) {
            if (clubsError) {
                setLocalError('Ошибка загрузки данных: ' + clubsError);
            } else if (!club) {
                setLocalError('Секция не найдена');
            }
        }
    }, [clubsLoading, club, clubsError]);

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('Токен не найден');
                return;
            }

            const response = await fetch(`http://localhost:8080/clubs/delete/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                router.push('/edit');
            } else {
                let errorMessage = 'Ошибка при удалении секции';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // Игнорируем ошибки парсинга
                }
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            alert('Произошла ошибка при удалении секции');
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const loading = clubsLoading;
    const error = localError;

    if (loading) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <Navbar selectedButton={-1} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-lg">Загрузка...</div>
                </div>
            </main>
        );
    }

    if (error || !club) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <Navbar selectedButton={-1} />
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
            <Navbar selectedButton={-1} />

            <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Редактирование секции</h1>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={deleteLoading}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {deleteLoading ? 'Удаление...' : 'Удалить секцию'}
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Название</h3>
                        <p className="text-gray-700">{club.name}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
                        <p className="text-gray-700">{club.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Место проведения</h3>
                            <p className="text-gray-700">{club.place}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Тренер</h3>
                            <p className="text-gray-700">{club.teacher}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Тренировок в неделю</h3>
                            <p className="text-gray-700">{club.required_workout_per_week}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Уровень обучения</h3>
                            <p className="text-gray-700">{club.education_level}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Количество мест</h3>
                            <p className="text-gray-700">{club.total_places || 'Не указано'}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Вид спорта</h3>
                            <p className="text-gray-700">{club.sport_type}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={() => router.push('/edit')}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Назад к профилю
                    </button>
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