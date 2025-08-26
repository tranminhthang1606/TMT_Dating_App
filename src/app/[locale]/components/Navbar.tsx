"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Power2 } from 'gsap/all';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import LocaleSwitcher from './LocaleSwitcher';

import { useLocale, useTranslations } from 'next-intl';


const Navbar = () => {
  const { signOut, user } = useAuthStore();
  const t = useTranslations('Navbar');
  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const logoutIconRef = useRef<HTMLButtonElement>(null);
  const locale = useLocale();
  useEffect(() => {
    console.log(user);
    if (!navRef.current || !logoRef.current || !menuRef.current || !logoutIconRef.current) {
      return;
    }

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: Power2.easeOut,
      }
    });

    tl.fromTo(navRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo(logoRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8 }, "<0.2")
      .fromTo(Array.from(menuRef.current.children), { y: 20, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
      }, "<0.3")
      .fromTo(logoutIconRef.current, { scale: 0, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        rotation: 360,
        ease: "back.out(1.7)"
      }, "<0.3");

    tl.play();
  }, []);

  return (
    user ? <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-gray-50/80 backdrop-blur-lg shadow-md"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          ref={logoRef}
          href={`/${locale}`}
          className="text-2xl font-bold text-rose-500 hover:text-orange-400 transition-colors duration-300"
        >
          {t('brand')}
        </Link>

        <div className="flex items-center space-x-8">
          <ul ref={menuRef} className="flex space-x-8">
            <li>
              <Link
                href={`/${locale}/matches`}
                className="text-gray-700 hover:text-rose-500 transition-colors duration-300"
              >
                {t('explore')}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/list-matches`}
                className="text-gray-700 hover:text-rose-500 transition-colors duration-300"
              >
                {t('connections')}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/chat`}
                className="text-gray-700 hover:text-rose-500 transition-colors duration-300"
              >
                {t('messages')}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/profile`}
                className="text-gray-700 hover:text-rose-500 transition-colors duration-300"
              >
                {t('profile')}
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex gap-2">
          <LocaleSwitcher />
          
          <button ref={logoutIconRef} title={t('logout')} onClick={signOut}>
            <ArrowRightOnRectangleIcon className="h-8 w-8 text-rose-500 hover:text-orange-400 transition-colors duration-300" />
          </button>
        </div>
      </div>
    </nav> : <></>
  );
};

export default Navbar;