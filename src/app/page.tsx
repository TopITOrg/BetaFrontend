"use client"

import { Navbar } from "@/components/navbar"
import Image from "next/image";

export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50 bg-white">
                <Navbar selectedButton={0} />
            </div>

            <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 lg:mb-16">
                        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
                            <div className="text-center max-w-4xl mx-auto">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                                    Добро пожаловать в спортивное сообщество МАИ!
                                </h1>

                                <div className="space-y-6 text-gray-700 leading-relaxed">
                                    <p className="text-xl">
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
                                    <p className="text-lg font-semibold text-blue-600 mt-8">
                                        Успехов тебе, маёвец!
                                    </p>
                                </div>

                                <div className="mt-10 pt-6 border-t border-gray-200">
                                    <p className="text-gray-600 italic">
                                        С уважением, teapot team
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                        <div className="flex-1">
                            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                                    Начни свой путь к лучшей версии себя
                                </h2>

                                <div className="space-y-5 text-gray-700 leading-relaxed">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-3"></div>
                                        <p className="text-lg flex-1">
                                            Каждый день — это новый старт. Каждая тренировка — шаг к лучшей версии себя.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-3"></div>
                                        <p className="text-lg flex-1">
                                            Здесь мы не просто считаем повторения и километры. Мы строим характер,
                                            закаляем волю и раскрываем силу, которая живет внутри каждого из нас.
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-gray-100">
                                        <p className="text-lg font-medium text-blue-700 text-center">
                                            Выбери спорт по душе и присоединяйся к нашему сообществу!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/img.jpg"
                                    alt="Спортивная секция МАИ - студенты занимаются спортом"
                                    width={400}
                                    height={400}
                                    className="w-full h-auto object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-gray-600 text-sm italic">
                                    Спортивные секции МАИ ждут тебя
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}