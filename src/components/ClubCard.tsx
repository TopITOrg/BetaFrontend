interface ClubData {
    title: string;
    availableSpots: string;
    location: string;
    workoutsPerWeek: string;
    skillLevel: string;
}

function ClubCard({ clubData }: { clubData: ClubData }) {
    return (
        <div className="flex flex-col border-1 border-gray-300 rounded-2xl overflow-hidden
      hover:shadow-md hover:shadow-blue-400 transition-all duration-200 ease-in-out">
            <div className="w-full bg-blue-500 h-3"></div>

            <div className="flex flex-col gap-3 p-2 py-5">
                <h1 className="text-xl font-bold">{clubData.title}</h1>
                <h2>Свободно {clubData.availableSpots}</h2>
                <h2>Место проведения: {clubData.location}</h2>
                <h2>Количество тренировок в неделю: {clubData.workoutsPerWeek}</h2>
                <h2>Уровень обучения: {clubData.skillLevel}</h2>
            </div>
        </div>
    );
}

export type {ClubData};
export { ClubCard };