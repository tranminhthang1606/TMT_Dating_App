"use client";
import { UserProfile } from "@/app/[locale]/profile/page";
import { getUserMatches } from "@/lib/actions/matches";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { calculateAge } from "@/lib/helpers/calculate-age";
import { gsap } from "gsap";
import { Power2 } from "gsap/all";
import Image from "next/image";

export default function MatchesListPage() {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Đang tải danh sách match...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 pt-24">
      <div className="container mx-auto px-4 py-8">
        <header ref={headerRef} className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Các Match của bạn
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {matches.length} match{matches.length !== 1 ? "" : ""}
          </p>
        </header>

        {matches.length === 0 ? (
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">💕</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Bạn chưa có match nào
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Hãy bắt đầu vuốt để tìm match phù hợp!
            </p>
            <Link
              href="/matches"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
            >
              Bắt đầu vuốt
            </Link>
          </div>
        ) : (
          <div className="max-w-full mx-auto overflow-x-auto p-4 scrollbar-hide">
            <div ref={matchesListRef} className="flex flex-nowrap space-x-6">
              {matches.map((match, key) => (
                <Link
                  key={key}
                  href={`/chat/${match.id}`}
                  className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-105"
                >
                  <div className="relative aspect-[4/5] w-full rounded-t-3xl overflow-hidden">
                    <Image
                      src={match.avatar_url ?? "/default-avatar.png"}
                      alt={match.full_name}
                      fill
                      className="object-cover"
                      priority={key < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold">
                        {match.full_name}, {calculateAge(match.birthdate)}
                      </h3>
                      <p className="text-sm opacity-80">@{match.username}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {match.bio || "Chưa có giới thiệu."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
