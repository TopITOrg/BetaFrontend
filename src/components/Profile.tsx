'use client'
import {ChevronDown, CirclePlus, PencilLine, Trash2} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {CustomButton} from "@/components/CustomButton";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useState} from "react";
import {useAuth} from "../../contexts/AuthContext";

export function Profile() {
    const pathname = usePathname();
    const {user, logout} = useAuth();
    const router = useRouter();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
        setError('');
        setPassword('');
    };

    const handleConfirmDelete = async () => {
        if (!password) {
            setError('Введите пароль для подтверждения');
            return;
        }

        if (!user || !user.id) {
            setError('Ошибка: пользователь не найден');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('Токен не найден. Пожалуйста, войдите снова.');
                setIsLoading(false);
                return;
            }

            console.log('Token:', token);
            console.log('User ID:', user.id);

            const response = await fetch('http://localhost:8080/users/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: user?.id,
                    password: password,
                }),
            });

            if (response.ok) {
                console.log('Профиль успешно удален');
                logout();
                router.push('/');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Ошибка при удалении профиля');
            }
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            setError('Произошла ошибка при удалении профиля');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setPassword('');
        setError('');
    };

    return (
        <div className="flex flex-col ml-[25px] w-[190px] gap-2">
            <Avatar className="h-[190px] w-[190px] mt-[65px]">
                <AvatarImage src="https://github.com/shadcn.png"/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
                <Link href='/edit'>
                    <div
                        className='flex flex-row gap-1 pt-2 text-gray-500 justify-center hover:text-blue-500 transition-colors duration-400 ease-in-out'>
                        <span>Редактировать</span>
                        <PencilLine/>
                    </div>
                </Link>
                <button
                    onClick={handleDeleteClick}
                    className='flex flex-row gap-1 text-red-500 mb-2 pt-2 text-gray-500 justify-center hover:text-red-600 transition-colors duration-400 ease-in-out'>
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

                        <p className="mb-4 text-gray-600">
                            Вы уверены, что хотите удалить профиль? Это действие нельзя отменить.
                        </p>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Для подтверждения введите пароль:
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Введите ваш пароль"
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isLoading}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Удаление...</span>
                                    </>
                                ) : (
                                    'Удалить'
                                )}
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