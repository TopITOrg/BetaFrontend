'use client'
import { EditProfileForm } from "@/components/EditProfileForm";
import { Navbar } from "@/components/navbar";
import { Profile } from "@/components/Profile";

export default function EditProfilePage() {
    return (
        <main>
            <div className='flex flex-col sticky top-0 bg-white z-70'>
                <Navbar></Navbar>
            </div>
            <div className="flex flex-rows">
                <div className="w-1/3"><Profile/></div>
                <div className="flex flex-col justify-center p-8">
                    <EditProfileForm/>
                </div>
            </div>
        </main>
    );
}