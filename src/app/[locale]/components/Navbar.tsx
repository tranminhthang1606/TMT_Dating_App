"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Power3 } from 'gsap/all';
import { ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import LocaleSwitcher from './LocaleSwitcher';
import BrandLogo from './BrandLogo';
import { useLocale, useTranslations } from 'next-intl';

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const t = useTranslations('Navbar');
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const logoutIconRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log(user);
    const nav = navRef.current;
    const logo = logoRef.current;
    const menu = menuRef.current;
    const logoutIcon = logoutIconRef.current;

    if (!nav || !logo || !menu || !logoutIcon) return;

    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(nav, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: Power3.easeOut }
    )
    .fromTo(logo, 
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: Power3.easeOut },
      "-=0.4"
    )
    .fromTo(menu.children, 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: Power3.easeOut },
      "-=0.3"
    )
    .fromTo(logoutIcon, 
      { scale: 0, rotation: 180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: Power3.easeOut },
      "-=0.2"
    );

    tl.play();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    user ? <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-pink-50 to-rose-50 backdrop-blur-lg shadow-lg border-b border-pink-200"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            ref={logoRef}
            href={`/${locale}`}
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <BrandLogo text={t('brand')} fontStyle="great-vibes" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <ul ref={menuRef} className="flex space-x-6 lg:space-x-8">
              <li>
                <Link
                  href={`/${locale}/matches`}
                  className="text-gray-700 hover:text-rose-500 transition-colors duration-300 font-medium text-sm lg:text-base"
                >
                  {t('explore')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/list-matches`}
                  className="text-gray-700 hover:text-rose-500 transition-colors duration-300 font-medium text-sm lg:text-base"
                >
                  {t('connections')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/chat`}
                  className="text-gray-700 hover:text-rose-500 transition-colors duration-300 font-medium text-sm lg:text-base"
                >
                  {t('messages')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/profile`}
                  className="text-gray-700 hover:text-rose-500 transition-colors duration-300 font-medium text-sm lg:text-base"
                >
                  {t('profile')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <LocaleSwitcher />
            
            <button 
              ref={logoutIconRef} 
              title={t('logout')} 
              onClick={signOut}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500 hover:text-rose-600 transition-colors duration-300" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LocaleSwitcher />
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100 mt-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-4">
            <ul className="space-y-2 px-4">
              <li>
                <Link
                  href={`/${locale}/matches`}
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 text-gray-700 hover:text-rose-500 hover:bg-gray-50 rounded-lg transition-all duration-300 font-medium"
                >
                  {t('explore')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/list-matches`}
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 text-gray-700 hover:text-rose-500 hover:bg-gray-50 rounded-lg transition-all duration-300 font-medium"
                >
                  {t('connections')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/chat`}
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 text-gray-700 hover:text-rose-500 hover:bg-gray-50 rounded-lg transition-all duration-300 font-medium"
                >
                  {t('messages')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/profile`}
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 text-gray-700 hover:text-rose-500 hover:bg-gray-50 rounded-lg transition-all duration-300 font-medium"
                >
                  {t('profile')}
                </Link>
              </li>
            </ul>
            
            {/* Mobile Logout */}
            <div className="border-t border-gray-200 mt-4 pt-4 px-4">
              <button 
                onClick={() => {
                  closeMobileMenu();
                  signOut();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-300 font-medium"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav> : null
  );
};

export default Navbar;