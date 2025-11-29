"use client"
import Image from "next/image";
import { useState, type Key } from "react";

function Row() {
    const [inputs, setInputs] = useState<string[]>([]);

    const addInput = () => {
        setInputs([...inputs, '']);
    };
    return (
        <td className='border border-gray-100 px-2 py-1 align-top'>
            <div className='flex flex-row  gap-2 justify-center mb-1'>
                <span>Тренировка</span>
                <div className='w-[15px] h-[15px]'>
                    <Image src='/components/image 13.png' alt='image13' width={15} height={15}/>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                {inputs.map((_: any, index: Key | null | undefined) => (
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