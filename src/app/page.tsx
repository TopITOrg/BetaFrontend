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
            <Navbar></Navbar>


            <div className="w-full border-gray-100 flex flex-col  justify-center px-10 gap-2 h-[100px]">
                <Input placeholder="Поиск" className="rounded-3xl h-[35px]"></Input>
                <div className="w-full flex flex-row items-center gap-2">

                    <Button variant="outline" className="rounded-3xl bg-blue-500 text-white border-blue-500
                    hover:text-white hover:border-blue-600 hover:bg-blue-600
                    transition-colors duration-400 ease-in-out h-[35px] ">Исторические
                    </Button>

                    <Button variant="outline" className="rounded-3xl bg-white text-blue-500 border-blue-500
                    hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                    transition-colors duration-400 ease-in-out h-[35px] ">Организационные</Button>

                    <Button variant="outline" className="rounded-3xl bg-white text-blue-500 border-blue-500
                    hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                    transition-colors duration-400 ease-in-out h-[35px] ">Достижения</Button>
                </div>
            </div>

            <ScrollArea className="px-10 pt-[1px] h-[calc(100vh-170px)]">
                <div className="grid grid-cols-3 gap-2">
                    {/*{Array.from({ length: 50 }).map((_, i) => (*/}
                    {/*    <div key={i} className="p-4 bg-white border-1 h-[200px] rounded-3xl">*/}
                    {/*        Карточка секции {i + 1}*/}
                    {/*    </div>*/}
                    {/*))}*/}

                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                </div>

            </ScrollArea>



        </main>

    );
}


function Post(){
    return (

        <div className="flex flex-col p-2 bg-white border-1 rounded-3xl gap-2">
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
    );
}