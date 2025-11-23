import Image from "next/image";
import Link from "next/link";
import { LogIn, CircleUserRound, LogOut } from "lucide-react";
import { CustomButton } from "./CustomButton";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

interface NavbarProps {
    selectedButton?: number;
}

function Navbar({ selectedButton = 0 }: NavbarProps) {
    const { isAuthenticated, user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <nav className="px-2 gap-2 pt-2 flex flex-row items-center justify-between w-full h-[70px] relative">
            <div className="flex flex-row items-center gap-2">
                <Image
                    src="/Default.svg"
                    width={40}
                    height={40}
                    alt="logo"
                    className="text-blue-500 size-[8vh]"
                />
                <div className="">
                    <h1>Спортивные</h1>
                    <h1>секции</h1>
                </div>
            </div>

            <div className="gap-2 flex flex-row items-center absolute left-1/2 -translate-x-1/2">
                <Link href="/">
                    <CustomButton
                        text="Новости"
                        isSelected={selectedButton === 0}
                    />
                </Link>
                <Link href="/clubs">
                    <CustomButton
                        text="Спортивные клубы"
                        isSelected={selectedButton === 1}
                    />
                </Link>
            </div>

            {isAuthenticated ? (
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex flex-row items-center gap-2
                                  rounded-[200px] hover:text-blue-500
                                  transition-colors duration-400 ease-in-out"
                    >
                        <h1>{user?.full_name.split(' ')[0]}</h1>
                        <CircleUserRound />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="p-3 border-b border-gray-100">
                                <p className="font-semibold text-gray-800">{user?.full_name}</p>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 p-3 text-red-600 hover:bg-gray-50 transition-colors duration-200"
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
                              rounded-[200px] hover:text-blue-500
                              transition-colors duration-400 ease-in-out"
                >
                    <h1>Войти</h1>
                    <LogIn />
                </Link>
            )}
        </nav>
    );
}

export { Navbar };