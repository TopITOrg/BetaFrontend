'use client';
import { CustomButton } from "@/components/CustomButton";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Profile } from "@/components/Profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, CirclePlus, PencilLine } from "lucide-react";
import { useState } from 'react';
import { Field, FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function Homepage() {
    const queryClient = useQueryClient();
    const formSchema = z.object({
        name: z.string().min(6),
        place: z.string()
            .min(8),
        min_train: z.string().regex(/^[1-7]$/),
        level: z.string(),
        amount_places: z.string().regex(/^[1-9]+[0-9]*$/),
        description: z.string(),
        })

    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                name: "",
                place: "",
                min_train: "",
                level: "",
                amount_places: "",
                description: "",
            }
        })


    async function onSubmit(formValues: z.infer<typeof formSchema>) {
        console.log(formValues)
        await mutateAsync(formValues)
    }

    const { mutateAsync } = useMutation({
    mutationKey: ["section", "create"],
    mutationFn: async (section: {
        name: string;
        place: string;
        min_train: string;
        level: string;
        amount_places: string;
        description: string;
    }): Promise<void> => {
        await axios.post("http://localhost:3002/sections", section);
    },
    onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries({
            queryKey: ["sections"]
        });
        console.log("Success")
        form.reset()
    }
    });
    return(
        <main className="overflow-hidden">
            <div className='flex flex-col sticky top-0 bg-white z-70'>
                <Navbar></Navbar>
            </div>
            <form id="register_user" onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-row gap-[45px] min-w-screen h-wull'>
                <Profile></Profile>
                <div className="mt-[65px] flex flex-col w-5/12">
                    <span className="text-4xl">Создание секции</span>
                    <div className="flex flex-col gap-5">
                        <span className="text-3xl mb-5 mt-[50px]">Краткая информация о секции</span>
                        <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="relative w-full rounded-xl w-full bg-gray-200">
                                    <Input
                                    {...field}
                                    id="section_name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Название"
                                    autoComplete="off"
                                    />
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                        />
                        <Controller
                        name="place"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="relative w-full rounded-xl w-full bg-gray-200">
                                    <Input
                                    {...field}
                                    id="section_place"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Место проведения"
                                    autoComplete="off"
                                    />
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                        />
                        <Controller
                        name="min_train"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="relative w-full rounded-xl w-full bg-gray-200">
                                    <Input
                                    {...field}
                                    id="section_min_train"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Минимальное количесво тренировок в неделю"
                                    autoComplete="off"
                                    />
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                        />
                        <Controller
                        name="level"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="relative w-full rounded-xl w-full bg-gray-200">
                                    <Input
                                    {...field}
                                    id="section_level"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Уровень обучения"
                                    autoComplete="off"
                                    />
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                        />
                        <Controller
                        name="amount_places"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="relative w-full rounded-xl w-full bg-gray-200">
                                    <Input
                                    {...field}
                                    id="section_amount_places"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Количество мест"
                                    autoComplete="off"
                                    />
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 mr-[25px] w-7/12">
                <span className="text-3xl mb-5 mt-[155px]">Описание</span>
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <div className="relative w-full rounded-xl w-full bg-gray-200 h-[260px]">
                                <Textarea
                                className="h-full"
                                {...field}
                                id="section_description"
                                aria-invalid={fieldState.invalid}
                                placeholder="Описание"
                                autoComplete="off"
                                />
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                </div>
            </div>
            <div className="flex justify-center w-[250px] mt-5 min-w-screen">
                <Button
                type="submit"
                variant="outline" className="rounded-xl border-2 font-bold bg-white text-blue-500 border-blue-500
                    hover:text-blue-500 hover:border-blue-500 hover:bg-gray-100
                    transition-colors duration-400 ease-in-out h-[40px] "
                >
                    Создать секцию
                </Button>   
            </div>
            </form>
        </main>
    )
}
