import type {ClubJoinRequest} from '@/hooks/useClubJoinRequests';

interface ApplicationProps {
    request: ClubJoinRequest;
    onApprove?: () => void;
    onReject?: () => void;
    isProcessing: boolean;
    showActions?: boolean;
}

export const Application: React.FC<ApplicationProps> = ({
                                                            request,
                                                            onApprove,
                                                            onReject,
                                                            isProcessing,
                                                            showActions = true // По умолчанию показываем
                                                        }) => {
    const getStatusColor = () => {
        switch (request.status.toLowerCase()) {
            case 'approved':
                return 'border-green-400';
            case 'rejected':
                return 'border-red-400';
            case 'deleted':
                return 'border-gray-400';
            default:
                return 'border-blue-400';
        }
    };

    const getStatusText = () => {
        switch (request.status.toLowerCase()) {
            case 'approved':
                return 'Принята';
            case 'rejected':
                return 'Отклонена';
            case 'deleted':
                return 'Отозвана';
            default:
                return 'На рассмотрении';
        }
    };

    const canModify = request.status.toLowerCase() === 'submitted' && showActions;

    return (
        <div className={`border-2 rounded-4xl p-6 w-80 shadow-lg transition-all duration-200 hover:shadow-xl bg-white ${getStatusColor()}`}>
            {/* Заголовок */}
            <div className="text-center mb-4">
                <h3 className="font-bold text-xl text-gray-800">Заявка в секцию</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    request.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800 border border-green-300' :
                        request.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300' :
                            request.status.toLowerCase() === 'deleted' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                                'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                    {getStatusText()}
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div>
                    <p className="text-sm text-gray-600">Секция</p>
                    <p className="font-semibold text-lg text-gray-800">{request.club_name}</p>
                </div>

                {showActions && (
                    <div>
                        <p className="text-sm text-gray-600">Подана пользователем</p>
                        <p className="font-medium text-gray-800">{request.user_name}</p>
                    </div>
                )}

                <div>
                    <p className="text-sm text-gray-600">Дата подачи</p>
                    <p className="text-sm text-gray-700">{new Date(request.created_at).toLocaleDateString('ru-RU')}</p>
                </div>

                {showActions && (
                    <div>
                        <p className="text-sm text-gray-600">Статус</p>
                        <p className="font-medium text-gray-800">{getStatusText()}</p>
                    </div>
                )}
            </div>

            {/* Показываем кнопки только если showActions = true */}
            {showActions && (
                <>
                    <div className="flex gap-3">
                        <button
                            className={`flex-1 h-[40px] items-center justify-center rounded-xl font-medium transition-all duuration-400 ease-in-out hover:scale-105  ${
                                canModify
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={onApprove}
                            disabled={isProcessing || !canModify}
                        >
                            {isProcessing ? '...' : 'Принять'}
                        </button>
                        <button
                            className={`flex-1 h-[40px] items-center justify-center rounded-xl font-medium transition-all duuration-400 ease-in-out hover:scale-105 ${
                                canModify
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={onReject}
                            disabled={isProcessing || !canModify}
                        >
                            {isProcessing ? '...' : 'Отклонить'}
                        </button>
                    </div>

                    {!canModify && (
                        <p className="text-center text-sm text-gray-500 mt-3">
                            Заявка уже обработана
                        </p>
                    )}
                </>
            )}
        </div>
    );
};