import { UserProfile } from "@/app/[locale]/profile/page";
import {
    createOrGetChannel,
    createVideoCall,
    getStreamUserToken,
} from "@/lib/actions/stream";
import { useRouter } from "next/navigation";
import React, {
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    forwardRef,
} from "react";
import { useTranslations } from "next-intl";
import { Channel, Event, StreamChat } from "stream-chat";
import { text } from "stream/consumers";
import VideoCall from "./VideoCall";

interface AttachmentItem {
    type: "image" | "video" | string;
    image_url?: string;
    asset_url?: string;
    mime_type?: string;
    title?: string;
}

interface Message {
    id: string;
    text: string;
    sender: "me" | "other";
    timestamp: Date;
    user_id: string;
    attachments?: AttachmentItem[];
}

const StreamChatInterface = forwardRef(function StreamChatInterface({
    otherUser,
}: {
    otherUser: UserProfile;
}, ref: React.Ref<{ handleVideoCall: () => void }>) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [showStickers, setShowStickers] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [EmojiPickerComp, setEmojiPickerComp] = useState<any>(null);
    const [emojiData, setEmojiData] = useState<any>(null);
    const [currentUserName, setCurrentUserName] = useState<string>("");

    const [client, setClient] = useState<StreamChat | null>(null);
    const [channel, setChannel] = useState<Channel | null>(null);

    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

    const [videoCallId, setVideoCallId] = useState<string>("");
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [isCallInitiator, setIsCallInitiator] = useState(false);

    const [incomingCallId, setIncomingCallId] = useState<string>("");
    const [callerName, setCallerName] = useState<string>("");
    const [showIncomingCall, setIncomingCall] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowScrollButton(false);
    }

    function handleScroll() {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                messagesContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollButton(!isNearBottom);
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const container = messagesContainerRef.current;

        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll]);

    // Try to lazy-load an emoji picker at runtime if available
    useEffect(() => {
        let cancelled = false;
        async function loadEmojiPicker() {
            try {
                // Correct package for React component in emoji-mart v5
                const mod: any = await import("@emoji-mart/react");
                const Picker = mod?.default;
                if (!Picker) return;

                // Load emoji data as well if available
                try {
                    const dataMod: any = await import("@emoji-mart/data");
                    if (!cancelled) setEmojiData(dataMod?.default ?? null);
                } catch {}

                if (!cancelled) setEmojiPickerComp(() => Picker);
            } catch {}
        }
        loadEmojiPicker();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        setShowVideoCall(false);
        setVideoCallId("");
        setIncomingCall(false);
        setIncomingCallId("");
        setCallerName("");
        setIsCallInitiator(false);

        async function initializeChat() {
            try {
                setError(null);

                const { token, userId, userName, userImage } =
                    await getStreamUserToken();
                setCurrentUserId(userId!);
                setCurrentUserName(userName || "");

                const chatClient = StreamChat.getInstance(
                    process.env.NEXT_PUBLIC_STREAM_API_KEY!
                );

                console.log(chatClient);
                await chatClient.connectUser(
                    {
                        id: userId!,
                        name: userName,
                        image: userImage,
                    },
                    token
                );

                const { channelType, channelId } = await createOrGetChannel(
                    otherUser.id
                );

                // Get the channel
                const chatChannel = chatClient.channel(channelType!, channelId);
                await chatChannel.watch();

                // Load existing messages
                const state = await chatChannel.query({ messages: { limit: 50 } });

                // Convert stream messages to our format
                const convertedMessages: Message[] = state.messages.map((msg) => ({
                    id: msg.id,
                    text: msg.text || "",
                    sender: msg.user?.id === userId ? "me" : "other",
                    timestamp: new Date(msg.created_at || new Date()),
                    user_id: msg.user?.id || "",
                    attachments: (msg.attachments || []).map((a: any) => ({
                        type: a.type,
                        image_url: a.image_url,
                        asset_url: a.asset_url,
                        mime_type: a.mime_type,
                        title: a.title,
                    })),
                }));

                setMessages(convertedMessages);

                chatChannel.on("message.new", (event: Event) => {
                    if (event.message) {
                        if (event.message.text?.includes(`📹 Video call invitation`)) {
                            const customData = event.message as any;

                            if (customData.caller_id !== userId) {
                                setIncomingCallId(customData.call_id);
                                setCallerName(customData.caller_name || "Someone");
                                setIncomingCall(true);
                            }
                            return;
                        }

                        if (event.message.user?.id !== userId) {
                            const newMsg: Message = {
                                id: event.message.id,
                                text: event.message.text || "",
                                sender: "other",
                                timestamp: new Date(event.message.created_at || new Date()),
                                user_id: event.message.user?.id || "",
                                attachments: (event.message.attachments || []).map((a: any) => ({
                                    type: a.type,
                                    image_url: a.image_url,
                                    asset_url: a.asset_url,
                                    mime_type: a.mime_type,
                                    title: a.title,
                                })),
                            };

                            setMessages((prev) => {
                                const messageExists = prev.some((msg) => msg.id === newMsg.id);
                                if (!messageExists) {
                                    return [...prev, newMsg];
                                }

                                return prev;
                            });
                        }
                    }
                });

                chatChannel.on("typing.start", (event: Event) => {
                    if (event.user?.id !== userId) {
                        setIsTyping(true);
                    }
                });

                chatChannel.on("typing.stop", (event: Event) => {
                    if (event.user?.id !== userId) {
                        setIsTyping(false);
                    }
                });

                setClient(chatClient);
                setChannel(chatChannel);
            } catch (error) {
                router.push("/chat");
            } finally {
                setLoading(false);
            }
        }

        if (otherUser) {
            initializeChat();
        }

        return () => {
            if (client) {
                client.disconnectUser();
            }
        };
    }, [otherUser]);

    async function handleVideoCall() {
        try {
            const { callId } = await createVideoCall(otherUser.id);
            setVideoCallId(callId!);
            // Caller joins immediately without confirmation
            setShowVideoCall(true);
            setIsCallInitiator(true);

            if (channel) {
                const messageData = {
                    text: `📹 Video call invitation`,
                    call_id: callId,
                    caller_id: currentUserId,
                    caller_name: currentUserName || "Someone",
                };

                await channel.sendMessage(messageData);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useImperativeHandle(ref, () => ({
        handleVideoCall,
    }));

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (newMessage.trim() && channel) {
            try {
                const response = await channel.sendMessage({
                    text: newMessage.trim(),
                });

                const message: Message = {
                    id: response.message.id,
                    text: newMessage.trim(),
                    sender: "me",
                    timestamp: new Date(),
                    user_id: currentUserId,
                };

                setMessages((prev) => {
                    const messageExists = prev.some((msg) => msg.id === message.id);
                    if (!messageExists) {
                        return [...prev, message];
                    }

                    return prev;
                });

                setNewMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    }

    const stickerUrls: string[] = [
        "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
        "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
        "https://media.giphy.com/media/l0HlPjezGY4o3L9HG/giphy.gif",
        "https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif",
    ];

    async function sendSticker(url: string) {
        if (!channel) return;
        try {
            const res = await channel.sendMessage({
                text: "",
                attachments: [
                    {
                        type: "image",
                        image_url: url,
                    },
                ],
            });

            const msg: Message = {
                id: res.message.id,
                text: "",
                sender: "me",
                timestamp: new Date(),
                user_id: currentUserId,
                attachments: [
                    {
                        type: "image",
                        image_url: url,
                    },
                ],
            };
            setMessages((prev) => [...prev, msg]);
            setShowStickers(false);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!channel) return;
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const upload = await channel.sendFile(file);
            const res = await channel.sendMessage({
                text: "",
                attachments: [
                    {
                        type: "video",
                        asset_url: upload.file,
                        mime_type: file.type,
                        title: file.name,
                    },
                ],
            });

            const msg: Message = {
                id: res.message.id,
                text: "",
                sender: "me",
                timestamp: new Date(),
                user_id: currentUserId,
                attachments: [
                    {
                        type: "video",
                        asset_url: upload.file,
                        mime_type: file.type,
                        title: file.name,
                    },
                ],
            };
            setMessages((prev) => [...prev, msg]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!channel) return;
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const upload = await channel.sendFile(file);
            const res = await channel.sendMessage({
                text: "",
                attachments: [
                    {
                        type: "image",
                        image_url: upload.file,
                        mime_type: file.type,
                        title: file.name,
                    },
                ],
            });
            const msg: Message = {
                id: res.message.id,
                text: "",
                sender: "me",
                timestamp: new Date(),
                user_id: currentUserId,
                attachments: [
                    {
                        type: "image",
                        image_url: upload.file,
                        mime_type: file.type,
                        title: file.name,
                    },
                ],
            };
            setMessages((prev) => [...prev, msg]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!channel) return;
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const upload = await channel.sendFile(file);
            const res = await channel.sendMessage({
                text: "",
                attachments: [
                    {
                        type: "file",
                        asset_url: upload.file,
                        mime_type: file.type,
                        title: file.name,
                    },
                ],
            });
            const msg: Message = {
                id: res.message.id,
                text: "",
                sender: "me",
                timestamp: new Date(),
                user_id: currentUserId,
                attachments: [
                    {
                        type: "file",
                        asset_url: upload.file,
                        mime_type: file.type,
                        title: file.name,
                    },
                ],
            };
            setMessages((prev) => [...prev, msg]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    }

    function handleCallEnd() {
        setShowVideoCall(false);
        setVideoCallId("");
        setIsCallInitiator(false);

        // Clear any pending incoming call state when call ends
        setIncomingCall(false);
        setIncomingCallId("");
        setCallerName("");
    }

    function handleDeclineCall() {
        setIncomingCall(false);
        setIncomingCallId("");
        setCallerName("");
    }

    function handleAcceptCall() {
        setVideoCallId(incomingCallId);
        setShowVideoCall(true);
        setIncomingCall(false);
        setIncomingCallId("");
        setIsCallInitiator(false);
    }

    function formatTime(date: Date) {
        return date.toLocaleDateString([], { hour: "2-digit", minute: "2-digit" });
    }

    const t = useTranslations('Chat');

    if (!client || !channel) {
        return (
            <div className="flex-1 flex items-center justify-center ">
                <div className="text-center p-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">{t('settingUp')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth chat-scrollbar relative"
                style={{ scrollBehavior: "smooth" }}
            >
                {messages.map((message, key) => (
                    <div
                        key={key}
                        className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender === "me"
                                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                }`}
                        >
                            {message.text && <p className="text-sm">{message.text}</p>}
                            {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {message.attachments.map((att, idx) => (
                                        <div key={idx}>
                                            {att.type === "image" && att.image_url && (
                                                <img src={att.image_url} alt={att.title || "sticker"} className="rounded-lg max-w-[220px]" />
                                            )}
                                            {att.type === "video" && att.asset_url && (
                                                <video src={att.asset_url} controls className="rounded-lg max-w-[260px]" />
                                            )}
                                            {att.type === "file" && att.asset_url && (
                                                <a href={att.asset_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm underline">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M7 17V7a2 2 0 012-2h6" />
                                                    </svg>
                                                    {att.title || "Download file"}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p
                                className={`text-xs mt-1 ${message.sender === "me"
                                        ? "text-pink-100"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                {formatTime(message.timestamp)}
                            </p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
                {showScrollButton && (
                    <div className="sticky bottom-4 z-10 flex justify-center">
                        <button
                            onClick={scrollToBottom}
                            className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                            title={t('scrollToBottom')}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Message Input */}

            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <form className="flex space-x-2 items-center relative" onSubmit={handleSendMessage}>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowStickers((s) => !s)}
                            className="px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                            title={t('stickers')}
                        >
                            😊
                        </button>
                        {showStickers && (
                            EmojiPickerComp ? (
                                <div className="absolute bottom-full mb-2 left-0 z-50">
                                    <EmojiPickerComp data={emojiData ?? undefined} onEmojiSelect={(emoji: any) => setNewMessage((m) => m + (emoji?.native || ""))} />
                                </div>
                            ) : (
                                <div className="absolute bottom-full mb-2 left-0 z-50 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl grid grid-cols-4 gap-2 max-w-sm">
                                    {stickerUrls.map((url, i) => (
                                        <button key={i} onClick={() => sendSticker(url)} className="rounded-lg overflow-hidden hover:scale-105 transition-transform">
                                            <img src={url} alt="sticker" className="w-16 h-16 object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);

                            if (channel && e.target.value.length > 0) {
                                channel.keystroke();
                            }
                        }}
                        onFocus={(e) => {
                            if (channel) {
                                channel.keystroke();
                            }
                        }}
                        placeholder={t('inputPlaceholder')}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        disabled={!channel}
                    />
                    

                    <label className="cursor-pointer px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100" title={t('sendFile')}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V8.414A2 2 0 0017.586 7L14 3.414A2 2 0 0012.586 3H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>

                    <button
                        type="submit"
                        disabled={!newMessage.trim() || !channel}
                        className="px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h14m-7-7l7 7-7 7"
                            />
                        </svg>
                    </button>
                </form>
            </div>

            {showIncomingCall && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-pink-500">
                                <img
                                    src={otherUser.avatar_url}
                                    alt={otherUser.full_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Incoming Video Call
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {callerName} is calling you
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleDeclineCall}
                                    className="flex-1 bg-red-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-red-600 transition-colors duration-200"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={handleAcceptCall}
                                    className="flex-1 bg-green-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-green-600 transition-colors duration-200"
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showVideoCall && videoCallId && (
                <VideoCall
                    onCallEnd={handleCallEnd}
                    callId={videoCallId}
                    isIncoming={!isCallInitiator}
                />
            )}
        </div>
    );
});

export default StreamChatInterface;