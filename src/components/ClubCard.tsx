// components/ClubCard.tsx
import { useState } from 'react';
import { MapPin, Users, Calendar, Activity, X, Info } from 'lucide-react';
import { CustomButton } from './CustomButton';

interface ClubData {
    id?: number;
    title: string;
    availableSpots: string;
    location: string;
    workoutsPerWeek: string;
    skillLevel: string;
    description: string;
    sportType?: string;
}

function ClubCard({ clubData }: { clubData: ClubData }) {
    const [showDetails, setShowDetails] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getSkillLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'начальный':
            case 'beginner':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'продвинутый':
            case 'advanced':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'гсс':
            case 'gss':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatWorkouts = (workouts: string) => {
        const num = parseInt(workouts);
        if (isNaN(num)) return workouts;

        if (num === 1) return '1 тренировка в неделю';
        if (num >= 2 && num <= 4) return `${num} тренировки в неделю`;
        return `${num} тренировок в неделю`;
    };

    const handleSubmitApplication = async () => {
        // Подтверждение действия
        const isConfirmed = window.confirm(
            `Вы уверены, что хотите подать заявку в секцию "${clubData.title}"?`
        );

        if (!isConfirmed) {
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('access_token'); // Предполагается, что токен хранится в localStorage

            const response = await fetch('http://localhost:8080/club-join-requests/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    club_id: clubData.id
                }),
            });

            if (response.ok) {
                alert('Заявка успешно подана!');
                setShowDetails(false); // Автоматическое закрытие модального окна
            } else {
                const errorData = await response.json();
                if (response.status === 409) {
                    alert('Вы уже подали заявку на вступление в этот клуб.');
                } else {
                    throw new Error(errorData.message || 'Ошибка при подаче заявки');
                }
            }
        } catch (error) {
            console.error('Ошибка при подаче заявки:', error);
            alert('Произошла ошибка при подаче заявки. Попробуйте еще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex flex-col border-1 border-gray-300 rounded-2xl overflow-hidden
          hover:shadow-md hover:shadow-blue-400 transition-all duration-200 ease-in-out
          cursor-pointer bg-white h-full">
                <div className="w-full bg-blue-500 h-2"></div>

                <div className="flex flex-col gap-3 p-4 flex-1">
                    <div className="flex justify-between items-start gap-2">
                        <h1 className="text-xl font-bold text-gray-900 flex-1">
                            {clubData.title}
                        </h1>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getSkillLevelColor(clubData.skillLevel)} whitespace-nowrap`}>
                            {clubData.skillLevel}
                        </span>
                    </div>

                    <div className="space-y-2 mt-auto">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                                clubData.availableSpots === '0' ? 'bg-red-500' : 'bg-green-500'
                            }`}></div>
                            <span className="text-gray-700 font-medium text-sm">
                                Свободно: <span className={
                                clubData.availableSpots === '0' ? 'text-red-600' : 'text-green-600'
                            }>{clubData.availableSpots}</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{clubData.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">
                                {formatWorkouts(clubData.workoutsPerWeek)}
                            </span>
                        </div>
                    </div>

                    <CustomButton
                        text="Подробнее"
                        isSelected={false}
                        onClick={() => setShowDetails(true)}
                        width="100%"
                        className="mt-3"
                    />
                </div>
            </div>

            {/* Модальное окно с подробной информацией */}
            {showDetails && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Заголовок и кнопка закрытия */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">{clubData.title}</h2>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Содержимое модального окна */}
                        <div className="p-6 space-y-6">
                            {/* Вид спорта */}
                            {clubData.sportType && (
                                <div className="flex items-center gap-3">
                                    <Activity className="text-blue-500" size={20} />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Вид спорта</h3>
                                        <p className="text-gray-700">{clubData.sportType}</p>
                                    </div>
                                </div>
                            )}

                            {/* Уровень подготовки */}
                            <div className="flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-full border ${getSkillLevelColor(clubData.skillLevel)}`}>
                                    {clubData.skillLevel}
                                </div>
                                <span className="text-sm text-gray-600">Уровень подготовки</span>
                            </div>

                            {/* Основная информация */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                        clubData.availableSpots === '0' ? 'bg-red-500' : 'bg-green-500'
                                    }`}></div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Доступные места</h3>
                                        <p className="text-gray-700">{clubData.availableSpots}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin className="text-gray-400" size={20} />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Место проведения</h3>
                                        <p className="text-gray-700">{clubData.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="text-gray-400" size={20} />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Тренировок в неделю</h3>
                                        <p className="text-gray-700">{formatWorkouts(clubData.workoutsPerWeek)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Описание секции */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="text-gray-500" size={20} />
                                    <h3 className="font-semibold text-gray-900">Описание секции</h3>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {clubData.description || 'Описание отсутствует'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Кнопка подачи заявки */}
                        <div className="p-6 border-t border-gray-200">
                            <CustomButton
                                text={isSubmitting ? "Отправка..." : "Подать заявку"}
                                isSelected={true}
                                onClick={handleSubmitApplication}
                                width="100%"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export { ClubCard };
export type { ClubData };