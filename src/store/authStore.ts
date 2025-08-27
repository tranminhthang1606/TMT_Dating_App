// store/authStore.ts
import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

// 1. Định nghĩa kiểu dữ liệu cho State
interface AuthState {
    user: User | null;
    loading: boolean;

    // Các hàm hành động (actions)
    checkUser: () => Promise<void>;
    signOut: () => Promise<void>;
}

const supabase = createClient();

// 2. Tạo store và gán kiểu AuthState
const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    // Hành động để kiểm tra trạng thái người dùng
    checkUser: async () => {
        try {
            console.log('checkUser called')
            set({ loading: true });
            const { data: { user } } = await supabase.auth.getUser()
            console.log('getUser result:', user)
            if (!user) {
                console.log('No user found, signing out')
                await supabase.auth.signOut() 
            } else {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                console.log('Session:', session)
                set({ user: session?.user ?? null });
                console.log('Set user to:', session?.user)
            }
        } catch (error) {
            console.error('Error in checkUser:', error);
        } finally {
            set({ loading: false });
        }
    },

    // Hành động đăng xuất
    signOut: async () => {
        try {
            await supabase.auth.signOut();
            set({ user: null });
        } catch (error) {
            console.error("Error signing out:", error);
        }
    },
}));

export default useAuthStore;