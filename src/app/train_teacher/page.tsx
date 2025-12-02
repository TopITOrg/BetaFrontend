'use client';
import { Navbar } from '@/components/navbar';
import { Profile } from '@/components/Profile';
import { Calendar } from '@/components/Calendar';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';

export default function TrainingsPage() {
    const { user } = useAuth();
    const [selectedClubId, setSelectedClubId] = useState<number | undefined>(undefined);

    const { workouts, loading, error, refetch } = useWorkouts(selectedClubId);

    if (loading) {
        return (
            <main className="min-h-screen overflow-hidden py-6 px-4">
                <div className='flex flex-col sticky top-0 bg-white z-70'>
                    <Navbar selectedButton={-1} />
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
                    <Navbar selectedButton={-1} />
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
                <Navbar selectedButton={-1} />
            </div>
            <div className='flex flex-row min-w-screen h-full'>
                <div className='w-4/12'>
                    <Profile />
                </div>
                <div className='flex flex-col w-8/12 pr-8'>
                    <Calendar
                        workouts={workouts}
                        selectedClubId={selectedClubId}
                        onSelectClub={setSelectedClubId}
                        refetch={refetch}
                    />
                </div>
            </div>
        </main>
    );
}