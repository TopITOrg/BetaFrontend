import { ChevronDown, CirclePlus, PencilLine } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomButton } from "@/components/CustomButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export function Profile() {
    return (
        <div className="flex flex-col ml-[25px] w-[190px] gap-2">
            <Avatar className="h-[190px] w-[190px] mt-[65px]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex flex-row gap-1 mb-6 pt-2 text-gray-500 justify-center hover:text-blue-500 transition-colors duration-400 ease-in-out'>
                <span>Редактировать</span>
                <PencilLine/>
            </div>
            <CustomButton text='Участники' isSelected={false}></CustomButton>
            <Link href='/task-65'>
                <CustomButton text='Заявки' isSelected={false} className="w-[190px]"></CustomButton>
            </Link>
            <Link href='/train_teacher'>
                <CustomButton text='Тренировка' isSelected={false} className="w-[190px]"></CustomButton>
            </Link>
            
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="outline" className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                        hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                        transition-colors duration-400 ease-in-out h-[40px] w-[190px]">
                        <span>Мои секции</span>
                        <ChevronDown/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[190px]">
                    <DropdownMenuItem>Футбол</DropdownMenuItem>
                    <DropdownMenuItem className="text-[#0079DB]">Скалолазание</DropdownMenuItem>
                    <DropdownMenuItem>Баскетбол</DropdownMenuItem>
                    <DropdownMenuItem>
                        <div className="flex flex-row gap-1 items-center">
                            <span>Добавить секцию</span>
                            <CirclePlus/>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}