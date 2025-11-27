'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CustomButton } from './CustomButton';
import type { Workout } from '@/hooks/useWorkouts';

interface EditWorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (workoutData: { id: number; start_date?: string; end_date?: string; cancelled?: boolean }) => void;
    workout: Workout;
    loading?: boolean;
}

export function EditWorkoutModal({ isOpen, onClose, onUpdate, workout, loading = false }: EditWorkoutModalProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        if (workout) {
            const start = new Date(workout.start_date);
            const end = new Date(workout.end_date);

            setSelectedDate(start.toISOString().split('T')[0] || '');
            setStartTime(start.toTimeString().slice(0, 5) || '');
            setEndTime(end.toTimeString().slice(0, 5) || '');
            setCancelled(workout.cancelled);
        }
    }, [workout]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDate) {
            alert('Выберите дату тренировки');
            return;
        }

        if (!startTime || !endTime) {
            alert('Укажите время начала и окончания');
            return;
        }

        // Проверяем, что время начала раньше времени окончания
        if (startTime >= endTime) {
            alert('Время начала должно быть раньше времени окончания');
            return;
        }

        const startDateTime = `${selectedDate}T${startTime}:00`;
        const endDateTime = `${selectedDate}T${endTime}:00`;

        onUpdate({
            id: workout.id,
            start_date: startDateTime,
            end_date: endDateTime,
            cancelled
        });
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Редактировать тренировку</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    >
                        <X size={20} className="text-gray-600" />
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
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full rounded-xl border-gray-300 border p-2"
                            required
                            min={new Date().toISOString().split('T')[0]}
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
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full rounded-xl border-gray-300 border p-2"
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
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full rounded-xl border-gray-300 border p-2"
                                required
                            />
                        </div>
                    </div>

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
                        <CustomButton
                            text="Отмена"
                            isSelected={false}
                            onClick={handleClose}
                            width="50%"
                            type="button"
                        />
                        <CustomButton
                            text={loading ? "Сохранение..." : "Сохранить"}
                            isSelected={true}
                            width="50%"
                            type="submit"
                            disabled={loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}