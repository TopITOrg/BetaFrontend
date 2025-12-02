'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Workout } from '@/hooks/useWorkouts';
import { useClubs } from '@/hooks/useClubs';
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { CreateWorkoutModal } from './CreateWorkoutModal';
import { useCreateWorkout } from '@/hooks/useCreateWorkout';

interface CalendarProps {
    workouts: Workout[];
    selectedClubId?: number;
    onSelectClub?: (clubId: number | undefined) => void;
    refetch?: () => void;
}

type ClubColor = { bg: string; border: string; text: string };

const CLUB_COLORS: ClubColor[] = [
    { bg: '#E7F6FD', border: '#0369a1', text: '#0369a1' },
    { bg: '#F0FDF4', border: '#16a34a', text: '#16a34a' },
    { bg: '#FEF3C7', border: '#d97706', text: '#d97706' },
    { bg: '#FEE2E2', border: '#dc2626', text: '#dc2626' },
    { bg: '#F3E8FF', border: '#7c3aed', text: '#7c3aed' },
    { bg: '#FCE7F3', border: '#db2777', text: '#db2777' },
    { bg: '#ECFCCB', border: '#65a30d', text: '#65a30d' },
    { bg: '#CCFBF1', border: '#0d9488', text: '#0d9488' },
    { bg: '#E0E7FF', border: '#4f46e5', text: '#4f46e5' },
    { bg: '#FEF9C3', border: '#ca8a04', text: '#ca8a04' },
    { bg: '#E0F2FE', border: '#0284c7', text: '#0284c7' },
    { bg: '#F5F3FF', border: '#8b5cf6', text: '#8b5cf6' },
];

