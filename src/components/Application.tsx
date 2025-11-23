import { CircleUserRound } from "lucide-react";
import { Button } from "./ui/button";

export function Application() {
    return (
        <div className="flex flex-col border-2 border-gray-300 rounded-xl h-[130px] w-[316px]">
            <div className="flex items-center space-x-2 justify-center mt-2">
                <CircleUserRound className="text-blue-500" size={40}/>
                <span className="text-lg">Ерофеев Иван Викторович</span>
            </div>
            <div className="flex flex-row justify-center mt-5 gap-5">
                <Button className="rounded-3xl text-white bg-[#69BE62] text-lg hover:bg-green-600 
                transition-colors duration-400 ease-in-out h-[45px] w-[130px]">
                Принять
                </Button>
                <Button className="rounded-3xl text-white bg-[#FF3131] text-lg hover:bg-red-600 
                transition-colors duration-400 ease-in-out h-[45px] w-[130px]">
                Отклонить
                </Button>
            </div>
        </div>
    )
}