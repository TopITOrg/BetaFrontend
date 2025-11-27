'use client';
import { useState, useEffect, useMemo } from 'react';
import type { Workout } from '@/hooks/useWorkouts';
import { useAuth } from '../../contexts/AuthContext';
import { CreateWorkoutModal } from './CreateWorkoutModal';
import { EditWorkoutModal } from './EditWorkoutModal';
import { CustomButton } from './CustomButton';
import { useClubs } from '@/hooks/useClubs';
import { MoreVertical, Edit, Trash2, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

interface CalendarProps {
    workouts: Workout[];
    onWorkoutCreate?: (workoutData: { club_id: number; start_date: string; end_date: string }) => Promise<void>;
    onWorkoutUpdate?: (workoutData: { id: number; start_date?: string; end_date?: string; cancelled?: boolean }) => Promise<void>;
    onWorkoutDelete?: (workoutId: number) => Promise<void>;
    isEditMode?: boolean;
}

export function Calendar({ workouts, onWorkoutCreate, onWorkoutUpdate, onWorkoutDelete, isEditMode = false }: CalendarProps) {
    const { user } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
    const [selectedClubName, setSelectedClubName] = useState<string>('Выберите секцию');
    const [creatingWorkout, setCreatingWorkout] = useState(false);
    const [showMenuForWorkout, setShowMenuForWorkout] = useState<number | null>(null);
    const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
    const [currentMonth, setCurrentMonth] = useState<string>('');

    const { clubs: allClubs } = useClubs();

    // Фильтруем клубы, у которых есть id
    const clubsWithId = useMemo(() =>
            allClubs.filter((club): club is typeof club & { id: number } =>
                club.id !== undefined
            ),
        [allClubs]
    );

    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const isStudent = user?.role?.toLowerCase() === 'student';
    const isTeacher = user?.role?.toLowerCase() === 'teacher';

    // Временные слоты
    const timeslots = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

    // Функция для получения недели (понедельник - воскресенье)
    const getCurrentWeek = (): Date[] => {
        const now = new Date();
        const currentDay = now.getDay();
        const monday = new Date(now);

        // Находим понедельник (понедельник = 1, воскресенье = 0)
        const diff = currentDay === 0 ? -6 : 1 - currentDay;
        monday.setDate(now.getDate() + diff);

        const week: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            week.push(day);
        }

        return week;
    };

    // Обновляем название выбранной секции при изменении selectedClubId
    useEffect(() => {
        if (selectedClubId === null) {
            setSelectedClubName('Выберите секцию');
        } else {
            const club = clubsWithId.find(c => c.id === selectedClubId);
            setSelectedClubName(club ? club.title : 'Выберите секцию');
        }
    }, [selectedClubId, clubsWithId]);

    // Функция для форматирования даты в "ПН 21"
    const formatDay = (date: Date): string => {
        const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
        const dayName = days[date.getDay()];
        const dayNumber = date.getDate().toString();
        return `${dayName} ${dayNumber}`;
    };

    // Функция для получения названия месяца
    const getMonthName = (dates: Date[]): string => {
        if (dates.length === 0) return '';

        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        // Если все дни в одном месяце, показываем этот месяц
        const firstMonth = dates[0]?.getMonth() ?? 0;
        const allSameMonth = dates.every(date => date.getMonth() === firstMonth);

        if (allSameMonth) {
            return months[firstMonth] ?? '';
        } else {
            // Если неделя захватывает два месяца, показываем оба
            const startMonth = months[dates[0]?.getMonth() ?? 0] ?? '';
            const endMonth = months[dates[6]?.getMonth() ?? 0] ?? '';
            return `${startMonth} - ${endMonth}`;
        }
    };

    // Инициализация текущей недели при загрузке компонента
    useEffect(() => {
        const week = getCurrentWeek();
        setCurrentWeek(week);
        setCurrentMonth(getMonthName(week));
    }, []);

    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours || 0) * 60 + (minutes || 0);
    };

    const formatWorkoutTime = (startDate: string, endDate: string): string => {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const startTime = start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            const endTime = end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

            return `${startTime}-${endTime}`;
        } catch {
            return '--:--';
        }
    };

    const getTrainingForCell = (day: Date, timeSlot: string) => {
        const workoutsToUse = selectedClubId
            ? workouts.filter(workout => workout.club_id === selectedClubId)
            : workouts;

        for (const workout of workoutsToUse) {
            try {
                const workoutDate = new Date(workout.start_date);

                // Сравниваем даты (игнорируя время)
                const isSameDay =
                    workoutDate.getDate() === day.getDate() &&
                    workoutDate.getMonth() === day.getMonth() &&
                    workoutDate.getFullYear() === day.getFullYear();

                if (isSameDay) {
                    const workoutStartTime = new Date(workout.start_date).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                    const workoutEndTime = new Date(workout.end_date).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });

                    const startMinutes = timeToMinutes(workoutStartTime);
                    const endMinutes = timeToMinutes(workoutEndTime);
                    const currentMinutes = timeToMinutes(timeSlot);

                    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
                        return {
                            workout,
                            isStart: currentMinutes === startMinutes
                        };
                    }
                }
            } catch (error) {
                console.error('Error processing workout:', error);
            }
        }

        return null;
    };

    const handleCreateWorkout = async (workoutData: { club_id: number; start_date: string; end_date: string }) => {
        if (onWorkoutCreate) {
            setCreatingWorkout(true);
            try {
                await onWorkoutCreate(workoutData);
                setShowCreateModal(false);
            } catch (error) {
                console.error('Error creating workout:', error);
            } finally {
                setCreatingWorkout(false);
            }
        }
    };

    const handleEditWorkout = (workout: Workout) => {
        setSelectedWorkout(workout);
        setShowEditModal(true);
        setShowMenuForWorkout(null);
    };

    const handleUpdateWorkout = async (workoutData: { id: number; start_date?: string; end_date?: string; cancelled?: boolean }) => {
        if (onWorkoutUpdate) {
            try {
                await onWorkoutUpdate(workoutData);
                setShowEditModal(false);
                setSelectedWorkout(null);
            } catch (error) {
                console.error('Error updating workout:', error);
            }
        }
    };

    const handleDeleteWorkout = async (workoutId: number) => {
        if (onWorkoutDelete && confirm('Вы уверены, что хотите удалить эту тренировку?')) {
            try {
                await onWorkoutDelete(workoutId);
                setShowMenuForWorkout(null);
            } catch (error) {
                console.error('Error deleting workout:', error);
            }
        }
    };

    const toggleMenu = (workoutId: number) => {
        setShowMenuForWorkout(showMenuForWorkout === workoutId ? null : workoutId);
    };

    // Определяем, показывать ли выбор секции
    const showClubSelector = isAdmin || isTeacher || isStudent;

    return (
        <div className="w-full max-w-[100%] -ml-17 mr-1">
            <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900">Тренировки</h1>
                <span className="text-gray-600 text-sm">{currentMonth}</span>
            </div>

            {showClubSelector && (
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isStudent ? 'Выберите секцию для просмотра расписания:' : 'Выберите секцию:'}
                    </label>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                        hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                        transition-colors duration-400 ease-in-out h-[40px] w-[190px] flex items-center justify-between"
                            >
                                <span>{selectedClubName}</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[190px]">
                            <DropdownMenuItem onClick={() => setSelectedClubId(null)}>
                                Выберите секцию
                            </DropdownMenuItem>
                            {clubsWithId.map((club) => (
                                <DropdownMenuItem
                                    key={club.id}
                                    onClick={() => setSelectedClubId(club.id)}
                                >
                                    {club.title}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {isStudent && (
                        <p className="text-xs text-gray-500 mt-1">
                            Просмотрите расписание всех секций, чтобы выбрать подходящую
                        </p>
                    )}
                </div>
            )}

            {/* Остальной код календаря остается без изменений */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border border-gray-300 font-semibold text-gray-700 text-xs min-w-[70px]">
                            Время
                        </th>
                        {currentWeek.map((day, index) => (
                            <th
                                key={index}
                                className="p-2 border border-gray-300 font-semibold text-gray-700 text-xs min-w-[100px]"
                            >
                                {formatDay(day)}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {timeslots.map((timeSlot, timeIndex) => (
                        <tr key={timeIndex} className="hover:bg-gray-50">
                            <td className="p-2 border border-gray-300 text-center font-medium text-gray-600 text-xs">
                                {timeSlot}
                            </td>

                            {currentWeek.map((day, dayIndex) => {
                                const trainingInfo = getTrainingForCell(day, timeSlot);
                                const isStart = trainingInfo?.isStart;

                                return (
                                    <td
                                        key={dayIndex}
                                        className="p-1 border border-gray-300 min-w-[80px] h-[50px] relative"
                                    >
                                        {trainingInfo && (
                                            <div className="absolute inset-0 bg-[#E7F6FD] border-l-2 border-l-[#0369a1] flex items-start p-1">
                                                {isStart && (
                                                    <div className="text-xs leading-tight w-full">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="font-medium text-[#0369a1]">
                                                                    {formatWorkoutTime(
                                                                        trainingInfo.workout.start_date,
                                                                        trainingInfo.workout.end_date
                                                                    )}
                                                                </div>
                                                                <div className="text-[#0369a1] mt-0.5">
                                                                    {trainingInfo.workout.club_name || 'Тренировка'}
                                                                </div>
                                                            </div>
                                                            {isEditMode && (
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={() => toggleMenu(trainingInfo.workout.id)}
                                                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                                    >
                                                                        <MoreVertical size={12} className="text-[#0369a1]" />
                                                                    </button>

                                                                    {showMenuForWorkout === trainingInfo.workout.id && (
                                                                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                                                                            <div className="p-1">
                                                                                <button
                                                                                    onClick={() => handleEditWorkout(trainingInfo.workout)}
                                                                                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors mb-1"
                                                                                >
                                                                                    <Edit size={12} className="mr-2" />
                                                                                    Редактировать
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteWorkout(trainingInfo.workout.id)}
                                                                                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                                                >
                                                                                    <Trash2 size={12} className="mr-2" />
                                                                                    Удалить
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isEditMode && (
                <div className="mt-6 flex justify-center">
                    <CustomButton
                        text="Создать тренировку"
                        isSelected={false}
                        onClick={() => setShowCreateModal(true)}
                        width="200px"
                        className="mt-3 border-2 border-blue-500 hover:bg-blue-50 transition-colors"
                    />
                </div>
            )}

            {showCreateModal && (
                <CreateWorkoutModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateWorkout}
                    loading={creatingWorkout}
                />
            )}

            {showEditModal && selectedWorkout && (
                <EditWorkoutModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedWorkout(null);
                    }}
                    onUpdate={handleUpdateWorkout}
                    workout={selectedWorkout}
                    loading={creatingWorkout}
                />
            )}
        </div>
    );
}