import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

export default function HomePage() {
    /* type SectionDTO = {
            name: string
            place: string
            min_train: string
            level: string
            amount_places: string
            description: string
        }
        const {data : sections = []} = useQuery({
            queryKey: ["todos"],
            queryFn: async () => {
            const res = await axios.get<SectionDTO[]>("http://localhost:3002/sections")
            return res.data}
        }) */
    return (
        <main>
            <div className='flex flex-col sticky top-0 bg-white z-70'>
                <Navbar/>
            </div>
            <div className="flex flex-col justify-center mx-auto max-w-6xl">
                <div className='mt-[70px]'>
                    <span className='font-bold text-5xl'>Скалолазание</span>
                    <div className="flex flex-col mt-[45px]">
                        <span>Создано в 18:45 17.11.25</span>
                        <span>Место: СК “Черепаха”</span>
                        <span>Свободно 10/70 мест</span>
                        <span>Минимальное количество</span>
                        <span>тренировок в неделю: 2 раза</span>
                        <span>Уровень обучения: ГСС</span>
                    </div>
                </div>
                <div className='mt-[30px] mx-auto'>
                    <span className="text-4xl font-light">Описание</span>
                    <p className='mt-[30px]'>Мы бережём традиции побеждать с 1987 года. Да, это про секцию скалолазания МАИ.
                    С 1987 года маёвские скалолазы поднимаются на подиумы Первенств Москвы, России и международной Универсиады. 
                    Среди нас ЗМС, МСМК, призеры и чемпионы Европы и Мира. Их путь начинался здесь, на балконе волейбольного зала спорткомплекса «Черепаха».
                    </p>
                </div>
                <div className="mt-[30px]">
                    <span className= "text-4xl font-light">Наше расписание</span>
                    <div>
                        <Schedule/>
                    </div>
                </div>
            <div className=" flex justify-center mb-[40px]">
                <Button variant="outline" className="rounded-xl border-2 font-bold bg-white text-blue-500 border-blue-500
                    hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                    transition-colors duration-400 ease-in-out h-[40px] ">Записаться в секцию</Button>
            </div>
                
            </div>
        </main>
    )
}


function Schedule() {
    return (
        <div>
            <table className="w-full my-[30px]">
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
                    <tr>
                        <td className='border border-gray-100 px-2 py-1'>
                        <div className='flex flex-row gap-2 items-center ml-4'>
                                <span>Тренировка</span>
                                <div className='w-[15px] h-[15px]'>
                                    <Image src='/image 13.png' alt='image13' width={15} height={15}/>
                                </div>
                            </div>
                        <div className="flex flex-col ml-4 gap-1">
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>13:00-14:30</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>14:45-16:15</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>16:30-18:00</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>18:30-21:00</span>
                            </div>
                        </div>
                        </td>

                        <td className='border border-gray-100 px-2 py-1'>
                        <div className='flex flex-row gap-2 items-center ml-4'>
                                <span>Тренировка</span>
                                <div className='w-[15px] h-[15px]'>
                                    <Image src='/image 13.png' alt='image13' width={15} height={15}/>
                                </div>
                            </div>
                        <div className="flex flex-col ml-4 gap-1">
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>13:00-14:30</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>14:45-16:15</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>16:30-18:00</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>18:30-21:00</span>
                            </div>
                        </div>
                        </td>

                        <td className='border border-gray-100 px-2 py-1'>
                        <div className='flex flex-row gap-2 items-center ml-4'>
                                <span>Тренировка</span>
                                <div className='w-[15px] h-[15px]'>
                                    <Image src='/image 13.png' alt='image13' width={15} height={15}/>
                                </div>
                            </div>
                        <div className="flex flex-col ml-4 gap-1">
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>13:00-14:30</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>14:45-16:15</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>16:30-18:00</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>18:30-21:00</span>
                            </div>
                        </div>
                        </td>

                        <td className='border border-gray-100 px-2 py-1'>
                        <div className='flex flex-row gap-2 items-center ml-4'>
                                <span>Тренировка</span>
                                <div className='w-[15px] h-[15px]'>
                                    <Image src='/image 13.png' alt='image13' width={15} height={15}/>
                                </div>
                            </div>
                        <div className="flex flex-col ml-4 gap-1">
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>13:00-14:30</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>14:45-16:15</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>16:30-18:00</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>18:30-21:00</span>
                            </div>
                        </div>
                        </td>

                        <td className='border border-gray-100 px-2 py-1'>
                        <div className='flex flex-row gap-2 items-center ml-4'>
                                <span>Тренировка</span>
                                <div className='w-[15px] h-[15px]'>
                                    <Image src='/image 13.png' alt='image13' width={15} height={15}/>
                                </div>
                            </div>
                        <div className="flex flex-col ml-4 gap-1">
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>13:00-14:30</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>14:45-16:15</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>16:30-18:00</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>18:30-21:00</span>
                            </div>
                        </div>
                        </td>

                        <td className='border border-gray-100 px-2 py-1'>
                        <div className='flex flex-row gap-2 items-center ml-4'>
                                <span>Тренировка</span>
                                <div className='w-[15px] h-[15px]'>
                                    <Image src='/image 13.png' alt='image13' width={15} height={15}/>
                                </div>
                            </div>
                        <div className="flex flex-col ml-4 gap-1">
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>13:00-14:30</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>14:45-16:15</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>16:30-18:00</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>18:30-21:00</span>
                            </div>
                        </div>
                        </td>

                        <td className='border border-gray-100 px-2 py-1'>
                        <div className='flex flex-row gap-2 items-center ml-4'>
                                <span>Тренировка</span>
                                <div className='w-[15px] h-[15px]'>
                                    <Image src='/image 13.png' alt='image13' width={15} height={15}/>
                                </div>
                            </div>
                        <div className="flex flex-col ml-4 gap-1">
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>13:00-14:30</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>14:45-16:15</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>16:30-18:00</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <Checkbox className="border-[#0079DB] rounded-3xl"/>
                                <span>18:30-21:00</span>
                            </div>
                        </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}