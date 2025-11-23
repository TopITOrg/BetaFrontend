"use client"

import {Search} from "lucide-react";
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import {CustomButton} from "@/components/CustomButton"
import {PostCard} from "@/components/PostCard"
import type {PostData} from "@/components/PostCard"
import { useState, useMemo } from "react";

type Category = 'historical' | 'organizational' | 'achievements';
type PostWithCategory = PostData & {
    category: Category;
};

const postsData: PostWithCategory[] = [
    {
        "date": "20 ноября 2025 18:57",
        "title": "История футбола в МАИ",
        "description": "История нашего спортивного клуба началась в 1970 году. Тогда мы набрали ребят и стали их тренировать. За эти годы мы вырастили множество талантливых спортсменов.",
        "account": "Ерофеев Иван",
        "category": "historical"
    },
    {
        "date": "18 ноября 2025 14:20",
        "title": "Новый сезон баскетбольной лиги",
        "description": "Открываем регистрацию на новый сезон университетской баскетбольной лиги. Приглашаем всех желающих присоединиться к тренировкам и соревнованиям.",
        "account": "Петрова Анна",
        "category": "organizational"
    },
    {
        "date": "15 ноября 2025 09:45",
        "title": "Тренировки по плаванию",
        "description": "С этого месяца добавляются утренние сессии в бассейне. Расписание и запись доступны в личном кабинете. Не забудьте медицинские справки!",
        "account": "Сидоров Михаил",
        "category": "organizational"
    },
    {
        "date": "12 ноября 2025 16:30",
        "title": "Турнир по настольному теннису",
        "description": "В конце месяца пройдет ежегодный турнир среди факультетов. Регистрируйтесь командами по 3 человека. Призы победителям!",
        "account": "Козлова Дарья",
        "category": "organizational"
    },
    {
        "date": "10 ноября 2025 11:15",
        "title": "Обновление спортивного зала",
        "description": "Завершился ремонт в основном спортивном зале. Установлено новое оборудование и покрытие. Ждем всех на тренировках!",
        "account": "Федоров Алексей",
        "category": "organizational"
    },
    {
        "date": "8 ноября 2025 19:00",
        "title": "Йога для начинающих",
        "description": "Открыта запись в новую группу по йоге. Занятия проходят по вечерам вторника и четверга. Подходит для любого уровня подготовки.",
        "account": "Николаева София",
        "category": "organizational"
    },
    {
        "date": "5 ноября 2025 13:40",
        "title": "Сборная по волейболу",
        "description": "Ищем талантливых игроков в сборную университета по волейболу. Требуется посещение не менее 3 тренировок в неделю.",
        "account": "Волков Денис",
        "category": "organizational"
    },
    {
        "date": "2 ноября 2025 10:25",
        "title": "Беговой клуб 'Спринтер'",
        "description": "Присоединяйтесь к нашим утренним пробежкам в парке. Тренируемся каждый день в 7:30 у главного входа в университет.",
        "account": "Орлова Екатерина",
        "category": "organizational"
    },
    {
        "date": "30 октября 2025 17:50",
        "title": "История шахматного клуба",
        "description": "Наш шахматный клуб существует с 1985 года и воспитал множество чемпионов. В эту субботу пройдет блиц-турнир по шахматам.",
        "account": "Громов Павел",
        "category": "historical"
    },
    {
        "date": "28 октября 2025 15:10",
        "title": "Тренажерный зал: новые правила",
        "description": "Обращаем внимание на обновленные правила посещения тренажерного зала. Обязательна сменная обувь и полотенце.",
        "account": "Зайцева Мария",
        "category": "organizational"
    },
    {
        "date": "25 октября 2025 20:30",
        "title": "История футбольных традиций",
        "description": "Традиция футбольных матчей между факультетами началась в 1990-х годах. Расписание матчей на ближайшие выходные.",
        "account": "Белов Артем",
        "category": "historical"
    },
    {
        "date": "22 октября 2025 12:05",
        "title": "Спортивные достижения месяца",
        "description": "Поздравляем наших студентов с победами на региональных соревнованиях! Особые успехи в легкой атлетике и плавании.",
        "account": "Семенова Ольга",
        "category": "achievements"
    },
    {
        "date": "20 октября 2025 16:20",
        "title": "Золотые медалисты по плаванию",
        "description": "Наши пловцы завоевали 5 золотых медалей на чемпионате города. Гордимся нашими спортсменами!",
        "account": "Иванов Сергей",
        "category": "achievements"
    },
    {
        "date": "18 октября 2025 11:30",
        "title": "Рекорды легкой атлетики",
        "description": "Студент механического факультета установил новый университетский рекорд в беге на 100 метров.",
        "account": "Петров Дмитрий",
        "category": "achievements"
    },
    {
        "date": "15 октября 2025 14:45",
        "title": "История баскетбольной команды",
        "description": "Наша баскетбольная команда была основана в 1978 году и с тех пор многократно побеждала в городских соревнованиях.",
        "account": "Смирнова Анна",
        "category": "historical"
    },
    {
        "date": "12 октября 2025 09:15",
        "title": "Достижения в тяжелой атлетике",
        "description": "Наш студент занял первое место в региональных соревнованиях по тяжелой атлетике в весовой категории до 85 кг.",
        "account": "Кузнецов Андрей",
        "category": "achievements"
    }
];

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('historical');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = useMemo(() => {
        let filtered = postsData.filter(post => post.category === selectedCategory);

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.account.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [selectedCategory, searchQuery]);

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <div className="flex flex-col sticky top-0 bg-white gap-2 mb-2">
                <Navbar selectedButton={0}></Navbar>
                <div className="h-[40px] relative px-20">
                    <Input
                        placeholder="Поиск"
                        className="rounded-xl h-full border-gray-500"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <Search className="size-[18px] text-gray-500 absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-23" />
                </div>
                <div className="w-full flex flex-row items-center gap-2 px-20">
                    <CustomButton
                        text="Исторические"
                        isSelected={selectedCategory === 'historical'}
                        onClick={() => handleCategoryClick('historical')}
                    />
                    <CustomButton
                        text="Организационные"
                        isSelected={selectedCategory === 'organizational'}
                        onClick={() => handleCategoryClick('organizational')}
                    />
                    <CustomButton
                        text="Достижения"
                        isSelected={selectedCategory === 'achievements'}
                        onClick={() => handleCategoryClick('achievements')}
                    />
                </div>
            </div>

            <div className="px-20 pt-[1px]">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {searchQuery ? 'По вашему запросу ничего не найдено' : 'В этой категории пока нет постов'}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {filteredPosts.map((post, index) => (
                            <PostCard key={index} postData={post} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}