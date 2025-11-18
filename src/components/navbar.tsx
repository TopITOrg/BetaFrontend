import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {LogIn} from "lucide-react";
import {CustomButton} from "@/components/CustomButton";

function Navbar(){
    return (
        <nav className="px-2 gap-2 pt-2 flex flex-row items-center justify-between w-full h-[70px]">
            <div className="flex flex-row items-center gap-2">
                <Image src = "/Default.svg" width={40} height={40} alt = "logo" className="text-blue-500 size-[8vh]"/>
                <div className="">
                    <h1>Спортивные</h1>
                    <h1>секции</h1>
                </div>
            </div>

            <div className="gap-2 flex flex-row items-center absolute left-1/2 -translate-x-1/2">
                <CustomButton text="Новости" isSelected={true}></CustomButton>
                <CustomButton text="Спортивные клубы" isSelected={false}></CustomButton>
                <CustomButton text="Мероприятия" isSelected={false}></CustomButton>

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