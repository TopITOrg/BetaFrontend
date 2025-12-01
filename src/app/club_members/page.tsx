'use client'

import {useEffect, useState} from 'react';
import {useTeacherClubs} from '@/hooks/useTeacherClubs';
import {type SectionMember, useSectionMembers} from '@/hooks/useSectionMembers';
import {Profile} from '@/components/Profile';
import {Navbar} from '@/components/navbar';

// Компонент карточки участника
const MemberCard: React.FC<{ member: SectionMember }> = ({member}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div
            className="border-2 border-blue-400 rounded-2xl p-4 shadow-sm transition-all duration-200 hover:shadow-md bg-white hover:scale-[1.02] hover:border-blue-500">
            <div className="mb-3">
                <div className="text-xs text-blue-600 font-medium mb-1">Участник</div>
            </div>
            <div className="mb-3">
                <p className="font-semibold text-gray-800 text-lg">{member.UserName}</p>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-3">
                <span className="truncate max-w-[120px]">{member.ClubName}</span>
                <span className="text-xs">{formatDate(member.CreatedAt)}</span>
            </div>
        </div>
    );
};

// Компактный вариант для списка
const CompactMemberCard: React.FC<{ member: SectionMember }> = ({member}) => {
    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="font-medium text-gray-800">{member.UserName}</p>
                </div>
                <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
                    {new Date(member.CreatedAt).toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit'})}
                </span>
            </div>
        </div>
    );
};

// Строка таблицы
const TableMemberRow: React.FC<{ member: SectionMember; index: number }> = ({member, index}) => {
    return (
        <tr className="hover:bg-gray-50 border-b border-gray-100">
            <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
            <td className="px-4 py-3">
                <p className="font-medium text-gray-800">{member.UserName}</p>
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">{member.ClubName}</td>
            <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(member.CreatedAt).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                })}
            </td>
        </tr>
    );
};

export default function ClubMembersPage() {
    const {clubs: teacherClubs, loading: clubsLoading} = useTeacherClubs();
    const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
    const [selectedClubName, setSelectedClubName] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('list');

    const {members, loading: membersLoading, error} = useSectionMembers({
        clubId: selectedClubId || undefined
    });

    // Автовыбор первой секции
    useEffect(() => {
        if (teacherClubs && teacherClubs.length > 0 && !selectedClubId) {
            const firstClub = teacherClubs[0];
            if (firstClub) {
                setSelectedClubId(firstClub.id);
                setSelectedClubName(firstClub.name);
            }
        }
    }, [teacherClubs, selectedClubId]);

    const handleClubSelect = (clubId: number, clubName: string) => {
        setSelectedClubId(clubId);
        setSelectedClubName(clubName);
    };

    // Статус загрузки
    if (clubsLoading) {
        return (
            <div className="min-h-screen">
                <Navbar/>
                <div className="flex min-h-[calc(100vh-70px)]">
                    <Profile/>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-lg text-gray-600">Загрузка секций...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Нет секций
    if (!teacherClubs || teacherClubs.length === 0) {
        return (
            <div className="min-h-screen">
                <Navbar/>
                <div className="flex min-h-[calc(100vh-70px)]">
                    <Profile/>
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Участники секций</h1>
                        <p className="text-gray-600">У вас нет секций для просмотра участников</p>
                        <button
                            onClick={() => window.location.href = '/create-section'}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                        >
                            Создать секцию
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar/>

            <div className="flex min-h-[calc(100vh-70px)]">
                {/* Боковая панель */}
                <Profile/>

                {/* Основной контент */}
                <div className="flex-1 p-6">
                    {/* Заголовок */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Участники секций</h1>
                        <p className="text-gray-600">Список участников ваших спортивных секций</p>
                    </div>

                    {/* Выбор секции */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Выберите секцию</h2>
                        <div className="flex flex-wrap gap-2">
                            {teacherClubs.map((club) => (
                                <button
                                    key={club.id}
                                    onClick={() => handleClubSelect(club.id, club.name)}
                                    className={`
                                        h-[40px] px-6 rounded-xl font-bold transition-all duration-400 ease-in-out
                                        hover:scale-105 active:scale-95
                                        ${selectedClubId === club.id
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50'
                                    }
                                    `}
                                >
                                    {club.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Отображение участников */}
                    {selectedClubId && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {selectedClubName} • {members.length} участников
                                    </h2>
                                </div>

                                {/* Переключатель вида */}
                                {/* Переключатель вида */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`
            h-[36px] px-6 rounded-xl font-bold transition-all duration-400 ease-in-out
            hover:scale-105 active:scale-95
            ${viewMode === 'grid'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50'
                                        }
        `}
                                    >
                                        Сетка
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`
            h-[36px] px-6 rounded-xl font-bold transition-all duration-400 ease-in-out
            hover:scale-105 active:scale-95
            ${viewMode === 'list'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50'
                                        }
        `}
                                    >
                                        Список
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`
            h-[36px] px-6 rounded-xl font-bold transition-all duration-400 ease-in-out
            hover:scale-105 active:scale-95
            ${viewMode === 'table'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50'
                                        }
        `}
                                    >
                                        Таблица
                                    </button>
                                </div>
                            </div>

                            {/* Состояния загрузки и ошибки */}
                            {membersLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="text-gray-600">Загрузка участников...</div>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <p className="text-red-600">Ошибка: {error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Попробовать снова
                                    </button>
                                </div>
                            ) : members.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <div className="text-gray-500 mb-2">Участников нет</div>
                                    <p className="text-gray-400 text-sm">
                                        В этой секции пока нет активных участников
                                    </p>
                                </div>
                            ) : viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {members.map((member) => (
                                        <MemberCard key={member.ID} member={member}/>
                                    ))}
                                </div>
                            ) : viewMode === 'list' ? (
                                <div className="space-y-2">
                                    {members.map((member) => (
                                        <div
                                            key={member.ID}
                                            className="border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div className="flex items-center">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 text-lg">{member.UserName}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-gray-500">{member.ClubName}</span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(member.CreatedAt).toLocaleDateString('ru-RU', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                №
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ФИО участника
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Секция
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Дата принятия
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {members.map((member, index) => (
                                            <TableMemberRow key={member.ID} member={member} index={index}/>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Статистика */}
                            {members.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                                    Показано {members.length} участников
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}