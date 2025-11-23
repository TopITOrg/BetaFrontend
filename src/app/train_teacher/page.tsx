"use client"
import Image from "next/image";
import { Profile } from "@/components/Profile";
import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { CustomButton } from "@/components/CustomButton";

export default function HomePage() {
    return(
        <main>
            <div className='flex flex-col sticky top-0 bg-white z-70'>
                <Navbar></Navbar>
            </div>
            <div className="flex flex-row gap-5 items-start mr-[25px]">
                <div className='flex flex-row items-start'>
                    <Profile></Profile>
                </div>
                <div className="mt-[65px]">
                    <Schedule></Schedule>
                    <div className="mt-10 flex justify-center">
                        <CustomButton text="Создать расписание" isSelected = {false}/>
                    </div>
                </div>
            </div>
        </main>
    )
}















function Schedule() {
    const [rowCount] = useState(1);
    return (
        <div className="w-full">
            <table className="w-full text-sm table-fixed">
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
        <td className='border border-gray-100 px-2 py-1 align-top'>
            <div className='flex flex-row  gap-2 justify-center mb-1'>
                <span>Тренировка</span>
                <div className='w-[15px] h-[15px]'>
                    <Image src='/image 13.png' alt='image13' width={15} height={15}/>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                {inputs.map((_, index) => (
                    <input 
                        key={index}
                        className="border border-gray-300 rounded-xl px-2 py-1 w-28 mx-auto placeholder:text-center"
                        placeholder="13:00-14:30"
                    />
                ))}
                <button 
                    onClick={addInput}
                    className="text-blue-500  text-lg font-bold hover:text-blue-700 mt-1">
                    +
                </button>
            </div>
        </td>
    )
}