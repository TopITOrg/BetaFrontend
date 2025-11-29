"use client"

import Link from "next/link";
import {Lock, Mail, User, Send, Phone, Home} from "lucide-react"
import { useRegister } from '@/hooks/useRegister';
import { useState } from 'react';

export default function Page() {
    const { mutate: register, isPending, error } = useRegister();

    const [formData, setFormData] = useState({
        full_name: '',
        social_network_link: '',
        phone_number: '',
        email: '',
        birth_date: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-blue-500">
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
                    <h1 className="text-black font-bold text-4xl">Регистрация</h1>

                    <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="relative w-full">
                            <input
                                name="full_name"
                                placeholder="ФИО"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 text-gray-900 placeholder-gray-500"
                                required
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {/* Telegram (Social Network Link) */}
                        <div className="relative w-full">
                            <input
                                name="social_network_link"
                                placeholder="Telegram аккаунт"
                                value={formData.social_network_link}
                                onChange={handleChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 text-gray-900 placeholder-gray-500"
                                required
                            />
                            <Send className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {/* Birth Date */}

                        <div className="relative w-full">
                            <input
                                name="birth_date"
                                type="date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                className="rounded-xl p-2 pr-3 w-full bg-gray-200 text-gray-900
                                [color-scheme:light]
                                [&::-webkit-datetime-edit]:text-gray-500
                                [&::-webkit-datetime-edit-fields-wrapper]:text-gray-500
                                [&::-webkit-calendar-picker-indicator]:opacity-50
                                [&::-webkit-calendar-picker-indicator]:scale-150
                                [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="relative w-full">
                            <input
                                name="phone_number"
                                placeholder="Номер телефона"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 text-gray-900 placeholder-gray-500"
                                required
                            />
                            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {/* Email */}
                        <div className="relative w-full">
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 text-gray-900 placeholder-gray-500"
                                required
                            />
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        {/* Password */}
                        <div className="relative w-full">
                            <input
                                name="password"
                                type="password"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={handleChange}
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10 text-gray-900 placeholder-gray-500"
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
                            {isPending ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>

                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div className="absolute w-1/2 inset-y-0 left-0 items-center justify-center flex">
                <div className="items-center justify-center flex flex-col gap-5 absolute">
                    <h1 className="text-white font-bold text-4xl">Добро пожаловать!</h1>
                    <h1 className="text-white font-bold text-xl">У меня уже есть аккаунт</h1>
                    <Link
                        href="/login"
                        className="text-white bg-blue-500 font-bold border-[2px] border-white text-xl rounded-xl p-2 px-8
                        hover:bg-blue-700 transition-colors duration-400 ease-in-out"
                    >
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
}
