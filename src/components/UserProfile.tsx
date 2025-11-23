'use client';

import { CircleUserRound, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export const UserProfile = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-white hover:bg-blue-600 rounded-lg p-2 transition-colors duration-200"
            >
                <CircleUserRound size={24} />
                <span className="hidden sm:block">{user?.full_name.split(' ')[0]}</span>
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
    );
};