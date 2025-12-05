'use client';
import {useEffect, useState} from 'react';
import {X} from 'lucide-react';
import {Button} from "@/components/ui/button";
import type {Workout} from '@/hooks/useWorkouts';

interface EditWorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (workoutData: { id: number; start_date?: string; end_date?: string; cancelled?: boolean }) => void;
    workout: Workout;
    loading?: boolean;
}

export function EditWorkoutModal({isOpen, onClose, onUpdate, workout, loading = false}: EditWorkoutModalProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [cancelled, setCancelled] = useState(false);
    const [dateError, setDateError] = useState<string | null>(null);

    useEffect(() => {
        if (workout) {
            try {
                const start = new Date(workout.start_date);
                const end = new Date(workout.end_date);

                // Проверяем, что даты валидны
                if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                    console.error('Invalid date in workout:', workout);
                    return;
                }

                // Форматируем дату для input[type="date"]
                const localStart = new Date(start.getTime() - (start.getTimezoneOffset() * 60000));
                const dateValue = localStart.toISOString().split('T')[0] || '';
                setSelectedDate(dateValue);

                // Форматируем время для input[type="time"]
                setStartTime(
                    `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`
                );
                setEndTime(
                    `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`
                );
                setCancelled(workout.cancelled || false);

                // Проверяем, не прошла ли исходная дата тренировки
                checkDateValidity(dateValue, startTime);
            } catch (error) {
                console.error('Error parsing workout dates:', error);
            }
        }
    }, [workout]);

    const checkDateValidity = (date: string, time: string) => {
        if (!date || !time) return;

        const selectedDateTime = new Date(`${date}T${time}:00`);
        const now = new Date();

        if (selectedDateTime < now) {
            setDateError('Нельзя установить дату тренировки в прошлом. Пожалуйста, выберите дату в будущем.');
        } else {
            setDateError(null);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        checkDateValidity(newDate, startTime);
    };

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setStartTime(newTime);
        checkDateValidity(selectedDate, newTime);
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setEndTime(newTime);
        if (!dateError) {
            // Если нет других ошибок, очищаем сообщение
            setDateError(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDate) {
            setDateError('Выберите дату тренировки');
            return;
        }

        if (!startTime || !endTime) {
            setDateError('Укажите время начала и окончания');
            return;
        }

        if (startTime >= endTime) {
            setDateError('Время начала должно быть раньше времени окончания');
            return;
        }

        const selectedDateTime = new Date(`${selectedDate}T${startTime}:00`);
        const now = new Date();

        if (selectedDateTime < now) {
            setDateError('Нельзя установить дату тренировки в прошлом. Пожалуйста, выберите будущую дату.');
            return;
        }

        const startDateObj = new Date(`${selectedDate}T${startTime}:00`);
        const endDateObj = new Date(`${selectedDate}T${endTime}:00`);

        const startDateTime = startDateObj.toISOString().replace(/\.\d{3}Z$/, 'Z');
        const endDateTime = endDateObj.toISOString().replace(/\.\d{3}Z$/, 'Z');

        onUpdate({
            id: workout.id,
            start_date: startDateTime,
            end_date: endDateTime,
            cancelled
        });
    };

    const handleClose = () => {
        setDateError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Редактировать тренировку</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    >
                        <X size={20} className="text-gray-600"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Дата тренировки *
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className={`w-full rounded-xl border ${dateError && dateError.includes('Нельзя установить дату тренировки в прошлом') ? 'border-red-500' : 'border-gray-300'} p-2`}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Время начала *
                            </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={handleStartTimeChange}
                                className={`w-full rounded-xl border ${dateError && dateError.includes('Время начала') ? 'border-red-500' : 'border-gray-300'} p-2`}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Время окончания *
                            </label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                className={`w-full rounded-xl border ${dateError && dateError.includes('Время начала') ? 'border-red-500' : 'border-gray-300'} p-2`}
                                required
                            />
                        </div>
                    </div>

                    {dateError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{dateError}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="cancelled"
                            checked={cancelled}
                            onChange={(e) => setCancelled(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <label htmlFor="cancelled" className="text-sm font-medium text-gray-700">
                            Тренировка отменена
                        </label>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                        * Обязательные поля
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                                hover:text-blue-500 hover:border-blue-500 hover:bg-gray-200 hover:scale-105
                                transition-all duration-400 ease-in-out h-[40px] w-1/2"
                            type="button"
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="rounded-xl font-bold border-2 bg-blue-500 text-white border-blue-500
                                hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:scale-105
                                transition-all duration-400 ease-in-out h-[40px] w-1/2"
                            type="submit"
                            disabled={loading || !!dateError}
                        >
                            {loading ? "Сохранение..." : "Сохранить"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}