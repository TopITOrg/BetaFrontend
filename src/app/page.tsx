"use client"

import { Navbar } from "@/components/navbar"
import Image from "next/image";

export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen">
            {/* Закрепленный navbar */}
            <div className="sticky top-0 z-50 bg-white">
                <Navbar selectedButton={0} />
            </div>

            {/* Основной контент */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-6xl w-full">
                    {/* Верхняя секция с изображением и текстом */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
                        {/* Изображение */}
                        <div className="flex-shrink-0">
                            <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/img.jpg"
                                    alt="Спортивная секция МАИ"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Текст справа */}
                        <div className="flex-1 text-left">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                                    Начни свой путь к лучшей версии себя
                                </h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p className="text-lg">
                                        Каждый день — это новый старт. Каждая тренировка — шаг к лучшей версии себя.
                                    </p>
                                    <p className="text-lg">
                                        Здесь мы не просто считаем повторения и километры. Мы строим характер,
                                        закаляем волю и раскрываем силу, которая живет внутри каждого из нас.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Нижняя информационная секция */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-100">
                        <div className="text-center space-y-6">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                Добро пожаловать в спортивное сообщество МАИ!
                            </h1>

                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p className="text-lg">
                                    <span className="font-semibold text-blue-600">Привет, маёвец!</span>
                                </p>
                                <p className="text-lg">
                                    Ты, конечно же, знаешь, что МАИ всегда поддерживал и развивал спорт.
                                    Мы решили продолжить эту традицию и создали сайт для спортивных секций.
                                </p>
                                <p className="text-lg">
                                    Его цель — сделать спорт ещё более доступным и удобным, упростив поиск
                                    секций и запись в них.
                                </p>
                                <p className="text-lg">
                                    Конечно, мы только начинаем работать над этим проектом и создаём такое
                                    впервые, так что не суди нас строго. Будем очень рады, если тебе
                                    поможет наш сайт.
                                </p>
                                <p className="text-lg font-semibold text-blue-600">
                                    Успехов тебе, маёвец!
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-gray-600 italic">
                                    С уважением, teapot team
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}