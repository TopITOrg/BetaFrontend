'use client';
import {Application} from "@/components/Application";
import {Navbar} from "@/components/navbar";
import {Profile} from "@/components/Profile";
import {useAuth} from "../../../../contexts/AuthContext";
import {type ClubJoinRequest, useClubJoinRequests} from "@/hooks/useClubJoinRequests";
import {useUpdateClubJoinRequest} from "@/hooks/useUpdateClubJoinRequest";
import {useTeacherClubs} from "@/hooks/useTeacherClubs";
import {useMemo, useState} from "react";

export default function ApplicationsPage() {
    const {user} = useAuth();
    const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);

    const {updateRequest, loading: updateLoading} = useUpdateClubJoinRequest();
    const {clubs: teacherClubs} = useTeacherClubs();

    // Для студента - его заявки
    const studentRequests = useClubJoinRequests(
        user?.role?.toLowerCase() === 'student' ? {user_id: user?.id} : {}
    );

    // Для тренера - заявки в его секции
    const teacherRequests = useClubJoinRequests(
        user?.role?.toLowerCase() === 'teacher' ? {} : {}
    );

    // Для админа - все заявки
    const adminRequests = useClubJoinRequests(
        user?.role?.toLowerCase() === 'admin' ? {} : {}
    );

    // Фильтруем заявки для тренера (только его секции)
    const filteredTeacherRequests = useMemo(() => {
        if (user?.role?.toLowerCase() !== 'teacher') return [];

        const teacherClubIds = teacherClubs.map(club => club.id);
        return teacherRequests.requests.filter(request =>
            teacherClubIds.includes(request.club_id)
        );
    }, [teacherRequests.requests, teacherClubs, user?.role]);

    // Выбираем правильный набор заявок в зависимости от роли
    const getRequests = (): ClubJoinRequest[] => {
        switch (user?.role?.toLowerCase()) {
            case 'student':
                return studentRequests.requests;
            case 'teacher':
                return filteredTeacherRequests;
            case 'admin':
                return adminRequests.requests;
            default:
                return [];
        }
    };

    const getLoading = (): boolean => {
        switch (user?.role?.toLowerCase()) {
            case 'student':
                return studentRequests.loading;
            case 'teacher':
                return teacherRequests.loading;
            case 'admin':
                return adminRequests.loading;
            default:
                return false;
        }
    };

    const getError = (): string | null => {
        switch (user?.role?.toLowerCase()) {
            case 'student':
                return studentRequests.error;
            case 'teacher':
                return teacherRequests.error;
            case 'admin':
                return adminRequests.error;
            default:
                return null;
        }
    };

    const refetchAll = () => {
        studentRequests.refetch();
        teacherRequests.refetch();
        adminRequests.refetch();
    };

    const handleApprove = async (requestId: number) => {
        setProcessingRequestId(requestId);
        try {
            await updateRequest(requestId, 'approved');
            refetchAll();
        } catch (error) {
            console.error('Ошибка при принятии заявки:', error);
        } finally {
            setProcessingRequestId(null);
        }
    };

    const handleReject = async (requestId: number) => {
        setProcessingRequestId(requestId);
        try {
            await updateRequest(requestId, 'rejected');
            refetchAll();
        } catch (error) {
            console.error('Ошибка при отклонении заявки:', error);
        } finally {
            setProcessingRequestId(null);
        }
    };

    const handleWithdraw = async (requestId: number) => {
        setProcessingRequestId(requestId);
        try {
            await updateRequest(requestId, 'deleted');
            refetchAll();
        } catch (error) {
            console.error('Ошибка при отзыве заявки:', error);
        } finally {
            setProcessingRequestId(null);
        }
    };

    const requests = getRequests();
    const loading = getLoading();
    const error = getError();

    if (loading) {
        return (
            <main>
                <div className='flex flex-col sticky top-0 bg-white z-70'>
                    <Navbar/>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Загрузка заявок...</div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <div className='flex flex-col sticky top-0 bg-white z-70'>
                    <Navbar/>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-500 text-lg">{error}</div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className='flex flex-col sticky top-0 bg-white z-70'>
                <Navbar/>
            </div>
            <div className='flex flex-row items-start'>
                <div>
                    <Profile/>
                </div>
                <div className="flex flex-1 flex-col items-center mt-[65px]">
                    <span className="text-4xl mb-[35px]">Заявки</span>

                    {requests.length === 0 ? (
                        <div className="text-gray-500 text-lg mt-8">
                            {user?.role?.toLowerCase() === 'student'
                                ? 'У вас нет заявок'
                                : 'Нет заявок для отображения'
                            }
                        </div>
                    ) : (
                        <div className="w-full flex justify-center">
                            <div className="grid grid-cols-3 gap-[40px] justify-items-center max-w-6xl">
                                {requests.map((request) => (
                                    <Application
                                        key={request.id}
                                        request={request}
                                        onApprove={() => handleApprove(request.id)}
                                        onReject={() => handleReject(request.id)}
                                        onWithdraw={() => handleWithdraw(request.id)}
                                        isProcessing={processingRequestId === request.id && updateLoading}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}