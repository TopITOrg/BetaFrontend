'use client'

import { useEffect, useState } from 'react';
import { useTeacherClubs } from '@/hooks/useTeacherClubs';
import { type SectionMember, useSectionMembers } from '@/hooks/useSectionMembers';
import { Profile } from '@/components/Profile';
import { Navbar } from '@/components/navbar';
import { useAuth } from '../../contexts/AuthContext';

// Компонент карточки участника
const MemberCard: React.FC<{
    member: SectionMember;
    onClick: (member: SectionMember, event: React.MouseEvent) => void;
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
            onClick={(e) => onClick(member, e)}
            className="border-2 border-blue-400 rounded-2xl p-4 shadow-sm transition-all duration-200 hover:shadow-md bg-white hover:scale-[1.02] hover:border-blue-500 cursor-pointer active:scale-95"
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

// Строка таблицы
const TableMemberRow: React.FC<{
    member: SectionMember;
    index: number;
    onClick: (member: SectionMember, event: React.MouseEvent) => void;
}> = ({ member, index, onClick }) => {
    return (
        <tr
            onClick={(e) => onClick(member, e)}
            className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer active:bg-blue-50 transition-colors"
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
                <span className={`px-2 py-1 rounded-full text-xs ${
                    member.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : member.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                }`}>
                    {member.status}
                </span>
            </td>
        </tr>
    );
};

// Компонент контекстного меню с информацией о пользователе
const UserInfoModal: React.FC<{
    member: SectionMember | null;
    isOpen: boolean;
    onClose: () => void;
    position?: { x: number; y: number };
}> = ({ member, isOpen, onClose, position }) => {
    if (!isOpen || !member) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Функция для обработки ссылок
    const handleSocialLinkClick = (url: string) => {
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        window.open(url, '_blank');
    };

    // Функция для обработки телефона
    const handlePhoneClick = (phone: string) => {
        window.location.href = `tel:${phone.replace(/\D/g, '')}`;
    };

    // Функция для обработки email
    const handleEmailClick = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    return (
        <>
            {/* Затемнение фона */}
            <div
                className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Модальное окно */}
            <div
                className={`fixed z-50 bg-white rounded-2xl shadow-2xl border-2 border-blue-400 min-w-[320px] max-w-[500px] w-full mx-4 animate-in fade-in zoom-in-95 duration-200 ${
                    position ? 'absolute' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                }`}
                style={position ? { left: position.x, top: position.y } : {}}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Заголовок */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Информация об участнике</h3>
                        <p className="text-sm text-gray-600">{member.club_name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                {/* Контент */}
                <div className="p-6">
                    {/* Основная информация */}
                    <div className="mb-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                {member.user_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800">{member.user_name}</h4>
                                {member.group_name && (
                                    <div className="mt-1 inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                        <span>👥</span>
                                        <span>{member.group_name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Контактная информация */}
                    <div className="space-y-4">
                        {member.user_email && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer group"
                                 onClick={() => handleEmailClick(member.user_email!)}
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                    ✉️
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                        {member.user_email}
                                    </p>
                                </div>
                                <span className="text-blue-400 group-hover:text-blue-600 transition-colors">→</span>
                            </div>
                        )}

                        {member.user_phone && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors cursor-pointer group"
                                 onClick={() => handlePhoneClick(member.user_phone!)}
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                    📱
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Телефон</p>
                                    <p className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                                        {member.user_phone}
                                    </p>
                                </div>
                                <span className="text-green-400 group-hover:text-green-600 transition-colors">→</span>
                            </div>
                        )}

                        {member.user_snl && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors cursor-pointer group"
                                 onClick={() => handleSocialLinkClick(member.user_snl!)}
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                    🔗
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Соц. сеть</p>
                                    <p className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors truncate">
                                        {member.user_snl.replace('https://', '').replace('http://', '')}
                                    </p>
                                </div>
                                <span className="text-purple-400 group-hover:text-purple-600 transition-colors">→</span>
                            </div>
                        )}
                    </div>

                    {/* Статус и дата */}
                    <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-xl bg-gray-50">
                            <p className="text-sm text-gray-500">Статус</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold mt-1 ${
                                member.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : member.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                            }`}>
                                {member.status === 'approved' ? '✅ Принят' :
                                    member.status === 'pending' ? '⏳ Ожидает' :
                                        '❌ Отклонен'}
                            </span>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-gray-50">
                            <p className="text-sm text-gray-500">Дата принятия</p>
                            <p className="font-medium text-gray-800 mt-1">
                                {formatDate(member.created_at)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Футер с кнопками */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 h-[44px] px-6 rounded-xl font-bold bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        Закрыть
                    </button>
                    {member.user_phone && (
                        <button
                            onClick={() => handlePhoneClick(member.user_phone!)}
                            className="h-[44px] px-6 rounded-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
                        >
                            Позвонить
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

// Для режима списка
const ListMemberItem: React.FC<{
    member: SectionMember;
    onClick: (member: SectionMember, event: React.MouseEvent) => void;
}> = ({ member, onClick }) => {
    return (
        <div
            onClick={(e) => onClick(member, e)}
            className="border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200 cursor-pointer active:scale-[0.99]"
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
                    <span className={`text-xs mt-1 inline-block px-2 py-1 rounded-full font-medium ${
                        member.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : member.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                    }`}>
                        {member.status === 'approved' ? '✅ Принят' :
                            member.status === 'pending' ? '⏳ Ожидает' :
                                '❌ Отклонен'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default function ClubMembersPage() {
    const { user } = useAuth();
    const { clubs: teacherClubs, loading: clubsLoading } = useTeacherClubs();
    const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
    const [selectedClubName, setSelectedClubName] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('table');
    const [selectedMember, setSelectedMember] = useState<SectionMember | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | undefined>();

    const selectedClub = teacherClubs.find(club => club.id === selectedClubId);
    const { members, loading: membersLoading, error } = useSectionMembers({
        clubId: selectedClubId || undefined
    });

    const totalPlaces = selectedClub?.total_places || 0;
    const takenPlaces = members.length;
    const freePlaces = Math.max(0, (totalPlaces || 0) - takenPlaces);
    const fillPercentage = totalPlaces > 0 ? Math.min((takenPlaces / totalPlaces) * 100, 100) : 0;

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

    const handleMemberClick = (member: SectionMember, event: React.MouseEvent) => {
        setSelectedMember(member);
        setIsModalOpen(true);
        setModalPosition({ x: event.clientX, y: event.clientY });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
        setModalPosition(undefined);
    };

    // Статус загрузки
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

    // Нет секций
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
                {/* Боковая панель */}
                <Profile />

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
                                        {selectedClubName} • Участников: {members.length}
                                    </h2>

                                    {/* Прогресс-бар занятости */}
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

                                {/* Переключатель вида */}
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

                            {/* Состояния загрузки и ошибки */}
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
                                        <ListMemberItem
                                            key={member.id}
                                            member={member}
                                            onClick={handleMemberClick}
                                        />
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

            {/* Модальное окно с информацией о пользователе */}
            <UserInfoModal
                member={selectedMember}
                isOpen={isModalOpen}
                onClose={closeModal}
                position={modalPosition}
            />
        </div>
    );
}