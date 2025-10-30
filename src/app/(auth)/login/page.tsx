import {Lock, Mail} from "lucide-react"
import Link from "next/link";
export default function Home() {
    return (
        <div className="min-h-screen bg-blue-500">

            <div className="bg-white absolute w-1/2 inset-y-0 right-0 rounded-l-[80px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-5 absolute w-1/2">

                    <h1 className="text-black font-bold text-4xl">Вход</h1>
                    <form className="flex flex-col items-center gap-4 w-full">


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
                            Войти
                        </button>

                    </form>

                </div>

            </div>

            <div className="absolute w-1/2 inset-y-0 left-0 items-center justify-center flex">

                <div className="items-center justify-center flex flex-col gap-5 absolute">

                    <h1 className="text-white font-bold text-4xl">Привет!</h1>
                    <h1 className="text-white font-bold text-xl">У меня ещё нет аккаунта</h1>
                    <Link
                        href = "/register"
                        className="text-white bg-blue-500 font-bold border-[2px] border-white text-xl rounded-xl p-2 px-8
              hover:bg-blue-700 w-full  transition-colors duration-400 ease-in-out"
                    >
                        Зерегистрироваться
                    </Link>

                </div>


            </div>

        </div>
    );
}