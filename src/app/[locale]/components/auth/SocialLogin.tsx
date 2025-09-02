"use client";

import { useTranslations } from 'next-intl';

export default function SocialLogin() {
  const t = useTranslations('Auth');

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            {t('orContinueWith')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <button className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147.933-2.933 1.6-5.053 1.6-4.067 0-7.52-3.333-7.52-7.52s3.453-7.52 7.52-7.52c1.867 0 3.493.667 4.693 1.76l2.88-2.88C18.813 1.333 15.893 0 12.48 0 5.867 0 0 5.867 0 12.48s5.867 12.48 12.48 12.48c3.413 0 6.333-1.333 8.533-3.733 2.4-2.4 3.733-5.733 3.733-9.067 0-.933-.133-1.867-.267-2.8h-12.48z"
            />
          </svg>
          {t('google')}
        </button>
        <button className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          {t('facebook')}
        </button>
      </div>
    </div>
  );
}