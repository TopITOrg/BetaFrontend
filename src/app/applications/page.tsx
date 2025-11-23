'use client';
import { Application } from "@/components/Application";
import { Navbar } from "@/components/navbar";
import { Profile } from "@/components/Profile";

export default function Homepage() {
    return(
        <main>
            <div className='flex flex-col sticky top-0 bg-white z-70'>
                <Navbar></Navbar>
            </div>
            <div className='flex flex-row items-start'>
                <div>
                    <Profile></Profile>
                </div>
                <div className="flex flex-1 flex-col items-center mt-[65px]">
                    <span className="text-4xl mb-[35px]">Заявки</span>
                    <div className="w-full flex justify-center">
                        <div className="grid grid-cols-3 gap-[40px] justify-items-center max-w-6xl">
                            <Application/>
                            <Application/>
                            <Application/>
                            <Application/>
                            <Application/>
                            <Application/>
                            <Application/>
                            <Application/>
                            <Application/>
                        </div>
                    </div>
                </div>
            </div>
        
        </main>
    )
}

