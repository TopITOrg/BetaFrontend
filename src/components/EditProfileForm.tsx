// components/EditProfileForm.tsx
'use client'
import { Calendar, Mail, Phone, Send, User, Lock} from "lucide-react";
import { useState, useEffect } from "react";
import { CustomButton } from "./CustomButton";
import { Input } from "./ui/input";

export function EditProfileForm() {
    /* const { profile, isLoading, updateProfile, isUpdating, updateError } = useEditProfile(); */
    
    const [formData, setFormData] = useState({
        full_name: '',
        social_network_link: '',
        phone_number: '',
        email: '',
        birth_date: '',
        password: '',
    });

    // Заполняем форму данными профиля при загрузке
    /* useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                social_network_link: profile.social_network_link || '',
                phone_number: profile.phone_number || '',
                email: profile.email || '',
                birth_date: profile.birth_date ? profile.birth_date.split('T')[0] : '' // Форматируем дату для input[type="date"]
            });
        }
    }, [profile]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData);
    }; */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Данные для сохранения:', formData);
    }
    /* const handleCancel = () => {
        // Восстанавливаем исходные данные
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                social_network_link: profile.social_network_link || '',
                phone_number: profile.phone_number || '',
                email: profile.email || '',
                birth_date: profile.birth_date ? profile.birth_date.split('T')[0] : ''
            });
        }
    }; */

    /* if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                <div className="text-lg">Загрузка профиля...</div>
            </div>
        );
    }
 */
    return (
        <div className="flex flex-col items-center justify-center gap-5 w-full">
            <h1 className="text-black font-bold text-4xl">Редактирование профиля</h1>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-md">

                <div className="relative w-full">
                    <Input
                        name="full_name"
                        placeholder="ФИО"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        required
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>

                <div className="relative w-full">
                    <Input
                        name="social_network_link"
                        placeholder="Telegram аккаунт"
                        value={formData.social_network_link}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        required
                    />
                    <Send className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>

                <div className="relative w-full">
                    <Input
                        name="birth_date"
                        placeholder="Дата рождения"
                        value={formData.birth_date}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>

                <div className="relative w-full">
                    <Input
                        name="phone_number"
                        placeholder="Номер телефона"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        required
                    />
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>

                <div className="relative w-full">
                    <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        required
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>
                <div className="relative w-full">
                    <Input
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        className="rounded-xl p-2 w-full bg-gray-200 pr-10 border-2"
                        required
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
                </div>
                
                {/* {updateError && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg w-full">
                        Ошибка: {updateError.message}
                    </div>
                )} */}

                <div className="flex gap-3 w-full justify-center">
                    <CustomButton text="Сохранить"
                    isSelected={false} width={"200px"}/>
                    
                </div>
            </form>
        </div>
    );
}

function useEditProfile(): { profile: any; isLoading: any; updateProfile: any; isUpdating: any; updateError: any; } {
    throw new Error("Function not implemented.");
}
