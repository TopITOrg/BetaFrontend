"use client"

import Image from "next/image";
import Link from "next/link";
import { LogIn, CircleUserRound, LogOut, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { useActivePath } from "@/hooks/useActivePath";

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const selectedButton = useActivePath(); // Автоматическое определение активной страницы

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <nav className="px-20 gap-2 pt-2 flex flex-row items-center justify-between w-full h-[70px] relative border-b border-gray-200 bg-white">
            <div className="flex flex-row items-center gap-2">
                <Image
                    src="/Default.svg"
                    width={40}
                    height={40}
                    alt="logo"
                    className="text-blue-500 size-[8vh]"
                />
                <div className="font-semibold">
                    <h1>Спортивные</h1>
                    <h1>секции</h1>
                </div>
            </div>

            <div className="gap-2 flex flex-row items-center absolute left-1/2 -translate-x-1/2">
                <Link href="/">
                    <div className={`
                        px-6 py-3 rounded-lg transition-all duration-300 font-medium
                        ${selectedButton === 0
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                    }
                    `}>
                        Главная
                    </div>
                </Link>
                <Link href="/news">
                    <div className={`
                        px-6 py-3 rounded-lg transition-all duration-300 font-medium
                        ${selectedButton === 1
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                    }
                    `}>
                        Новости
                    </div>
                </Link>
                <Link href="/clubs">
                    <div className={`
                        px-6 py-3 rounded-lg transition-all duration-300 font-medium
                        ${selectedButton === 2
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                    }
                    `}>
                        Спортивные секции
                    </div>
                </Link>
            </div>

            {isAuthenticated ? (
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex flex-row items-center gap-2
                                  px-4 py-2 rounded-lg
                                  text-gray-600 hover:text-blue-500 hover:bg-blue-50
                                  transition-all duration-300 ease-in-out font-medium"
                    >
                        <h1>{user?.full_name.split(' ')[0]}</h1>
                        <CircleUserRound size={20} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="p-3 border-b border-gray-100">
                                <p className="font-semibold text-gray-800">{user?.full_name}</p>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>

                            <Link href="/edit">
                                <button
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="w-full flex items-center gap-2 p-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                                >
                                    <User size={16} />
                                    <span>Мой профиль</span>
                                </button>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 p-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                                <LogOut size={16} />
                                <span>Выйти</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link
                    href="/login"
                    className="flex flex-row items-center gap-2
                              px-4 py-2 rounded-lg
                              text-gray-600 hover:text-blue-500 hover:bg-blue-50
                              transition-all duration-300 ease-in-out font-medium"
                >
                    <h1>Войти</h1>
                    <LogIn size={20} />
                </Link>
            )}
        </nav>
    );
}

export { Navbar };