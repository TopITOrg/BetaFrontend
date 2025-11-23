"use client"
import { ChevronDown, CirclePlus, PencilLine, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomButton } from "@/components/CustomButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Profile() {
    const pathname = usePathname();
        const isActive = (path: string) => {
        return pathname === path;
    };
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        console.log('Профиль удален');
        setIsDeleteDialogOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
    };

    return (
        <div className="flex flex-col ml-[25px] w-[190px] gap-2">
            <Avatar className="h-[190px] w-[190px] mt-[65px]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
                <Link href='/edit'>
                    <div className='flex flex-row gap-1 pt-2 text-gray-500 justify-center hover:text-blue-500 transition-colors duration-400 ease-in-out'>
                        <span>Редактировать</span>
                        <PencilLine/>
                    </div>
                </Link>
                <button 
                    onClick={handleDeleteClick}
                    className='flex flex-row gap-1 text-red-500 mb-2 pt-2 text-gray-500 justify-center'>
                    <span>Удалить</span>
                    <Trash2/>
                </button>
            </div>
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-lg font-bold">Удаление профиля</h3>
                        </div>
                        
                        <p className="mb-6 text-gray-600">
                            Вы уверены, что хотите удалить профиль?
                        </p>
                        
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={handleCancelDelete}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Отмена
                            </button>
                            <button 
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
            <CustomButton 
                text="Участники" 
                isSelected={isActive("/участники")}
                width="190px"
            />
            
            <Link href="/applications">
                <CustomButton 
                    text="Заявки" 
                    isSelected={isActive("/applications")}
                    width="190px"
                />
            </Link>

            <Link href="/train_teacher">
                <CustomButton 
                    text="Тренировка" 
                    isSelected={isActive("/train_teacher")}
                    width="190px"
                />
            </Link>
            
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
                    <DropdownMenuItem>
                        <Link href="/create_section">
                            <div className="flex flex-row gap-1 items-center">
                                <span>Добавить секцию</span>
                                <CirclePlus/>
                            </div>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )     
}