import { StreamChat, ConnectAPIResponse } from "stream-chat";

let singletonClient: StreamChat | null = null;
let isConnecting = false;

export async function getOrCreateStreamChatClient(apiKey: string, user: { id: string; name?: string; image?: string }, token: string): Promise<StreamChat> {
    if (singletonClient) {
        // Ensure user is connected
        if (!(singletonClient as any)._user) {
            await singletonClient.connectUser({ id: user.id, name: user.name, image: user.image }, token);
        }
        return singletonClient;
    }

    if (isConnecting) {
        // Busy wait minimal until connection flips; simple guard for double inits
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (singletonClient) {
                    clearInterval(interval);
                    resolve(singletonClient!);
                }
            }, 50);
        });
    }

    isConnecting = true;
    const client = StreamChat.getInstance(apiKey);
    await client.connectUser({ id: user.id, name: user.name, image: user.image }, token);
    singletonClient = client;
    isConnecting = false;
    return client;
}

export function getStreamChatClient(): StreamChat | null {
    return singletonClient;
}

export async function disconnectStreamChatClient(): Promise<void> {
    if (singletonClient) {
        try {
            await singletonClient.disconnectUser();
        } finally {
            singletonClient = null;
        }
    }
}

