import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/navbar'

export default function Homepage() {
    return (
        <main>
            <div className='flex flex-col sticky top-0 bg-white z-70'>
                <Navbar/>
            </div>
            <div className='flex justify-center pt-[40px] px-[25px] '>
                <Card className='w-full h-full mb-[50px] shadow-md px-[20px]'>
                    <div className='flex flex-row items-center gap-3'>
                        <Avatar>
  							<AvatarImage src="https://github.com/shadcn.png" />
  							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
                        <span className='font-medium text-xl'>Фёдорова Екатерина</span>
                    </div>
                    <Separator className=''/>
                    <CardHeader>
                        <CardTitle className='text-xl font-bold'>Результаты наших сборных по хоккею и баскетболу</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>МАИ-МБА — ВШЭ</p>
                        <p>81:57</p>
                        <p>Это была первая игра в сезоне и мы ворвались туда с двух ног!</p>
                        <p className='mt-[20px]'>ХК МАИ "Авиаторы" — РУДН</p>
                        <p>5:4</p>
                        <p>Пару слов от менеджера нашей хоккейной команды:</p>
                        < blockquote className='mt-[20px]'>
                            ""Игра была невероятно сложная, не просто так команда РУДН является финалистом прошлого сезона. 
                            Это крайне важная для нас победа особенно с психологической точки зрения. Парни показали настоящий характер 
                            и самоотверженность, отыграться со счета 0-3 очень дорогого стоит. Мы не расслабляемся и не надеваем розовые очки, 
                            сезон только начинается, впереди много матчей ,и каждый из них будет не легче чем этот.""
                        </blockquote>
                        <p className='mt-[20px]'>Дорогие болельщики, спасибо Вам за веру и поддержку!</p>
                        <p>Ждем вас на трибунах.</p>
                        <p>Поддержим наших ребят реакциями и пожелаем дальнейших побед 🤩</p>
                        <ScrollArea className='w-full'>
                            <div className='flex gap-10 pb-4 justify-center mt-4 min-w-max'>
                                <Image src='/image 3.png' alt='image 3' width={390} height={260}/>
                                <Image src='/image 4.png' alt='image 4' width={347} height={260}/>
                                <Image src='/image 5.png' alt='image 5' width={462} height={260}/>
                                <Image src='/image 4.png' alt='image 4' width={347} height={260}/>
                            </div>
                            <ScrollBar orientation='horizontal'/>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className='flex justify-end'>
                        <p>20 ноября 2025 18:57</p>
                    </CardFooter>
                </Card>
            </div>
        </main>
    )
}