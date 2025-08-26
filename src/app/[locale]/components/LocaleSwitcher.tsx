"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow-inner hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold">{locale.toUpperCase()}</span>
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 overflow-hidden z-50" role="listbox">
          <button
            onClick={() => handleLocaleChange('en')}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${locale === 'en' ? 'font-semibold' : ''}`}
            role="option"
            aria-selected={locale === 'en'}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => handleLocaleChange('vi')}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${locale === 'vi' ? 'font-semibold' : ''}`}
            role="option"
            aria-selected={locale === 'vi'}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            onClick={() => handleLocaleChange('ko')}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${locale === 'ko' ? 'font-semibold' : ''}`}
            role="option"
            aria-selected={locale === 'ko'}
          >
            🇰🇷 한국어
          </button>
        </div>
      )}
    </div>
  );
}
