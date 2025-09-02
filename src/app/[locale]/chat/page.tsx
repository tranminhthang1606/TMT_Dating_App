"use client";

import { getUserMatches } from "@/lib/actions/matches";
import { useEffect, useState } from "react";
import { UserProfile } from "../profile/page";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Video, 
  Phone, 
  Crown,
  CheckCircle,
  Sparkles,
  Heart,
  Users
} from "lucide-react";
import ChatWindow from "../components/chat/ChatWindow";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";

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
      <div className="h-[calc(100vh-64px)] mt-24 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <MessageCircle className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('settingUp')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{t('settingUp')}</p>
        </motion.div>
      </div>
    );
  }

  function changeConversation(id: string) {
    router.replace(`/${locale}/chat?id=${id}`)
  }

  return (
    <div className="h-[calc(100vh-64px)] mt-24 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 h-[calc(90vh-64px)] flex flex-col lg:flex-row">
        {/* Left Column: Chat List */}
        <div className={`w-full lg:w-1/3 max-w-2xl mx-auto lg:mx-0 lg:h-full lg:flex lg:flex-col ${id ? 'hidden lg:block' : ''}`}>
          {/* Header */}
          <motion.header 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('conversationsCount', {count: chats.length})}
                </p>
              </div>
            </div>
          </motion.header>

          {/* Chat List Content */}
          {chats.length === 0 ? (
            <motion.div 
              className="text-center max-w-md mx-auto p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('noConversationsTitle')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('noConversationsDesc')}
              </p>
              <Link
                href="/matches"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 px-6 rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Heart className="w-5 h-5" />
                <span>{t('startSwiping')}</span>
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence>
                {chats.map((chat, key) => (
                  <motion.div
                    key={key}
                    onClick={() => changeConversation(chat.id)}
                    className={`chat-item block w-full hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer ${
                      id === chat.id ? 'bg-pink-50 dark:bg-pink-900/20' : ''
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: key * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center p-6 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0">
                      {/* Avatar */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white dark:border-gray-700 shadow-lg">
                        <Image
                          src={chat.user.avatar_url || "/default-avatar.png"}
                          alt={chat.user.full_name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                        {chat.user.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 animate-pulse"></div>
                        )}
                        {chat.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0 ml-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {chat.user.full_name}
                            </h3>
                            {chat.user.is_verified && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">@{chat.user.username}</span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-gray-500 hover:text-pink-500 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/20 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle video call
                          }}
                        >
                          <Video className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-500 hover:text-pink-500 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/20 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle phone call
                          }}
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
        
        {/* Right Column: Chat Window */}
        <ChatWindow chatId={id} />
      </div>
    </div>
  );
}
