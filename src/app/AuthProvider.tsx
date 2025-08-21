// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkUser = useAuthStore((state) => state.checkUser);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Gọi action checkUser để kiểm tra trạng thái người dùng khi component mount
    checkUser();

    // Lắng nghe các thay đổi về trạng thái xác thực
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Cập nhật store khi trạng thái thay đổi
      console.log(event)
      useAuthStore.setState({ user: session?.user ?? null });
      if (!session?.user) {
        router.push("/auth");
      }
    });

    // Clean-up: Hủy đăng ký lắng nghe khi component unmount
    return () => subscription.unsubscribe();
  }, [checkUser, router]);

  return <>{children}</>;
}