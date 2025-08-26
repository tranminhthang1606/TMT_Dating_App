"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow-inner transition-colors duration-300">
      <button 
        onClick={() => handleLocaleChange('vi')} 
        className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out font-bold text-sm ${locale === 'vi' ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
      >
        VI
      </button>
      <button 
        onClick={() => handleLocaleChange('en')}
        className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out font-bold text-sm ${locale === 'en' ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
      >
        EN
      </button>
    </div>
  );
}
