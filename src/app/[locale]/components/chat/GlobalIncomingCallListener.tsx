"use client";

import { useEffect, useState } from "react";
import { getStreamUserToken } from "@/lib/actions/stream";
import { getOrCreateStreamChatClient } from "@/lib/stream/client";
import VideoCall from "./VideoCall";
import { useTranslations } from "next-intl";

interface IncomingCallInfo {
  callId: string;
  callerName: string;
  callerImage?: string;
}

export default function GlobalIncomingCallListener() {
  const [incoming, setIncoming] = useState<IncomingCallInfo | null>(null);
  const [showCall, setShowCall] = useState(false);
  const t = useTranslations('Call');

  useEffect(() => {
    let unsub: (() => void) | null = null;
    let mounted = true;

    async function init() {
      try {
        const { token, userId, userName, userImage } = await getStreamUserToken();
        const client = await getOrCreateStreamChatClient(
          process.env.NEXT_PUBLIC_STREAM_API_KEY!,
          { id: userId!, name: userName, image: userImage },
          token!
        );

        const handler = (event: any) => {
          const msg = event.message;
          if (!msg) return;
          if (msg.text?.includes("📹 Video call invitation")) {
            const callId = (msg as any).call_id as string;
            const callerName = (msg as any).caller_name || "Someone";
            const callerImage = msg.user?.image as string | undefined;
            // Ignore the invite if this user sent it (caller should auto-join, not see popup)
            if (mounted && msg.user?.id !== userId) {
              setIncoming({ callId, callerName, callerImage });
            }
          }
        };

        client.on("message.new", handler);
        unsub = () => client.off("message.new", handler);
      } catch (err) {
        // silently ignore when user not logged in
      }
    }

    init();
    return () => {
      mounted = false;
      if (unsub) unsub();
    };
  }, []);

  if (!incoming) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-pink-500">
            {incoming.callerImage ? (
              <img src={incoming.callerImage} alt={incoming.callerName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('incomingTitle')}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('incomingDesc', {name: incoming.callerName})}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => setIncoming(null)}
              className="flex-1 bg-red-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-red-600 transition-colors duration-200"
            >
              {t('decline')}
            </button>
            <button
              onClick={() => setShowCall(true)}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-green-600 transition-colors duration-200"
            >
              {t('accept')}
            </button>
          </div>
        </div>
      </div>

      {showCall && incoming && (
        <VideoCall
          callId={incoming.callId}
          onCallEnd={() => {
            setShowCall(false);
            setIncoming(null);
          }}
          isIncoming
        />
      )}
    </div>
  );
}


