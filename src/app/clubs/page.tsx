"use client"

import {Search} from "lucide-react";
import {Input} from "@/components/ui/input"
import {Checkbox} from "@/components/ui/checkbox"
import {Navbar} from "@/components/navbar"
import {ClubCard} from "@/components/ClubCard"
import {useMemo, useState} from "react";
import {useClubs} from "@/hooks/useClubs";
import Link from "next/link";
import {useAuth} from "../../../contexts/AuthContext";

type SkillLevel = 'beginner' | 'advanced' | 'gss';

export default function ClubsPage() {
    const {isAuthenticated} = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevels, setSelectedLevels] = useState<SkillLevel[]>([]);
    const {clubs, loading, error, refetch} = useClubs();

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

    const filteredClubs = useMemo(() => {
        let filtered = clubs;

        if (selectedLevels.length > 0) {
            filtered = filtered.filter(club => {
                const clubLevel =
                    club.skillLevel === 'начальный' ? 'beginner' :
                        club.skillLevel === 'продвинутый' ? 'advanced' : 'gss';
                return selectedLevels.includes(clubLevel as SkillLevel);
            });
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(club =>
                club.title.toLowerCase().includes(query) ||
                club.location.toLowerCase().includes(query) ||
                club.workoutsPerWeek.toLowerCase().includes(query) ||
                club.skillLevel.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [selectedLevels, searchQuery, clubs]);

    // Если не авторизован, показываем сообщение
    if (!isAuthenticated) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <div className="flex flex-col sticky top-0 bg-white z-10 gap-2 mb-2">
                    <Navbar selectedButton={2}/>
                </div>
                <div className="flex flex-col items-center justify-center flex-1 px-20">
                    <div className="text-center space-y-6 max-w-md">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Для просмотра секций требуется авторизация
                        </h1>
                        <p className="text-gray-600">
                            Пожалуйста, войдите в систему, чтобы увидеть доступные спортивные секции и подать заявку на
                            вступление.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/login"
                                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                Войти в систему
                            </Link>
                            <Link
                                href="/register"
                                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Зарегистрироваться
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <Navbar selectedButton={2}/>
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Загрузка клубов...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <div className="flex flex-col sticky top-0 bg-white z-10 gap-2 mb-2">
                <Navbar selectedButton={2}/>
                <div className="w-full border-gray-100 flex flex-col justify-center px-20">
                    <div className="h-[40px] relative">
                        <Input
                            placeholder="Поиск"
                            className="rounded-xl border-gray-500 h-full"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <Search
                            className="size-[18px] text-gray-500 absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-3"/>
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
                {error && (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="text-red-500 text-lg text-center">
                            Не удалось загрузить данные о секциях
                        </div>
                        <button
                            onClick={refetch}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Попробовать снова
                        </button>
                    </div>
                )}

                {!error && filteredClubs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {searchQuery || selectedLevels.length > 0
                            ? 'По вашему запросу ничего не найдено'
                            : 'Нет доступных клубов'}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {filteredClubs.map((club, index) => (
                            <ClubCard key={club.id || index} clubData={club}/>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}