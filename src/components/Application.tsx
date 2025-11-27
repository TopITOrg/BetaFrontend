'use client';
import { CircleUserRound } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../../contexts/AuthContext";

interface ApplicationProps {
    request: {
        id: number;
        club_id: number;
        club_name: string;
        user_id: number;
        user_name: string;
        status: string;
        created_at: string;
        updated_at: string;
    };
    onApprove?: () => void;
    onReject?: () => void;
    onWithdraw?: () => void;
    isProcessing?: boolean;
}

export function Application({ request, onApprove, onReject, onWithdraw, isProcessing = false }: ApplicationProps) {
    const { user } = useAuth();
    const isStudent = user?.role?.toLowerCase() === 'student';
    const isTeacherOrAdmin = user?.role?.toLowerCase() === 'teacher' || user?.role?.toLowerCase() === 'admin';

    // Для студента показываем название секции, для тренера/админа - имя студента
    const displayName = isStudent ? request.club_name : request.user_name;

    return (
        <div className="flex flex-col border-2 border-gray-300 rounded-xl h-[130px] w-[316px]">
            <div className="flex items-center space-x-2 justify-center mt-2 px-2">
                <CircleUserRound className="text-blue-500" size={40}/>
                <span className="text-lg text-center truncate">{displayName}</span>
            </div>

            {/* Статус заявки */}
            <div className="text-center text-sm text-gray-600 mt-1">
                Статус: {getStatusText(request.status)}
            </div>

            <div className="flex flex-row justify-center mt-3 gap-3 px-2">
                {isTeacherOrAdmin && request.status === 'submitted' && (
                    <>
                        <Button
                            className="rounded-3xl text-white bg-[#69BE62] text-sm hover:bg-green-600
                            transition-colors duration-400 ease-in-out h-[40px] w-[120px]"
                            onClick={onApprove}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Обработка...' : 'Принять'}
                        </Button>
                        <Button
                            className="rounded-3xl text-white bg-[#FF3131] text-sm hover:bg-red-600
                            transition-colors duration-400 ease-in-out h-[40px] w-[120px]"
                            onClick={onReject}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Обработка...' : 'Отклонить'}
                        </Button>
                    </>
                )}

                {isStudent && request.status === 'submitted' && (
                    <Button
                        className="rounded-3xl text-white bg-[#FF3131] text-sm hover:bg-red-600
                        transition-colors duration-400 ease-in-out h-[40px] w-[120px]"
                        onClick={onWithdraw}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Отзыв...' : 'Отозвать'}
                    </Button>
                )}

                {/* Для завершенных заявок показываем статус */}
                {request.status !== 'submitted' && (
                    <div className={`text-sm font-medium px-3 py-2 rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                    }`}>
                        {getStatusText(request.status)}
                    </div>
                )}
            </div>
        </div>
    );
}

function getStatusText(status: string): string {
    switch (status) {
        case 'submitted': return 'На рассмотрении';
        case 'approved': return 'Принята';
        case 'rejected': return 'Отклонена';
        case 'deleted': return 'Отозвана';
        default: return status;
    }
}