export function Calendar({
                             workouts,
                             selectedClubId,
                             onSelectClub,
                             refetch,
                         }: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { clubs: allClubs } = useClubs();
    const { createWorkout, loading: creatingWorkout } = useCreateWorkout();

    const clubsWithId = useMemo(() =>
            allClubs.filter((club): club is typeof club & { id: number } =>
                club.id !== undefined
            ),
        [allClubs]
    );

    // Генерация временных слотов с интервалом 30 минут (с 8:00 до 22:00)
    const timeslots = useMemo(() => {
        const slots = [];
        for (let hour = 8; hour <= 21; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour < 21) {
                slots.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        }
        return slots;
    }, []);

    const getClubColor = useMemo(() => {
        const colorMap = new Map<number, ClubColor>();

        if (selectedClubId) {
            const club = clubsWithId.find(c => c.id === selectedClubId);
            if (club) {
                // @ts-ignore
                colorMap.set(club.id, CLUB_COLORS[0]);
            }
        } else {
            clubsWithId.forEach((club, index) => {
                // @ts-ignore
                colorMap.set(club.id, CLUB_COLORS[index % CLUB_COLORS.length]);
            });
        }

        return (clubId: number): ClubColor => {
            const color = colorMap.get(clubId);
            // @ts-ignore
            return color || CLUB_COLORS[0];
        };
    }, [clubsWithId, selectedClubId]);

    const getCurrentWeek = (date: Date): Date[] => {
        const currentDay = date.getDay();
        const monday = new Date(date);
        const diff = currentDay === 0 ? -6 : 1 - currentDay;
        monday.setDate(date.getDate() + diff);
        monday.setHours(0, 0, 0, 0);

        const week: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            week.push(day);
        }
        return week;
    };

    const formatDay = (date: Date): string => {
        const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
        const dayName = days[date.getDay()];
        const dayNumber = date.getDate().toString();
        return `${dayName} ${dayNumber}`;
    };

    const goToPreviousWeek = () => {
        setSelectedDate(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
    };

    const goToNextWeek = () => {
        setSelectedDate(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const handleCreateWorkout = async (workoutData: { club_id: number; start_date: string; end_date: string }) => {
        try {
            await createWorkout(workoutData);
            setIsCreateModalOpen(false);
            if (refetch) {
                refetch();
            }
        } catch (error) {
            console.error('Ошибка при создании тренировки:', error);
        }
    };

    useEffect(() => {
        setCurrentWeek(getCurrentWeek(selectedDate));
    }, [selectedDate]);

    const timeToMinutes = (time: string): number => {
        const parts = time.split(':');
        const hoursStr = parts[0];
        const minutesStr = parts[1];
        const hours = hoursStr ? parseInt(hoursStr, 10) : 0;
        const minutes = minutesStr ? parseInt(minutesStr, 10) : 0;
        return hours * 60 + minutes;
    };

    const formatWorkoutTime = (startDate: string, endDate: string): string => {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const startHours = start.getHours().toString().padStart(2, '0');
            const startMinutes = start.getMinutes().toString().padStart(2, '0');
            const endHours = end.getHours().toString().padStart(2, '0');
            const endMinutes = end.getMinutes().toString().padStart(2, '0');

            return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
        } catch {
            return '--:--';
        }
    };

    const getTrainingForCell = (day: Date, timeSlot: string) => {
        for (const workout of workouts) {
            try {
                if (!workout.start_date || !workout.end_date) {
                    continue;
                }

                const workoutStart = new Date(workout.start_date);
                const workoutEnd = new Date(workout.end_date);

                // Сравниваем только день и месяц
                const workoutMonthDay = `${workoutStart.getMonth()}-${workoutStart.getDate()}`;
                const currentMonthDay = `${day.getMonth()}-${day.getDate()}`;

                if (workoutMonthDay !== currentMonthDay) {
                    continue;
                }

                const workoutStartHour = workoutStart.getHours();
                const workoutStartMinute = workoutStart.getMinutes();
                const workoutStartTime = `${workoutStartHour.toString().padStart(2, '0')}:${workoutStartMinute.toString().padStart(2, '0')}`;

                const currentMinutes = timeToMinutes(timeSlot);
                const startMinutes = timeToMinutes(workoutStartTime);
                const endMinutes = timeToMinutes(`${workoutEnd.getHours().toString().padStart(2, '0')}:${workoutEnd.getMinutes().toString().padStart(2, '0')}`);

                if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
                    const color = getClubColor(workout.club_id);
                    const durationInSlots = Math.ceil((endMinutes - startMinutes) / 30);
                    const slotIndex = Math.floor((currentMinutes - startMinutes) / 30);

                    return {
                        workout,
                        isStart: currentMinutes === startMinutes,
                        color,
                        durationInSlots,
                        slotIndex
                    };
                }
            } catch {
                continue;
            }
        }
        return null;
    };

    return (
        <>
            <div className="w-full max-w-[100%] -ml-17 mr-1 mt-4">
                <div className="mb-4 flex justify-between items-center pt-2">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Тренировки</h1>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            onClick={goToToday}
                            className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                                hover:text-blue-500 hover:border-blue-500 hover:bg-gray-200 hover:scale-105
                                transition-all duration-400 ease-in-out h-[40px] px-3"
                        >
                            Сегодня
                        </Button>
                        <Button
                            variant="outline"
                            onClick={goToPreviousWeek}
                            className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                                hover:text-blue-500 hover:border-blue-500 hover:bg-gray-200 hover:scale-105
                                transition-all duration-400 ease-in-out h-[40px] w-[40px] p-0 flex items-center justify-center"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={goToNextWeek}
                            className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                                hover:text-blue-500 hover:border-blue-500 hover:bg-gray-200 hover:scale-105
                                transition-all duration-400 ease-in-out h-[40px] w-[40px] p-0 flex items-center justify-center"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Выберите секцию:
                    </label>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                                    hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100 hover:scale-105
                                    transition-all duration-400 ease-in-out h-[40px] w-[190px] flex items-center justify-between"
                            >
                                <span>{selectedClubId ?
                                    clubsWithId.find(c => c.id === selectedClubId)?.title || `Секция ${selectedClubId}`
                                    : 'Все секции'}</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[190px]">
                            <DropdownMenuItem onClick={() => onSelectClub?.(undefined)}>
                                Все секции
                            </DropdownMenuItem>
                            {clubsWithId.map((club) => {
                                const color = getClubColor(club.id);
                                return (
                                    <DropdownMenuItem
                                        key={club.id}
                                        onClick={() => onSelectClub?.(club.id)}
                                        className="flex items-center"
                                    >
                                        <div className="flex items-center w-full">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                                style={{
                                                    backgroundColor: color.border
                                                }}
                                            />
                                            <span className="truncate">{club.title}</span>
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="p-1 border border-gray-200 font-semibold text-gray-700 text-xs min-w-[60px] sticky left-0 bg-gray-50 z-10">
                                <div className="flex flex-col items-center">
                                    <span>Время</span>
                                </div>
                            </th>
                            {currentWeek.map((day, index) => (
                                <th
                                    key={index}
                                    className="p-1 border border-gray-200 font-semibold text-gray-700 text-xs min-w-[90px]"
                                >
                                    <div className="flex flex-col items-center">
                                        <span className="font-medium">{formatDay(day)}</span>
                                        <span className="text-xs font-normal text-gray-500 mt-0.5">
                                                {day.getDate()}.{day.getMonth() + 1}
                                            </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {timeslots.map((timeSlot, timeIndex) => (
                            <tr
                                key={timeIndex}
                                className={`
                                        hover:bg-gray-50 
                                        ${timeSlot.endsWith(':00') ? 'border-t border-gray-100' : ''}
                                        ${timeIndex === 0 ? 'border-t border-gray-200' : ''}
                                    `}
                            >
                                <td className="
                                        p-1 border border-gray-200 text-center font-medium text-gray-600 text-xs
                                        sticky left-0 bg-white z-10
                                        min-w-[60px] h-[35px]
                                    ">
                                    <div className="flex flex-col items-center justify-center h-full">
                                            <span className={`font-medium ${timeSlot.endsWith(':30') ? 'text-gray-400' : ''}`}>
                                                {timeSlot}
                                            </span>
                                    </div>
                                </td>

                                {currentWeek.map((day, dayIndex) => {
                                    const trainingInfo = getTrainingForCell(day, timeSlot);

                                    return (
                                        <td
                                            key={dayIndex}
                                            className="
                                                    p-0 border border-gray-200
                                                    min-w-[90px] h-[35px] relative
                                                    group transition-colors duration-150
                                                "
                                        >
                                            {trainingInfo && (
                                                <div
                                                    className="
                                                            absolute inset-0 flex items-start p-1
                                                            transition-all duration-200
                                                            hover:brightness-95 z-20
                                                            overflow-hidden
                                                        "
                                                    style={{
                                                        backgroundColor: trainingInfo.color.bg,
                                                        borderLeftColor: trainingInfo.color.border,
                                                        borderLeftWidth: '3px',
                                                        zIndex: trainingInfo.isStart ? 30 : 20,
                                                        ...(trainingInfo.isStart && {
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                                        })
                                                    }}
                                                >
                                                    {trainingInfo.isStart && (
                                                        <div className="text-xs leading-tight w-full overflow-hidden">
                                                            <div className="flex flex-col">
                                                                <div
                                                                    className="font-semibold truncate"
                                                                    style={{ color: trainingInfo.color.text }}
                                                                >
                                                                    {trainingInfo.workout.club_name}
                                                                </div>
                                                                <div
                                                                    className="text-[10px] font-medium mt-0.5 truncate"
                                                                    style={{ color: trainingInfo.color.text }}
                                                                >
                                                                    {formatWorkoutTime(
                                                                        trainingInfo.workout.start_date,
                                                                        trainingInfo.workout.end_date
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Полутон для продолжения тренировки */}
                                            {trainingInfo && !trainingInfo.isStart && (
                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        backgroundColor: trainingInfo.color.bg,
                                                        opacity: 0.9
                                                    }}
                                                />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {!selectedClubId && clubsWithId.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Легенда секций:</h3>
                        <div className="flex flex-wrap gap-2">
                            {clubsWithId.slice(0, 8).map((club) => {
                                const color = getClubColor(club.id);
                                return (
                                    <div
                                        key={club.id}
                                        className="flex items-center px-3 py-1 bg-white border rounded-full shadow-sm hover:shadow transition-shadow"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                            style={{ backgroundColor: color.border }}
                                        />
                                        <span className="text-xs text-gray-700 truncate max-w-[120px]">
                                            {club.title}
                                        </span>
                                    </div>
                                );
                            })}
                            {clubsWithId.length > 8 && (
                                <div className="flex items-center px-3 py-1 bg-white border rounded-full shadow-sm">
                                    <span className="text-xs text-gray-500">
                                        и еще {clubsWithId.length - 8} секций
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-xl font-bold border-2 bg-blue-500 text-white border-blue-500
                            hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:scale-105
                            transition-all duration-400 ease-in-out h-[40px] px-6 shadow-md hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Создать тренировку
                    </Button>
                </div>

                {workouts.length === 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                            Нет доступных тренировок.
                        </p>
                    </div>
                )}
            </div>

            <CreateWorkoutModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateWorkout}
                loading={creatingWorkout}
            />
        </>
    );
}