"use client"

import {Search} from "lucide-react";
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import {CustomButton} from "@/components/CustomButton"
import {PostCard} from "@/components/PostCard"
import type {PostData} from "@/components/PostCard"
import { useState, useMemo, useEffect } from "react";

type Category = 'historical' | 'organizational' | 'achievements';
type PostWithCategory = PostData & {
    category: Category;
};

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('historical');
    const [searchQuery, setSearchQuery] = useState('');
    const [postsData, setPostsData] = useState<PostWithCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Функция для загрузки данных с JSON Server
    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:3001/posts');

            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }

            const data = await response.json();
            setPostsData(data);
        } catch (err) {
            setError('Не удалось загрузить данные');
            console.error('Ошибка загрузки:', err);
        } finally {
            setLoading(false);
        }
    };

    // Загружаем данные при монтировании компонента
    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = useMemo(() => {
        let filtered = postsData.filter(post => post.category === selectedCategory);

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.account.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [selectedCategory, searchQuery, postsData]);

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Состояние загрузки
    if (loading) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <Navbar selectedButton={0} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500">Загрузка...</div>
                </div>
            </main>
        );
    }

    // Состояние ошибки
    if (error) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <Navbar selectedButton={0} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-500 text-center">
                        <p>{error}</p>
                        <button
                            onClick={fetchPosts}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Попробовать снова
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <div className="flex flex-col sticky top-0 bg-white gap-2 mb-2">
                <Navbar selectedButton={0}></Navbar>
                <div className="h-[40px] relative px-20">
                    <Input
                        placeholder="Поиск"
                        className="rounded-xl h-full border-gray-500"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <Search className="size-[18px] text-gray-500 absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-23" />
                </div>
                <div className="w-full flex flex-row items-center gap-2 px-20">
                    <CustomButton
                        text="Исторические"
                        isSelected={selectedCategory === 'historical'}
                        onClick={() => handleCategoryClick('historical')}
                    />
                    <CustomButton
                        text="Организационные"
                        isSelected={selectedCategory === 'organizational'}
                        onClick={() => handleCategoryClick('organizational')}
                    />
                    <CustomButton
                        text="Достижения"
                        isSelected={selectedCategory === 'achievements'}
                        onClick={() => handleCategoryClick('achievements')}
                    />
                </div>
            </div>

            <div className="px-20 pt-[1px]">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {searchQuery ? 'По вашему запросу ничего не найдено' : 'В этой категории пока нет постов'}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {filteredPosts.map((post, index) => (
                            <PostCard key={index} postData={post} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}