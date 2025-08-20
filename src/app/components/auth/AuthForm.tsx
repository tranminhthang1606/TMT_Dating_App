import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface AuthFormProps {
  isLogin: boolean;
}

export default function AuthForm({ isLogin }: AuthFormProps) {

  const supabase = createClient();
  const [email,setEmail] = useState<string>('');
  const [password,setPassword] = useState<string>('');
  const [error, setError] = useState<string>("");
const [loading, setLoading] = useState<boolean>(false);
  const handleAuth = async (e: React.FormEvent)=>{
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (!isLogin) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        if (data.user && !data.session) {
          setError("Please check your email for a confirmation link");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{
    setError('');
  },[isLogin])
  return (
    <form className="space-y-6" onSubmit={handleAuth}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          onChange={(e)=>setEmail(e.target.value)}
          required
          className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mật Khẩu
        </label>
        <input
          id="password"
          type="password"
          onChange={(e)=>setPassword(e.target.value)}
          required
          className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
          placeholder="••••••••"
        />
      </div>

      {/* {!isLogin && (
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Xác Nhận Mật Khẩu
          </label>
          <input
            id="confirm-password"
            type="password"
            onChange={(e)=>setPassword(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
      )} */}

      {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

      {isLogin && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <a href="#" className="text-sm text-pink-500 hover:text-pink-600">
            Quên mật khẩu?
          </a>
        </div>
      )}

      <button
        type="submit"
        className="w-full cursor-pointer py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors duration-200"
      >
        {loading ? "Loading..." : isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
      </button>
    </form>
  );
}