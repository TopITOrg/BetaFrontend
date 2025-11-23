"use client"
import Link from "next/link";
import {Lock, Mail, User, Send, Phone, Calendar, Home} from "lucide-react"
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"


export function RegForm() {
    const queryClient = useQueryClient();

    const formSchema = z.object({
    name: z.string().min(6).regex(/^[А-я]+$/),
    telegram: z.string()
        .min(5)
        .regex(/^@[a-zA-Z0-9_]+$/),
    birth: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/, "Дата должна быть в формате дд.мм.гггг"),
    email: z.string().min(6),
    password: z.string().min(8).max(20)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            telegram: "",
            birth: "",
            email: "",
            password: ""
        }
    })

    async function onSubmit(formValues: z.infer<typeof formSchema>) {
        console.log(formValues)
        await mutateAsync(formValues)
    }

    const { mutateAsync } = useMutation({
    mutationKey: ["user", "register"],
    mutationFn: async (user: {
        name: string;
        telegram: string;
        birth: string;
        email: string;
        password: string;
    }): Promise<void> => {
        await axios.post("http://localhost:3005/users", user);
    },
    onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries({
            queryKey: ["users"]
        });
        console.log("Success")
        form.reset()
    }
    });
    return (
        <form className="flex flex-col items-center gap-4 w-full"
                        id="register_user" onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="relative w-full">
                            <Input
                            {...field}
                            id="user_fullname"
                            aria-invalid={fieldState.invalid}
                            placeholder="ФИО"
                            autoComplete="off"
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Controller
                name="telegram"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="relative w-full">
                            <Input
                            {...field}
                            id="user_telegram"
                            aria-invalid={fieldState.invalid}
                            placeholder="Telegram аккаунт"
                            autoComplete="off"
                            />
                            <Send className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Controller
                name="birth"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="relative w-full">
                            <Input
                            {...field}
                            id="user_date_of_birth"
                            aria-invalid={fieldState.invalid}
                            placeholder="Дата рождения"
                            autoComplete="off"
                            />
                            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="relative w-full">
                            <Input
                            {...field}
                            type="email"
                            id="user_email"
                            aria-invalid={fieldState.invalid}
                            placeholder="Email"
                            autoComplete="off"
                            />
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="relative w-full">
                            <Input
                            {...field}
                            type="password"
                            id="user_password"
                            aria-invalid={fieldState.invalid}
                            placeholder="Пароль"
                            autoComplete="off"
                            />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <button
                type="submit"
                className="text-white bg-blue-500 font-bold text-xl rounded-xl p-2 px-8
                hover:bg-blue-700 w-full transition-colors duration-400 ease-in-out"
            >
                Зарегистрироваться
            </button>
        </form>
    )
}

export default function Page() {
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
                    <RegForm/>
                    {/* <form className="flex flex-col items-center gap-4 w-full"
                        id="create-todo-form" onSubmit={form.handleSubmit(onSubmit)}>
    
                        <div className="relative w-full">
                            <input
                                placeholder="ФИО"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10" 
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        <div className="relative w-full">
                            <input
                                type="email"
                                placeholder="Telegram аккаунт"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10"
                            />
                            <Send className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        <div className="relative w-full">
                            <input
                                placeholder="Дата рождения"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10" 
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        <div className="relative w-full">
                            <input
                                placeholder="Номер телефона"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10"
                            />
                            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>
                        <div className="relative w-full">
                            <input
                                type="email"
                                placeholder="Email"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10" 
                            />
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                        </div>


                        <div className="relative w-full">
                            <input
                                type="password"
                                placeholder="Пароль"
                                className="rounded-xl p-2 w-full bg-gray-200 pr-10" 
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
 */}
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