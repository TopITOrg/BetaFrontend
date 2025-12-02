'use client';
import {useEffect, useState} from 'react';
import {X} from 'lucide-react';
import {useClubs} from '@/hooks/useClubs';

interface CreateWorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (workoutData: { club_id: number; start_date: string; end_date: string }) => void;
    loading?: boolean;
}

export function CreateWorkoutModal({isOpen, onClose, onCreate, loading = false}: CreateWorkoutModalProps) {
    const [selectedClub, setSelectedClub] = useState<number>(-1);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const {clubs: allClubs} = useClubs();

    // Фильтруем клубы с id
    const availableClubs = allClubs
        .filter(club => club.id !== undefined && club.id !== null)
        .map(club => ({
            id: club.id as number,
            name: club.title || 'Без названия'
        }));

    useEffect(() => {
        if (isOpen) {
            const todayString = new Date().toISOString();
            const today = todayString.split('T')[0];
            if (today) {
                setSelectedDate(today);
            } else {
                setSelectedDate('');
            }
            setStartTime('18:00');
            setEndTime('19:30');
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (selectedClub === -1) {
            newErrors.club = 'Выберите секцию';
        }

        if (!selectedDate) {
            newErrors.date = 'Выберите дату тренировки';
        }

        if (!startTime) {
            newErrors.startTime = 'Укажите время начала';
        }

        if (!endTime) {
            newErrors.endTime = 'Укажите время окончания';
        }

        if (startTime && endTime && startTime >= endTime) {
            newErrors.endTime = 'Время окончания должно быть позже времени начала';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const startDateTime = new Date(`${selectedDate}T${startTime}:00`).toISOString();
        const endDateTime = new Date(`${selectedDate}T${endTime}:00`).toISOString();

        console.log('Sending workout data:', {
            club_id: selectedClub,
            start_date: startDateTime,
            end_date: endDateTime
        });

        onCreate({
            club_id: selectedClub,
            start_date: startDateTime,
            end_date: endDateTime
        });
    };

    const resetForm = () => {
        setSelectedClub(-1);
        setSelectedDate('');
        setStartTime('');
        setEndTime('');
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-xl">
                {/* Заголовок */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Создать тренировку</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        disabled={loading}
                        type="button"
                    >
                        <X size={20} className="text-gray-500"/>
                    </button>
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Выбор секции */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Секция *
                        </label>
                        <select
                            value={selectedClub}
                            onChange={(e) => {
                                setSelectedClub(Number(e.target.value));
                                if (errors.club) setErrors(prev => ({...prev, club: ''}));
                            }}
                            className={`w-full rounded-xl border p-3 text-sm transition-colors ${
                                errors.club
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                            }`}
                            disabled={loading}
                        >
                            <option value={-1}>Выберите секцию</option>
                            {availableClubs.map((club) => (
                                <option key={club.id} value={club.id}>
                                    {club.name}
                                </option>
                            ))}
                        </select>
                        {errors.club && (
                            <p className="text-red-500 text-xs mt-1">{errors.club}</p>
                        )}
                    </div>

                    {/* Дата тренировки */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Дата тренировки *
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                if (errors.date) setErrors(prev => ({...prev, date: ''}));
                            }}
                            className={`w-full rounded-xl border p-3 text-sm transition-colors ${
                                errors.date
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                            }`}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            disabled={loading}
                        />
                        {errors.date && (
                            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                        )}
                    </div>

                    {/* Время начала и окончания */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Время начала *
                            </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => {
                                    setStartTime(e.target.value);
                                    if (errors.startTime) setErrors(prev => ({...prev, startTime: ''}));
                                }}
                                className={`w-full rounded-xl border p-3 text-sm transition-colors ${
                                    errors.startTime
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                                }`}
                                required
                                disabled={loading}
                            />
                            {errors.startTime && (
                                <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Время окончания *
                            </label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => {
                                    setEndTime(e.target.value);
                                    if (errors.endTime) setErrors(prev => ({...prev, endTime: ''}));
                                }}
                                className={`w-full rounded-xl border p-3 text-sm transition-colors ${
                                    errors.endTime
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                                }`}
                                required
                                disabled={loading}
                            />
                            {errors.endTime && (
                                <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
                            )}
                        </div>
                    </div>

                    {/* Подсказка */}
                    <div className="text-xs text-gray-500 mt-2">
                        * Обязательные поля
                    </div>

                    {/* Кнопки */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Создание...
                                </>
                            ) : (
                                'Создать'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}