'use client'

import { useEffect, useState, useRef } from 'react';
import { useTeacherClubs } from '@/hooks/useTeacherClubs';
import { type SectionMember, useSectionMembers } from '@/hooks/useSectionMembers';
import { Profile } from '@/components/Profile';
import { Navbar } from '@/components/navbar';
import { useAuth } from '../../../contexts/AuthContext';

const MemberCard: React.FC<{
    member: SectionMember;
    onClick: (member: SectionMember) => void
}> = ({ member, onClick }) => {
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
            className="border-2 border-blue-400 rounded-2xl p-4 shadow-sm transition-all duration-200 hover:shadow-md bg-white hover:scale-[1.02] hover:border-blue-500 cursor-pointer"
            onClick={() => onClick(member)}
        >
            <div className="mb-3">
                <div className="text-xs text-blue-600 font-medium mb-1">Участник</div>
            </div>
            <div className="mb-3">
                <p className="font-semibold text-gray-800 text-lg">{member.user_name}</p>
                {member.group_name && (
                    <p className="text-sm text-gray-600 mt-1">Группа: {member.group_name}</p>
                )}
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-3">
                <span className="truncate max-w-[120px]">{member.club_name}</span>
                <span className="text-xs">{formatDate(member.created_at)}</span>
            </div>
        </div>
    );
};

const TableMemberRow: React.FC<{
    member: SectionMember;
    index: number;
    onClick: (member: SectionMember) => void
}> = ({ member, index, onClick }) => {
    return (
        <tr
            className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
            onClick={() => onClick(member)}
        >
            <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
            <td className="px-4 py-3">
                <p className="font-medium text-gray-800">{member.user_name}</p>
                {member.group_name && (
                    <p className="text-xs text-gray-500 mt-1">{member.group_name}</p>
                )}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">{member.club_name}</td>
            <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(member.created_at).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                })}
            </td>
            <td className="px-4 py-3 text-sm">
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          {member.status}
        </span>
            </td>
        </tr>
    );
};

