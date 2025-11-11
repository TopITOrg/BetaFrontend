import Link from "next/link";
import {CircleUserRound, Hexagon, Lock, LogIn, Search} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import { Navbar } from "@/components/navbar"

export default function HomePage() {

    return (

        <main className="flex flex-col min-h-screen bg-white">

            <div className="flex flex-col sticky top-0 bg-white">
                <Navbar></Navbar>
                <div className="w-full border-gray-100 flex flex-col justify-between px-20 gap-2 h-[100px] py-2">

                    <div className = "h-[50px] relative">

                        <Input placeholder="Поиск" className="rounded-[18px] h-full border-gray-500"></Input>
                        <Search className="size-[18px] text-gray-500 absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-3"></Search>
                    </div>
                    <div className="w-full flex flex-row items-center gap-2 h-[35px]">

                        <Button variant="outline" className="rounded-xl border-2 bg-blue-500 text-white border-blue-500
                    hover:text-white hover:border-blue-600 hover:bg-blue-600
                    transition-colors duration-400 ease-in-out h-[40px] ">Исторические
                        </Button>

                        <Button variant="outline" className="rounded-xl border-2 font-bold bg-white text-blue-500 border-blue-500
                    hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                    transition-colors duration-400 ease-in-out h-[40px] ">Организационные</Button>

                        <Button variant="outline" className="rounded-xl border-2 font-bold bg-white text-blue-500 border-blue-500
                    hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                    transition-colors duration-400 ease-in-out h-[40px] ">Достижения</Button>
                    </div>
                </div>
            </div>


            <div className="px-20 pt-[1px]">
                <div className="grid grid-cols-3 gap-2">
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                </div>

            </div>



        </main>

    );
}




function Post(){
    return (

        <div className="flex flex-col  border-1 border-gray-300 rounded-2xl overflow-hidden">
            <div className="w-full bg-blue-500 h-3"></div>

            <div className="flex flex-col gap-3 p-2  py-5">
                <h2 className="text-gray-500">20 ноября 2025 18:57</h2>
                <h1 className="text-xl">История футбола в МАИ</h1>
                <p className="text-gray-500">
                    История нашего спортивного клуба началась в 1970 году. Тогда мы набрали ребят и стали их тренировать...
                </p>

                <div className="flex flex-row items-center justify-left gap-3">

                    <CircleUserRound className="size-[5vh] text-blue-500" />

                    <span>Ерофеев Иван</span>
                </div>
            </div>

        </div>
    );
}