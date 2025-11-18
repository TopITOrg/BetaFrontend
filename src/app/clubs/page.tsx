import {CircleUserRound, Hexagon, Lock, LogIn, Search} from "lucide-react";
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import  type {ClubData} from "@/components/ClubCard"
import { ClubCard } from "@/components/ClubCard"
const clubsData: ClubData[] = [
    {
        title: "Футбол",
        availableSpots: "15/45",
        location: "улица Ленина, д. 144, 3 этаж",
        workoutsPerWeek: "3-4",
        skillLevel: "начальный"
    },
    {
        title: "Баскетбол",
        availableSpots: "10/30",
        location: "ул. Спортивная, д. 25",
        workoutsPerWeek: "2-3",
        skillLevel: "продвинутый"
    },
    {
        title: "Волейбол",
        availableSpots: "20/35",
        location: "пр. Победы, д. 67",
        workoutsPerWeek: "4-5",
        skillLevel: "начальный"
    },
    // ... остальные посты
];

export default function HomePage() {

    return (
        <main className="flex flex-col min-h-screen bg-white">

            <div className="flex flex-col sticky top-0 bg-white z-10 gap-2 mb-2">
                <Navbar></Navbar>
                <div className="w-full border-gray-100 flex flex-col justify-center px-20">
                    <div className="h-[40px] relative">
                        <Input placeholder="Поиск" className="rounded-xl border-gray-500 h-full"></Input>
                        <Search className="size-[18px] text-gray-500 absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-3"></Search>
                    </div>
                </div>

                <div className="w-full flex flex-row items-center gap-5 px-20 h-[40px]">
                    <div className="flex items-center gap-1">
                        <Checkbox className="size-[20px] rounded-[7px]
                       transition-all
                       duration-200
                       ease-in-out
                       data-[state=checked]:bg-blue-500
                       data-[state=checked]:text-white
                       data-[state=checked]:border-blue-500" />
                        <h1 >Начальные</h1>
                    </div>
                    <div className="flex items-center gap-1">
                        <Checkbox className="size-[20px] rounded-[7px]
                       transition-all
                       duration-200
                       ease-in-out
                       data-[state=checked]:bg-blue-500
                       data-[state=checked]:text-white
                       data-[state=checked]:border-blue-500" />
                        <h1 >Продвинутые</h1>
                    </div>
                    <div className="flex items-center gap-1">
                        <Checkbox className="size-[20px] rounded-[7px]
                       transition-all
                       duration-200
                       ease-in-out
                       data-[state=checked]:bg-blue-500
                       data-[state=checked]:text-white
                       data-[state=checked]:border-blue-500" />
                        <h1 >ГСС</h1>
                    </div>


                </div>
            </div>

            <div className="px-20 pt-[1px]">
                <div className="grid grid-cols-3 gap-2">
                    {clubsData.map((post, index) => (
                        <ClubCard key={index} clubData = {post}/>
                    ))}
                </div>
            </div>
        </main>
    );
}

