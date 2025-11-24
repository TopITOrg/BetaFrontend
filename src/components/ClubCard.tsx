"use client"

interface ClubData {
    id?: number;
    title: string;
    availableSpots: string;
    location: string;
    workoutsPerWeek: string;
    skillLevel: string;
}

function ClubCard({ clubData }: { clubData: ClubData }) {
    // Функция для определения цвета уровня обучения
    const getSkillLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'начальный':
            case 'beginner':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'продвинутый':
            case 'advanced':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'гсс':
            case 'gss':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Функция для форматирования отображения тренировок
    const formatWorkouts = (workouts: string) => {
        const num = parseInt(workouts);
        if (isNaN(num)) return workouts;

        if (num === 1) return '1 тренировка в неделю';
        if (num >= 2 && num <= 4) return `${num} тренировки в неделю`;
        return `${num} тренировок в неделю`;
    };

    return (
        <div className="flex flex-col border-1 border-gray-300 rounded-2xl overflow-hidden
      hover:shadow-md hover:shadow-blue-400 transition-all duration-200 ease-in-out
      cursor-pointer bg-white">
            {/* Цветная полоса сверху */}
            <div className="w-full bg-blue-500 h-2"></div>

            <div className="flex flex-col gap-3 p-4">
                {/* Заголовок и уровень обучения в одной строке */}
                <div className="flex justify-between items-start gap-2">
                    <h1 className="text-xl font-bold text-gray-900 flex-1">
                        {clubData.title}
                    </h1>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSkillLevelColor(clubData.skillLevel)}`}>
                        {clubData.skillLevel}
                    </span>
                </div>

                {/* Свободные места с иконкой */}
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                        clubData.availableSpots.startsWith('0/') ? 'bg-red-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-gray-700 font-medium">
                        Свободно: <span className={
                        clubData.availableSpots.startsWith('0/') ? 'text-red-600' : 'text-green-600'
                    }>{clubData.availableSpots}</span>
                    </span>
                </div>

                {/* Место проведения с иконкой */}
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600 text-sm">{clubData.location}</span>
                </div>

                {/* Количество тренировок с иконкой */}
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 text-sm">
                        {formatWorkouts(clubData.workoutsPerWeek)}
                    </span>
                </div>

                {/* Кнопка для действий */}
                <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg
                    transition-colors duration-200 ease-in-out text-sm font-medium">
                    Подробнее
                </button>
            </div>
        </div>
    );
}

export type { ClubData };
export { ClubCard };