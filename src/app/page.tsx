"use client"

import { Navbar } from "@/components/navbar"
import Image from "next/image";

export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50 bg-white">
                <Navbar selectedButton={0} />
            </div>

            <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-10 lg:mb-12">
                        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
                            <div className="text-center max-w-4xl mx-auto">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                                    Добро пожаловать в спортивное сообщество МАИ!
                                </h1>

                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p className="text-lg">
                                        <span className="font-semibold text-blue-600">Привет, маёвец!</span> Ты, конечно же, знаешь, что МАИ всегда поддерживал и развивал спорт. Мы решили продолжить эту традицию и создали сайт для спортивных секций.
                                    </p>
                                    <p className="text-lg">
                                        Его цель — сделать спорт ещё более доступным и удобным, упростив поиск секций и запись в них.
                                    </p>
                                    <p className="text-lg">
                                        Конечно, мы только начинаем работать над этим проектом и создаём такое впервые, так что не суди нас строго. Будем очень рады, если тебе поможет наш сайт.
                                    </p>
                                    <p className="text-lg font-semibold text-blue-600 mt-6">
                                        Успехов тебе, маёвец!
                                    </p>
                                </div>

                                <div className="mt-8 pt-4 border-t border-gray-100">
                                    <p className="text-gray-600 italic">
                                        С уважением, teapot team
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                        <div className="flex-1 w-full">
                            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">
                                    Начни свой путь к лучшей версии себя
                                </h2>

                                <div className="space-y-4 text-gray-700">
                                    <p className="text-lg">
                                        Каждый день — это новый старт. Каждая тренировка — шаг к лучшей версии себя.
                                    </p>
                                    <p className="text-lg">
                                        Здесь мы не просто считаем повторения и километры. Мы строим характер, закаляем волю и раскрываем силу, которая живет внутри каждого из нас.
                                    </p>

                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <p className="text-lg font-medium text-blue-700">
                                            Выбери спорт по душе и присоединяйся к нашему сообществу!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 w-full lg:w-auto">
                            <div className="relative w-full max-w-sm lg:max-w-md mx-auto rounded-xl overflow-hidden shadow-lg">
                                <Image
                                    src="/img.jpg"
                                    alt="Спортивная секция МАИ - студенты занимаются спортом"
                                    width={350}
                                    height={350}
                                    className="w-full h-auto object-cover"
                                    priority
                                />
                            </div>
                            <div className="mt-3 text-center">
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