"use client";

import { UserProfile } from "@/app/[locale]/profile/page";
import StreamChatInterface from "@/app/[locale]/components/chat/StreamChatInterface";

import { getUserMatches } from "@/lib/actions/matches";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "@/store/authStore";
import ChatHeader from "./ChatHeader";
interface ChatWindowProps {
    chatId: string | null;
}
export default function ChatWindow({ chatId }: ChatWindowProps) {

    const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();
    const userId = chatId;

    const chatInterfaceRef = useRef<{ handleVideoCall: () => void } | null>(null);

    useEffect(() => {
        async function loadUserData() {
            try {
                setLoading(true);
                const userMatches = await getUserMatches();
                const matchedUser = userMatches.find((match) => match.id === userId);

                if (matchedUser) {
                    console.log('vao day',chatId);
                    setOtherUser(matchedUser);
                } else {
                    console.log('vao day 2',chatId);
                    setOtherUser(null);
                }
                console.log(userMatches);
            } catch (error) {
                console.error(error);
                setOtherUser(null);
                console.log('vao day 3',chatId);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            loadUserData();
        }
    }, [userId, router, user,chatInterfaceRef]);

    if (loading) {
        return (
            <div className="hidden lg:flex w-full lg:ml-8 mt-8 lg:mt-0 items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <div className="text-center w-full h-full flex flex-col">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Loading your matches...
                    </p>
                </div>
            </div>
        );
    }

    if (!otherUser) {
        return (
            <div className="hidden lg:flex w-full lg:ml-8 mt-8 lg:mt-0 items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg
                        className="w-16 h-16 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        ></path>
                    </svg>
                    <p className="text-lg font-semibold">Chọn một cuộc trò chuyện để bắt đầu nhắn tin.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="lg:flex w-full lg:ml-8 lg:mt-0 items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="w-full lg:h-full h-[400px] overflow-hidden flex flex-col">
                <ChatHeader
                    user={otherUser}
                    onVideoCall={() => {
                        chatInterfaceRef.current?.handleVideoCall();
                    }}
                />

                <div className="flex-1 min-h-0 mt-6">
                    <StreamChatInterface otherUser={otherUser} ref={chatInterfaceRef} />
                </div>
            </div>
        </div>
    )


}


