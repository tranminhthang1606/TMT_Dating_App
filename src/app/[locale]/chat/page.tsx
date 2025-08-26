"use client";

import { getUserMatches } from "@/lib/actions/matches";
import { useEffect, useState } from "react";
import { UserProfile } from "../profile/page";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import ChatWindow from "../components/chat/ChatWindow";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";


interface ChatData {
  id: string;
  user: UserProfile;
  lastMessage?: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function ChatPage() {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Chat');
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  useEffect(() => {
    async function loadMatches() {
      try {
        const userMatches = await getUserMatches();
        console.log(userMatches, 'yusdfds', id)

        const chatData: ChatData[] = userMatches.map((match) => ({
          id: match.id,
          user: match,
          lastMessage: "Bắt đầu cuộc trò chuyện của bạn!",
          lastMessageTime: match.created_at,
          unreadCount: 0,
        }));
        setChats(chatData);
        console.log(userMatches, chatData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Animate the chat list items when they appear
      gsap.fromTo(
        ".chat-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [chats]);

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Vừa xong";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString();
    }
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] mt-24 bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loadingMatches')}</p>
        </div>
      </div>
    );
  }

  function changeConversation(id: string) {
    router.replace(`/${locale}/chat?id=${id}`)
  }

  return (
    <div className="h-[calc(100vh-64px)] mt-24 bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 h-[calc(90vh-64px)] flex flex-col lg:flex-row">
        {/* Left Column: Chat List */}
       <div className={`w-full lg:w-1/3 max-w-2xl mx-auto lg:mx-0 lg:h-full lg:flex lg:flex-col ${id ? 'hidden lg:block' : ''}`}>
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('title')}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('conversationsCount', {count: chats.length})}
            </p>
          </header>

          {chats.length === 0 ? (
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💬</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('noConversationsTitle')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('noConversationsDesc')}
              </p>
              <Link
                href="/matches"
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
              >
                {t('startSwiping')}
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {chats.map((chat, key) => (
                <button
                  key={key}
                  onClick={() => changeConversation(chat.id)}
                  className="chat-item block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={chat.user.avatar_url}
                        alt={chat.user.full_name}
                        className="w-full h-full object-cover"
                      />
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {chat.user.full_name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        

        <ChatWindow chatId={id} />
      </div>
    </div>
  );
}
