import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {LogIn} from "lucide-react";

function Navbar(){
    return (
        <nav className="px-[25px] gap-2 pt-2 flex flex-row items-center justify-between w-full h-[70px]">
            <div className="flex flex-row items-center gap-2">
                <Image src = "/Default.svg" width={40} height={40} alt = "logo" className="text-blue-500 size-[8vh]"/>
                <div className="">
                    <h1>Спортивные</h1>
                    <h1>секции</h1>
                </div>
            </div>

            <div className="gap-2 flex flex-row items-center absolute left-1/2 -translate-x-1/2">

                <Button variant="outline" className="rounded-xl bg-blue-500 text-white border-blue-500
                        hover:text-white hover:border-blue-600 hover:bg-blue-600
                        transition-colors duration-400 ease-in-out h-[40px] ">Новости
                </Button>

                <Button variant="outline" className="rounded-xl border-2 font-bold bg-white text-blue-500 border-blue-500
                        hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                        transition-colors duration-400 ease-in-out h-[40px] ">Спортивные клубы</Button>

                <Button variant="outline" className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                        hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                        transition-colors duration-400 ease-in-out h-[40px] ">Мероприятия</Button>
            </div>

            <Link
                className="flex flex-row items-center gap-2
                        rounded-[200px] hover:text-blue-500
                        transition-colors duration-400 ease-in-out"
                href="/login"
            >
                <h1>Войти</h1>
                <LogIn />
            </Link>
        </nav>
    )
}

export {Navbar};