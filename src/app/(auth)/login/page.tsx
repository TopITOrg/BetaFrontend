'use client'; // ← ДОБАВЬТЕ ЭТУ СТРОКУ В САМОМ НАЧАЛЕ ФАЙЛА

import { Lock, Mail, Home } from "lucide-react";
import Link from "next/link";
import { useLogin } from 'src/hooks/useLogin'; // Проверьте путь
import { useState } from 'react';

export default function LoginPage() {
    const { mutate: login, isPending, error } = useLogin();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-blue-500">

            {/* Кнопка возврата на главную - в левом верхнем углу */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white bg-blue-500 rounded-xl p-2 px-4
                hover:bg-blue-600 transition-colors duration-400 ease-in-out border-white border-2"
            >
                <Home size={20} />
                <span>На главную</span>
            </Link>

            <div className="bg-white absolute w-1/2 inset-y-0 right-0 rounded-l-[80px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-5 absolute w-1/2">

                    <h1 className="text-black font-bold text-4xl">Вход</h1>
                    <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleSubmit}>

                        <div className="relative w-full">
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10"
                                required
                            />
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        <div className="relative w-full">
                            <input
                                name="password"
                                type="password"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={handleChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10"
                                required
                            />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        <label className="text-blue-500 hover:text-blue-800 transition-colors duration-400 ease-in-out">
                            Забыли пароль?
                        </label>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="text-white bg-blue-500 font-bold text-xl rounded-xl p-2 px-8
                            hover:bg-blue-700 w-full transition-colors duration-400 ease-in-out
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Вход...' : 'Войти'}
                        </button>

                        {/* Отображение ошибок */}
                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error.message?.includes('Email or password')
                                    ? 'Email или пароль неверны'
                                    : error.message || 'Произошла ошибка'}
                            </div>
                        )}

                    </form>

                </div>
            </div>

            <div className="absolute w-1/2 inset-y-0 left-0 items-center justify-center flex">
                <div className="items-center justify-center flex flex-col gap-5 absolute">

                    <h1 className="text-white font-bold text-4xl">Привет!</h1>
                    <h1 className="text-white font-bold text-xl">У меня ещё нет аккаунта</h1>
                    <Link
                        href="/register"
                        className="text-white bg-blue-500 font-bold border-[2px] border-white text-xl rounded-xl p-2 px-8
                        hover:bg-blue-700 w-full text-center transition-colors duration-400 ease-in-out"
                    >
                        Зарегистрироваться
                    </Link>

                </div>
            </div>

        </div>
    );
}