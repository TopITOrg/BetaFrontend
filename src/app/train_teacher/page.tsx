'use client';
import {Navbar} from '@/components/navbar';
import {Profile} from '@/components/Profile';
import {Calendar} from '@/components/Calendar';
import {useWorkouts} from '@/hooks/useWorkouts';
import {useCreateWorkout} from '@/hooks/useCreateWorkout';
import {useUpdateWorkout} from '@/hooks/useUpdateWorkout';
import {useDeleteWorkout} from '@/hooks/useDeleteWorkout';
import {useAuth} from '../../../contexts/AuthContext';
import {useState} from 'react';

export default function TrainingsPage() {
    const {user} = useAuth();
    const [selectedClubId, setSelectedClubId] = useState<number | undefined>(undefined);

    const {workouts, loading, error, refetch} = useWorkouts(selectedClubId);

    const {createWorkout, loading: creating} = useCreateWorkout();
    const {updateWorkout, loading: updating} = useUpdateWorkout();
    const {deleteWorkout, loading: deleting} = useDeleteWorkout();

    const isStudent = user?.role?.toLowerCase() === 'student';
    const isTeacherOrAdmin = user?.role?.toLowerCase() === 'teacher' || user?.role?.toLowerCase() === 'admin';

    const handleCreateWorkout = async (workoutData: { club_id: number; start_date: string; end_date: string }) => {
        try {
            await createWorkout(workoutData);
            refetch();
        } catch (error) {
            console.error('Ошибка при создании тренировки:', error);
        }
    };

    const handleUpdateWorkout = async (workoutData: {
        id: number;
        start_date?: string;
        end_date?: string;
        cancelled?: boolean
    }) => {
        try {
            await updateWorkout(workoutData);
            refetch();
        } catch (error) {
            console.error('Ошибка при обновлении тренировки:', error);
        }
    };

    const handleDeleteWorkout = async (workoutId: number) => {
        try {
            await deleteWorkout(workoutId);
            refetch();
        } catch (error) {
            console.error('Ошибка при удалении тренировки:', error);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen overflow-hidden py-6 px-4">
                <div className='flex flex-col sticky top-0 bg-white z-70'>
                    <Navbar selectedButton={-1}/>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Загрузка тренировок...</div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen overflow-hidden py-6 px-4">
                <div className='flex flex-col sticky top-0 bg-white z-70'>
                    <Navbar selectedButton={-1}/>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-500 text-lg">{error}</div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen overflow-hidden py-6">
            <div className='flex flex-col sticky top-0 bg-white z-70'>
                <Navbar selectedButton={-1}/>
            </div>
            <div className='flex flex-row min-w-screen h-full'>
                <div className='w-4/12'>
                    <Profile/>
                </div>
                <div className='flex flex-col w-8/12 pr-8'>
                    <Calendar
                        workouts={workouts}
                        onWorkoutCreate={isTeacherOrAdmin ? handleCreateWorkout : undefined}
                        onWorkoutUpdate={isTeacherOrAdmin ? handleUpdateWorkout : undefined}
                        onWorkoutDelete={isTeacherOrAdmin ? handleDeleteWorkout : undefined}
                        isEditMode={isTeacherOrAdmin}
                    />
                </div>
            </div>
        </main>
    );
}