const MemberContextMenu: React.FC<{
    member: SectionMember | null;
    onClose: () => void;
}> = ({ member, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!member) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    ref={menuRef}
                    className="bg-white border-2 border-blue-400 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl text-gray-800">Данные участника</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 text-2xl p-1"
                            >
                                &times;
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{member.club_name}</p>
                    </div>

                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">ФИО участника</p>
                                <p className="font-semibold text-xl text-gray-800">{member.user_name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">ID участника</p>
                                    <p className="font-medium text-gray-800 text-lg">#{member.user_id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Дата принятия</p>
                                    <p className="font-medium text-gray-800">
                                        {new Date(member.created_at).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Контактная информация */}
                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-3 text-lg">Контактная информация</h4>
                            <div className="space-y-3">
                                {member.user_email && (
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-800 text-base">{member.user_email}</p>
                                    </div>
                                )}

                                {member.user_phone && (
                                    <div>
                                        <p className="text-sm text-gray-600">Телефон</p>
                                        <p className="font-medium text-gray-800 text-base">{member.user_phone}</p>
                                    </div>
                                )}

                                {member.user_snl && (
                                    <div>
                                        <p className="text-sm text-gray-600">Соц-сеть</p>
                                        <p className="font-medium text-gray-800 text-base">{member.user_snl}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-3 text-lg">Дополнительно</h4>
                            <div className="space-y-3">
                                {member.group_name && (
                                    <div>
                                        <p className="text-sm text-gray-600">Группа</p>
                                        <p className="font-medium text-gray-800 text-base">{member.group_name}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-gray-600">Статус</p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {member.status}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 p-4 flex justify-end rounded-b-2xl">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default function ClubMembersPage() {
    const { user } = useAuth();
    const { clubs: teacherClubs, loading: clubsLoading } = useTeacherClubs();
    const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
    const [selectedClubName, setSelectedClubName] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('table');
    const [selectedMember, setSelectedMember] = useState<SectionMember | null>(null);

    const selectedClub = teacherClubs.find(club => club.id === selectedClubId);
    const { members, loading: membersLoading, error } = useSectionMembers({
        clubId: selectedClubId || undefined
    });

    const totalPlaces = selectedClub?.total_places || 0;
    const takenPlaces = members.length;
    const freePlaces = Math.max(0, (totalPlaces || 0) - takenPlaces);
    const fillPercentage = totalPlaces > 0 ? Math.min((takenPlaces / totalPlaces) * 100, 100) : 0;

    const handleMemberClick = (member: SectionMember) => {
        setSelectedMember(member);
    };

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

    if (clubsLoading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex min-h-[calc(100vh-70px)]">
                    <Profile />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-lg text-gray-600">Загрузка секций...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!teacherClubs || teacherClubs.length === 0) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex min-h-[calc(100vh-70px)]">
                    <Profile />
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
            <Navbar />

            <div className="flex min-h-[calc(100vh-70px)]">
                <Profile />

                <div className="flex-1 p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Участники секций</h1>
                        <p className="text-gray-600">Нажмите на карточку участника для просмотра подробной информации</p>
                    </div>

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

                    {selectedClubId && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {selectedClubName} • Участников: {members.length}
                                    </h2>

                                    {totalPlaces > 0 && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                <span>Занято {takenPlaces} из {totalPlaces} мест</span>
                                                {freePlaces > 0 && (
                                                    <span className="text-green-600">
                            (Осталось {freePlaces})
                          </span>
                                                )}
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${fillPercentage}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`
                      h-[36px] px-4 rounded-lg font-medium transition-all
                      ${viewMode === 'grid'
                                            ? 'bg-white text-blue-500 shadow-sm'
                                            : 'text-gray-600 hover:text-blue-500'
                                        }
                    `}
                                    >
                                        Сетка
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`
                      h-[36px] px-4 rounded-lg font-medium transition-all
                      ${viewMode === 'list'
                                            ? 'bg-white text-blue-500 shadow-sm'
                                            : 'text-gray-600 hover:text-blue-500'
                                        }
                    `}
                                    >
                                        Список
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`
                      h-[36px] px-4 rounded-lg font-medium transition-all
                      ${viewMode === 'table'
                                            ? 'bg-white text-blue-500 shadow-sm'
                                            : 'text-gray-600 hover:text-blue-500'
                                        }
                    `}
                                    >
                                        Таблица
                                    </button>
                                </div>
                            </div>

                            {membersLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="text-gray-600 animate-pulse">Загрузка участников...</div>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <p className="text-red-600 font-medium mb-2">Ошибка загрузки</p>
                                    <p className="text-red-500 text-sm">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                                    >
                                        Попробовать снова
                                    </button>
                                </div>
                            ) : members.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <div className="text-gray-500 mb-2 text-lg">Участников нет</div>
                                    <p className="text-gray-400">
                                        В этой секции пока нет активных участников
                                    </p>
                                </div>
                            ) : viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {members.map((member) => (
                                        <MemberCard
                                            key={member.id}
                                            member={member}
                                            onClick={handleMemberClick}
                                        />
                                    ))}
                                </div>
                            ) : viewMode === 'list' ? (
                                <div className="space-y-3">
                                    {members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                            onClick={() => handleMemberClick(member)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 text-lg">{member.user_name}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-sm text-gray-600">{member.club_name}</span>
                                                        {member.group_name && (
                                                            <>
                                                                <span className="text-xs text-gray-400">•</span>
                                                                <span className="text-sm text-gray-500">{member.group_name}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                          <span className="text-sm text-gray-400 block">
                            {new Date(member.created_at).toLocaleDateString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}
                          </span>
                                                    <span className="text-xs text-green-600 mt-1">{member.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    №
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ФИО участника
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Секция
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Дата принятия
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Статус
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                            {members.map((member, index) => (
                                                <TableMemberRow
                                                    key={member.id}
                                                    member={member}
                                                    index={index}
                                                    onClick={handleMemberClick}
                                                />
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <MemberContextMenu
                member={selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        </div>
    );
}