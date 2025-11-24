'use client'
import {ChevronDown, CirclePlus} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {CustomButton} from "@/components/CustomButton";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useAuth} from "../../contexts/AuthContext";
import { useTeacherClubs } from '@/hooks/useTeacherClubs';


export function Profile() {
    const pathname = usePathname();
    const {user} = useAuth();
    const { clubs: teacherClubs, loading } = useTeacherClubs();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const isStudent = user?.role?.toLowerCase() === 'student';
    const isTeacher = user?.role?.toLowerCase() === 'teacher';
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const isTeacherOrAdmin = isTeacher || isAdmin;

    return (
        <div className="flex flex-col ml-[25px] w-[190px] gap-2">
            <Avatar className="h-[190px] w-[190px] mt-[65px]">
                <AvatarImage src="https://github.com/shadcn.png"/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {isTeacherOrAdmin && (
                <CustomButton
                    text="Участники"
                    isSelected={isActive("/участники")}
                    width="190px"
                />
            )}

            {/* Кнопка "Заявки" - для всех ролей */}
            <Link href="/applications">
                <CustomButton
                    text="Заявки"
                    isSelected={isActive("/applications")}
                    width="190px"
                />
            </Link>

            {/* Кнопка "Тренировка" - для всех ролей */}
            <Link href="/train_teacher">
                <CustomButton
                    text="Тренировка"
                    isSelected={isActive("/train_teacher")}
                    width="190px"
                />
            </Link>

            {isStudent && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                            hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                            transition-colors duration-400 ease-in-out h-[40px] w-[190px]">
                            <span>Мои секции</span>
                            <ChevronDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[190px]">
                        <DropdownMenuItem>Футбол</DropdownMenuItem>
                        <DropdownMenuItem className="text-[#0079DB]">Скалолазание</DropdownMenuItem>
                        <DropdownMenuItem>Баскетбол</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {isTeacherOrAdmin && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-xl font-bold border-2 bg-white text-blue-500 border-blue-500
                    hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                    transition-colors duration-400 ease-in-out h-[40px] w-[190px]">
                            <span>Управление секциями</span>
                            <ChevronDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[190px]">
                        {loading ? (
                            <DropdownMenuItem disabled>Загрузка...</DropdownMenuItem>
                        ) : teacherClubs.length === 0 ? (
                            <DropdownMenuItem disabled>Нет секций</DropdownMenuItem>
                        ) : (
                            teacherClubs.map((club) => (
                                <DropdownMenuItem key={club.id}>
                                    <Link href={`/edit-section/${club.id}`} className="w-full">
                                        {club.name}
                                    </Link>
                                </DropdownMenuItem>
                            ))
                        )}
                        <DropdownMenuItem>
                            <Link href="/create-section" className="w-full">
                                <div className="flex flex-row gap-1 items-center">
                                    <span>Добавить секцию</span>
                                    <CirclePlus/>
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}