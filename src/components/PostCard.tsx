import {CircleUserRound} from "lucide-react";

interface PostData {
    date: string;
    title: string;
    description: string;
    account: string;
}

function PostCard({postData}:{postData:PostData}) {
    return (
        <div className="flex flex-col border-1 border-gray-300 rounded-2xl overflow-hidden
      hover:shadow-md hover:shadow-blue-400 transition-all duration-200 ease-in-out">
            <div className="w-full bg-blue-500 h-3"></div>

            <div className="flex flex-col gap-3 p-2 py-5">
                <h2 className="text-gray-500">{postData.date}</h2>
                <h1 className="text-xl">{postData.title}</h1>
                <p className="text-gray-500">
                    {postData.description}
                </p>

                <div className="flex flex-row items-center justify-left gap-3">
                    <CircleUserRound className="size-[5vh] text-blue-500" />
                    <span>{postData.account}</span>
                </div>
            </div>
        </div>
    );
}

export {PostCard};
export type { PostData };