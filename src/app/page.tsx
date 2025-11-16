import Link from "next/link";
import {CircleUserRound, Hexagon, Lock, LogIn, Search} from "lucide-react";
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import {CustomButton} from "@/components/CustomButton"
import {PostCard} from "@/components/PostCard"
import type {PostData} from "@/components/PostCard"

const postsData: PostData[] = [
    {
        date: "20 ноября 2025 18:57",
        title: "История футбола в МАИ",
        description: "История нашего спортивного клуба началась в 1970 году. Тогда мы набрали ребят и стали их тренировать. За эти годы мы вырастили множество талантливых спортсменов.",
        account: "Ерофеев Иван"
    },
    {
        date: "18 ноября 2025 14:20",
        title: "Новый сезон баскетбольной лиги",
        description: "Открываем регистрацию на новый сезон университетской баскетбольной лиги. Приглашаем всех желающих присоединиться к тренировкам и соревнованиям.",
        account: "Петрова Анна"
    },
    {
        date: "15 ноября 2025 09:45",
        title: "Тренировки по плаванию",
        description: "С этого месяца добавляются утренние сессии в бассейне. Расписание и запись доступны в личном кабинете. Не забудьте медицинские справки!",
        account: "Сидоров Михаил"
    },
    {
        date: "12 ноября 2025 16:30",
        title: "Турнир по настольному теннису",
        description: "В конце месяца пройдет ежегодный турнир среди факультетов. Регистрируйтесь командами по 3 человека. Призы победителям!",
        account: "Козлова Дарья"
    },
    {
        date: "10 ноября 2025 11:15",
        title: "Обновление спортивного зала",
        description: "Завершился ремонт в основном спортивном зале. Установлено новое оборудование и покрытие. Ждем всех на тренировках!",
        account: "Федоров Алексей"
    },
    {
        date: "8 ноября 2025 19:00",
        title: "Йога для начинающих",
        description: "Открыта запись в новую группу по йоге. Занятия проходят по вечерам вторника и четверга. Подходит для любого уровня подготовки.",
        account: "Николаева София"
    },
    {
        date: "5 ноября 2025 13:40",
        title: "Сборная по волейболу",
        description: "Ищем талантливых игроков в сборную университета по волейболу. Требуется посещение не менее 3 тренировок в неделю.",
        account: "Волков Денис"
    },
    {
        date: "2 ноября 2025 10:25",
        title: "Беговой клуб 'Спринтер'",
        description: "Присоединяйтесь к нашим утренним пробежкам в парке. Тренируемся каждый день в 7:30 у главного входа в университет.",
        account: "Орлова Екатерина"
    },
    {
        date: "30 октября 2025 17:50",
        title: "Шахматный турнир",
        description: "В эту субботу пройдет блиц-турнир по шахматам. Участие бесплатное, регистрация на месте за 30 минут до начала.",
        account: "Громов Павел"
    },
    {
        date: "28 октября 2025 15:10",
        title: "Тренажерный зал: новые правила",
        description: "Обращаем внимание на обновленные правила посещения тренажерного зала. Обязательна сменная обувь и полотенце.",
        account: "Зайцева Мария"
    },
    {
        date: "25 октября 2025 20:30",
        title: "Футбольные матчи на выходные",
        description: "Расписание футбольных матчей на ближайшие выходные. Команды сборов формируются по предварительной записи.",
        account: "Белов Артем"
    },
    {
        date: "22 октября 2025 12:05",
        title: "Спортивные достижения месяца",
        description: "Поздравляем наших студентов с победами на региональных соревнованиях! Особые успехи в легкой атлетике и плавании.",
        account: "Семенова Ольга"
    }
];

export default function HomePage() {

    return (

        <main className="flex flex-col min-h-screen bg-white">

            <div className="flex flex-col sticky top-0 bg-white gap-2 mb-2">
                <Navbar></Navbar>
                <div className = "h-[40px] relative px-20">
                    <Input placeholder="Поиск" className="rounded-xl h-full border-gray-500"></Input>
                    <Search className="size-[18px] text-gray-500 absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-23"></Search>
                </div>
                <div className="w-full flex flex-row items-center gap-2 px-20">
                    <CustomButton text = "Исторические" isSelected={true}></CustomButton>
                    <CustomButton text = "Организационные" isSelected={false}></CustomButton>
                    <CustomButton text = "Достижения" isSelected={false}></CustomButton>
                </div>
            </div>


            <div className="px-20 pt-[1px]">
                <div className="grid grid-cols-3 gap-2">
                    {postsData.map((post, index) => (
                        <PostCard key={index} postData={post} />
                    ))}
                </div>

            </div>

        </main>

    );
}






