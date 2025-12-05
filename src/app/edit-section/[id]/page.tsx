'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Navbar} from '@/components/navbar';
import {Profile} from '@/components/Profile';
import {useTeacherClubs} from '@/hooks/useTeacherClubs'; // Исправленный импорт
import {Input} from '@/components/ui/input';
import {CustomButton} from '@/components/CustomButton';
import {Activity, Calendar, FileText, GraduationCap, MapPin, Tag, User, Users} from "lucide-react";

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
    const {clubs, loading, error, refetch} = useTeacherClubs();
    const club = clubs.find(c => c.id === Number(params.id));

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
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

            Object.keys(updateData).forEach(key => {
                if (updateData[key as keyof typeof updateData] === undefined) {
                    delete updateData[key as keyof typeof updateData];
                }
            });

            if (Object.keys(updateData).length === 0) {
                setSuccess('Нет изменений для сохранения');
                setUpdating(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/clubs/update/${club.id}`, {
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
            await refetch();
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/clubs/delete/${club.id}`, {
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
                    <CustomButton
                        text="Назад к профилю"
                        isSelected={false}
                        onClick={() => router.push('/edit')}
                    />
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
                        <CustomButton
                            text={deleteLoading ? 'Удаление...' : 'Удалить секцию'}
                            isSelected={false}
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={deleteLoading}
                            className="bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-md">
                        <div className="relative w-full">
                            <Input
                                name="name"
                                placeholder="Название секции"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled={updating}
                                required
                            />
                            <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                 size={20}/>
                        </div>

                        <div className="relative w-full">
              <textarea
                  name="description"
                  placeholder="Описание секции"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2 resize-none"
                  disabled={updating}
                  required
              />
                            <FileText className="absolute right-3 top-3 text-gray-500" size={20}/>
                        </div>

                        <div className="relative w-full">
                            <Input
                                name="place"
                                placeholder="Место проведения"
                                value={formData.place}
                                onChange={handleInputChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled={updating}
                                required
                            />
                            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    size={20}/>
                        </div>

                        <div className="relative w-full">
                            <Input
                                placeholder="Тренер"
                                value={club.teacher}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                  size={20}/>
                        </div>

                        <div className="relative w-full">
                            <Input
                                name="required_workout_per_week"
                                type="number"
                                placeholder="Тренировок в неделю"
                                value={formData.required_workout_per_week}
                                onChange={handleInputChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled={updating}
                                required
                                min="1"
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                      size={20}/>
                        </div>

                        <div className="relative w-full">
                            <Input
                                placeholder="Уровень обучения"
                                value={club.education_level}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled
                            />
                            <GraduationCap className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                           size={20}/>
                        </div>

                        <div className="relative w-full">
                            <Input
                                name="total_places"
                                type="number"
                                placeholder="Количество мест"
                                value={formData.total_places || ''}
                                onChange={handleInputChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled={updating}
                                min="1"
                            />
                            <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                   size={20}/>
                        </div>

                        <div className="relative w-full">
                            <Input
                                placeholder="Вид спорта"
                                value={club.sport_type}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                                disabled
                            />
                            <Activity className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                      size={20}/>
                        </div>

                        {success && (
                            <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-600 text-sm text-center">{success}</p>
                            </div>
                        )}

                        <div className="flex gap-3 w-full justify-center">
                            <CustomButton
                                text={updating ? 'Сохранение...' : 'Сохранить изменения'}
                                isSelected={true}
                                type="submit"
                                disabled={updating}
                                width="200px"
                            />
                            <CustomButton
                                text="Отмена"
                                isSelected={false}
                                type="button"
                                onClick={() => router.push('/edit')}
                                width="120px"
                            />
                        </div>
                    </form>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-bold mb-4">Удаление секции</h3>
                        <p className="mb-6 text-gray-600">
                            Вы уверены, что хотите удалить секцию "{club.name}"? Это действие нельзя отменить.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <CustomButton
                                text="Отмена"
                                isSelected={false}
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleteLoading}
                                width="100px"
                            />
                            <CustomButton
                                text={deleteLoading ? 'Удаление...' : 'Удалить'}
                                isSelected={false}
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600"
                                width="100px"
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}