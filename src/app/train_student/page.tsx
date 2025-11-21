import { Navbar } from '@/components/navbar';
import trainingData from './training.json';
import { Profile } from '@/components/Profile';

interface Training {
  day: string;
  time: string;
  endTime: string;
  title: string;
  timeDisplay: string;
}

interface TrainingData {
  month: string;
  week: string[];
  timeslots: string[];
  trainings: Training[];
}

export default function HomePage() {
  const { month, week, timeslots, trainings } = trainingData as TrainingData;

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getTrainingForCell = (day: string, timeSlot: string) => {
    for (const training of trainings) {
      if (training.day === day) {
        const startMinutes = timeToMinutes(training.time);
        const endMinutes = timeToMinutes(training.endTime);
        const currentMinutes = timeToMinutes(timeSlot);

        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          return { training };
        }
      }
    }
    
    return null;
  };

  return (
    <main className="min-h-screen overflow-hidden py-6 px-4">
        <div className='flex flex-col sticky top-0 bg-white z-70'>
            <Navbar></Navbar>
        </div>
        <div className='flex flex-row min-w-screen h-wull'>
            <div className='w-4/12'>
                <Profile></Profile>
            </div>
            <div className='flex flex-col w-full'>
                <div className=" mb-6 mt-[65px]">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Тренировки</h1>
                    <span>{month}</span>
                </div>

                <div className="">
                <div className="overflow-x-auto">
                    <table className="">
                    <thead className="bg-gray-100">
                        <tr>
                        <th className="p-2 border border-gray-300 font-semibold text-gray-700 text-xs min-w-[70px]">
                            Время
                        </th>
                        {week.map((day, index) => (
                            <th 
                            key={index}
                            className="p-2 border border-gray-300 font-semibold text-gray-700 text-xs min-w-[100px]"
                            >
                            {day}
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

                            {week.map((day, dayIndex) => {
                            const trainingInfo = getTrainingForCell(day, timeSlot);
                            const isStart = trainingInfo && timeToMinutes(trainingInfo.training.time) === timeToMinutes(timeSlot);
                            
                            return (
                                <td 
                                key={dayIndex}
                                className="p-1 border border-gray-300 min-w-[80px] h-[50px] relative"
                                >
                                {trainingInfo && (
                                    <div className="absolute inset-0 bg-[#E7F6FD] border-l-2 border-l-[#0369a1] flex items-start p-1">
                                    {isStart && (
                                        <div className="text-xs leading-tight">
                                        <div className="font-medium text-[#0369a1]">
                                            {trainingInfo.training.timeDisplay}
                                        </div>
                                        <div className="text-[#0369a1] mt-0.5">
                                            {trainingInfo.training.title}
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
            </div>
            </div>
        </div>
      </main>
  );
}