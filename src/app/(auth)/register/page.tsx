import Link from "next/link";
import {Lock, Mail, User, Send, Phone, Calendar} from "lucide-react"
export default function Home() {
    return (
        <div className="min-h-screen bg-blue-500">

            <div className="bg-white absolute w-1/2 inset-y-0 right-0 rounded-l-[80px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-5 absolute w-1/2">

                    <h1 className="text-black font-bold text-4xl">Регистрация</h1>
                    <form className="flex flex-col items-center gap-4 w-full">


                        <div className="relative w-full">
                            <input
                                placeholder="ФИО"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10" /* Добавлен отступ справа */
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        <div className="relative w-full">
                            <input
                                type="email"
                                placeholder="Telegram аккаунт"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10" /* Добавлен отступ справа */
                            />
                            <Send className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        <div className="relative w-full">
                            <input
                                placeholder="Дата рождения"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10" /* Добавлен отступ справа */
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        <div className="relative w-full">
                            <input
                                placeholder="Номер телефона"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10" /* Добавлен отступ справа */
                            />
                            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        <div className="relative w-full">
                            <input
                                type="email"
                                placeholder="Email"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10" /* Добавлен отступ справа */
                            />
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>


                        <div className="relative w-full">
                            <input
                                type="password"
                                placeholder="Пароль"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10" /* Добавлен отступ справа */
                            />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>

                        <label className="text-blue-500 hover:text-blue-800 transition-colors duration-400 ease-in-out">Забыли пароль?</label>
                        <button
                            type="submit"
                            className="text-white bg-blue-500 font-bold text-xl rounded-xl p-2 px-8
              hover:bg-blue-700 w-full transition-colors duration-400 ease-in-out"
                        >
                            Зарегистрироваться
                        </button>

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
              hover:bg-blue-700   transition-colors duration-400 ease-in-out"
                    >
                        Войти
                    </Link>

                </div>


            </div>

        </div>
    );
}