"use client"

import { Navbar } from "@/components/navbar"

export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar/>
            <div className="flex items-center justify-center h-[calc(100vh-70px)] gap-8 flex-col px-20 text-center">
                <div className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                    Спорт без границ
                </div>

                <div className="text-xl lg:text-2xl text-gray-700 max-w-4xl leading-relaxed font-medium">
                    Забудьте о бесконечных очередях и бумажных заявлениях! Наш сервис превращает
                    сложный процесс записи в спортивные секции в несколько кликов.
                    <span className="block mt-4 text-blue-600 font-semibold">
                        Ваша идеальная тренировка начинается здесь и сейчас
                    </span>
                </div>

                <div className="text-lg text-gray-600 max-w-3xl mt-4">
                    Просто выбери секцию, нажми кнопку — и готово! Вся информация о расписании,
                    тренерах и доступных местах всегда под рукой.
                </div>
            </div>
        </main>
    );
}