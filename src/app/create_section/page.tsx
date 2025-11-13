'use client';
import { CustomButton } from "@/components/CustomButton";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, CirclePlus, PencilLine } from "lucide-react";
import { useState } from 'react';

export default function Homepage() {
    return(
        <main className="overflow-hidden">
            <div className='flex flex-col sticky top-0 bg-white z-70'>
                <Navbar></Navbar>
            </div>
            <div className='flex flex-row gap-[45px] min-w-screen'>
                <div className="flex flex-col ml-[25px] w-[190px] justify-center gap-2">
                    <Avatar className="h-[190px] w-[190px] mt-[65px]">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-row gap-1 mb-6 pt-2 text-gray-500 justify-center hover:text-blue-500 transition-colors duration-400 ease-in-out'>
                        <span>Редактировать</span>
                        <PencilLine/>
                    </div>
                    <CustomButton text='Участники' isSelected={false}></CustomButton>
                    <CustomButton text='Заявки' isSelected={false}></CustomButton>
                    <CustomButton text='Тренировка' isSelected={false}></CustomButton>
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
                <div className="mt-[65px] flex flex-col w-5/12">
                    <span className="text-4xl">Создание секции</span>
                    <div className="flex flex-col gap-5">
                        <span className="text-3xl mb-5 mt-[50px]">Краткая информация о секции</span>
                        <Input 
                        placeholder="Название"
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10">
                        </Input>
                        <Input 
                        placeholder="Место проведения"
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10">
                        </Input>
                        <Input 
                        placeholder="Минимальное количество тренировок в неделю"
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10">
                        </Input>
                        <Input 
                        placeholder="Уровень обучения"
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10">
                        </Input>
                        <Input 
                        placeholder="Количество мест"
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10">
                        </Input>
                    </div>
                </div>
                <div className="flex flex-col gap-5 mr-12 w-7/12">
                    <span className="text-3xl mb-5 mt-[155px]">Описание</span>
                    <Textarea
                            className="rounded-xl h-[260px] w-full bg-gray-200 pr-10 placeholder:align-top"
                            placeholder="Напишите что-нибудь">
                    </Textarea>
                </div>       
            </div>
            <div className="ml-[260px] mt-2 max-w-7xl mr-9">
                <span className="text-3xl mb-[35px]">Наше расписание</span>
                <Schedule/>
            </div>
        </main>
    )
}


function Schedule() {
    const [rowCount] = useState(1);
    return (
        <div className="w-full">
            <table className="my-[30px] w-full text-sm table-fixed">
                <thead>
                    <tr>
                        <th className='border border-gray-200 text-[#0079DB]'>ПН</th>
                        <th className='border border-gray-200 text-[#0079DB]'>ВТ</th>
                        <th className='border border-gray-200 text-[#0079DB]'>СР</th>
                        <th className='border border-gray-200 text-[#0079DB]'>ЧТ</th>
                        <th className='border border-gray-200 text-[#0079DB]'>ПТ</th>
                        <th className='border border-gray-200 text-[#0079DB]'>СБ</th>
                        <th className='border border-gray-200 text-[#0079DB]'>ВС</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rowCount }).map((_, index) => (
                    <tr key={index}>
                        <Row/>
                        <Row/>
                        <Row/>
                        <Row/>
                        <Row/>
                        <Row/>
                        <Row/>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
function Row() {
    const [inputs, setInputs] = useState([]);

    const addInput = () => {
        setInputs([...inputs, '']);
    };
    return (
        <td className='border border-gray-100 px-2 py-1'>
            <div className='flex flex-row gap-2 justify-center mb-1'>
                <span>Тренировка</span>
                <div className='w-[15px] h-[15px]'>
                    <Image src='/image 13.png' alt='image13' width={15} height={15}/>
                </div>
            </div>
            <div className="flex flex-col ml-5 gap-1">
                {inputs.map((_, index) => (
                    <input 
                        key={index}
                        className="border border-gray-300 rounded-xl px-2 py-1 w-28"
                        placeholder="13:00-14:30"
                    />
                ))}
                <button 
                    onClick={addInput}
                    className="text-blue-500 -ml-5 text-lg font-bold hover:text-blue-700 mt-1">
                    +
                </button>
            </div>
        </td>
    )
}