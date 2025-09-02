"use client";
import { UserProfile } from "@/app/[locale]/profile/page";
import { getUserMatches } from "@/lib/actions/matches";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { calculateAge } from "@/lib/helpers/calculate-age";
import { gsap } from "gsap";
import { Power2 } from "gsap/all";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  MapPin, 
  MessageCircle, 
  Video, 
  Phone, 
  Crown,
  CheckCircle,
  Sparkles,
  Users
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function MatchesListPage() {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('MatchesList');
  const headerRef = useRef<HTMLDivElement>(null);
  const matchesListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadMatches() {
      try {
        const userMatches = await getUserMatches();
        setMatches(userMatches);
      } catch (error) {
        setError("Không thể tải danh sách match.");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  useEffect(() => {
    if (!loading && matches.length > 0) {
      const tl = gsap.timeline({ defaults: { ease: Power2.easeOut } });
      
      if (headerRef.current) {
        tl.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
      }

      if (matchesListRef.current) {
        const matchCards = Array.from(matchesListRef.current.children);
        tl.fromTo(matchCards, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "<0.2");
      }
    }
  }, [loading, matches]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Heart className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('loading')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header ref={headerRef} className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                {t('count', {count: matches.length})} {t('peopleSuitableForYou')}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        {matches.length === 0 ? (
          <div className="text-center max-w-md mx-auto p-12">
            <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('emptyTitle')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{t('emptyDesc')}</p>
            <Link
              href={`/${locale}/matches`}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-4 px-8 rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Heart className="w-5 h-5" />
              <span>{t('startSwiping')}</span>
            </Link>
          </div>
        ) : (
          <div className="max-w-full mx-auto overflow-x-auto p-4 scrollbar-hide">
            <div ref={matchesListRef} className="flex flex-nowrap space-x-6">
              {matches.map((match, key) => (
                <div key={key} className="group">
                  <Link
                    href={`/${locale}/chat?id=${match.id}`}
                    className="block flex-shrink-0 w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 overflow-hidden hover:scale-105"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      <Image
                        src={match.avatar_url ?? "/default-avatar.png"}
                        alt={match.full_name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={key < 3}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        {match.is_verified && (
                          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg">
                            <CheckCircle className="w-3 h-3 fill-current" />
                            <span>{t('verified')}</span>
                          </div>
                        )}
                        {match.is_online && (
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span>{t('online')}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg">
                          <Video className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg">
                          <Phone className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      {/* Profile Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-white truncate">
                            {match.full_name}
                          </h3>
                          <span className="text-white font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                            {calculateAge(match.birthdate)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-white/80 text-sm mb-2">
                          <Users className="w-4 h-4" />
                          <span>@{match.username}</span>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-white/80 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>Hà Nội, Việt Nam</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {match.bio || t('noBio')}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
