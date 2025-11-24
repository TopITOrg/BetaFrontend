"use client"

import { CircleUserRound, Hexagon, Lock, LogIn, Search } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { ClubCard } from "@/components/ClubCard"
import { useState, useMemo } from "react";
import { useClubs } from "@/hooks/useClubs";
import { mapApiClubToCardData } from "@/types/club";

type SkillLevel = 'beginner' | 'advanced' | 'gss';

const levelToApiMap: { [key in SkillLevel]: string } = {
    'beginner': 'начальный',
    'advanced': 'продвинутый',
    'gss': 'ГСС'
};

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevels, setSelectedLevels] = useState<SkillLevel[]>([]);

    // Подготавливаем параметры для API
    const apiParams = useMemo(() => {
        const params: any = {};

        if (searchQuery.trim()) {
            params.name = searchQuery.trim();
        }

        // Преобразуем выбранные уровни в формат API
        if (selectedLevels.length > 0) {
            // Безопасно берем первый элемент
            const firstLevel = selectedLevels[0];
            if (firstLevel && levelToApiMap[firstLevel]) {
                params.education_level = levelToApiMap[firstLevel];
            }
        }

        return params;
    }, [selectedLevels, searchQuery]);

    // Получаем данные с бэкенда
    const { data: clubs = [], isLoading, error } = useClubs(apiParams);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleLevelChange = (level: SkillLevel) => {
        setSelectedLevels(prev =>
            prev.includes(level)
                ? prev.filter(l => l !== level)
                : [...prev, level]
        );
    };

    // Преобразуем данные API в формат для ClubCard
    const clubCardsData = useMemo(() => {
        return clubs.map(club => mapApiClubToCardData(club));
    }, [clubs]);

    // Дополнительная фильтрация на фронтенде (если нужно несколько уровней)
    const filteredClubs = useMemo(() => {
        if (selectedLevels.length <= 1) {
            return clubCardsData;
        }

        return clubCardsData.filter(club => {
            const clubLevel =
                club.skillLevel === 'начальный' ? 'beginner' :
                    club.skillLevel === 'продвинутый' ? 'advanced' : 'gss';
            return selectedLevels.includes(clubLevel as SkillLevel);
        });
    }, [clubCardsData, selectedLevels]);

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <Navbar selectedButton={2} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500">Загрузка клубов...</div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <Navbar selectedButton={1} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-500">Ошибка загрузки данных</div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <div className="flex flex-col sticky top-0 bg-white z-10 gap-2 mb-2">
                <Navbar selectedButton={1} />
                <div className="w-full border-gray-100 flex flex-col justify-center px-20">
                    <div className="h-[40px] relative">
                        <Input
                            placeholder="Поиск"
                            className="rounded-xl border-gray-500 h-full"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <Search className="size-[18px] text-gray-500 absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-3"></Search>
                    </div>
                </div>

                <div className="w-full flex flex-row items-center gap-5 px-20 h-[40px]">
                    <div className="flex items-center gap-1">
                        <Checkbox
                            className="size-[20px] rounded-[7px]
                         transition-all
                         duration-200
                         ease-in-out
                         data-[state=checked]:bg-blue-500
                         data-[state=checked]:text-white
                         data-[state=checked]:border-blue-500"
                            checked={selectedLevels.includes('beginner')}
                            onCheckedChange={() => handleLevelChange('beginner')}
                        />
                        <h1>Начальные</h1>
                    </div>
                    <div className="flex items-center gap-1">
                        <Checkbox
                            className="size-[20px] rounded-[7px]
                         transition-all
                         duration-200
                         ease-in-out
                         data-[state=checked]:bg-blue-500
                         data-[state=checked]:text-white
                         data-[state=checked]:border-blue-500"
                            checked={selectedLevels.includes('advanced')}
                            onCheckedChange={() => handleLevelChange('advanced')}
                        />
                        <h1>Продвинутые</h1>
                    </div>
                    <div className="flex items-center gap-1">
                        <Checkbox
                            className="size-[20px] rounded-[7px]
                         transition-all
                         duration-200
                         ease-in-out
                         data-[state=checked]:bg-blue-500
                         data-[state=checked]:text-white
                         data-[state=checked]:border-blue-500"
                            checked={selectedLevels.includes('gss')}
                            onCheckedChange={() => handleLevelChange('gss')}
                        />
                        <h1>ГСС</h1>
                    </div>
                </div>
            </div>

            <div className="px-20 pt-[1px]">
                {filteredClubs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {searchQuery || selectedLevels.length > 0
                            ? 'По вашему запросу ничего не найдено'
                            : 'Нет доступных клубов'}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {filteredClubs.map((club, index) => (
                            <ClubCard key={club.id || index} clubData={club} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}