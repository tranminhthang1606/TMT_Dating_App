"use client";

import { useEffect, useState } from 'react';
import AuthForm from '@/app/components/auth/AuthForm';
import SocialLogin from '@/app/components/auth/SocialLogin';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TDate
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 cursor-pointer rounded-full font-medium ${
              isLogin 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            } transition-colors duration-200`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 cursor-pointer rounded-full font-medium ${
              !isLogin 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            } transition-colors duration-200`}
          >
            Đăng Ký
          </button>
        </div>

        <AuthForm isLogin={isLogin} />
        <SocialLogin />
      </div>
    </div>
  );
}