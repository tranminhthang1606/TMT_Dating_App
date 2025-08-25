
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
    <div className="flex space-x-2">
      <button 
        onClick={() => handleLocaleChange('vi')} 
        className={locale === 'vi' ? 'font-bold' : ''}
      >
        VI
      </button>
      <span>|</span>
      <button 
        onClick={() => handleLocaleChange('en')}
        className={locale === 'en' ? 'font-bold' : ''}
      >
        EN
      </button>
    </div>
  );
}