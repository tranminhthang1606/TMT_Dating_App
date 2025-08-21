"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Power2 } from "gsap/all";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Giả lập các hàm và kiểu dữ liệu từ bên ngoài
// Bạn cần đảm bảo các hàm này có sẵn trong dự án của bạn
export interface UserProfile {
    id: string;
    full_name: string;
    username: string;
    email: string;
    gender: "male" | "female" | "other";
    birthdate: string;
    bio: string;
    avatar_url: string;
    preferences: UserPreferences;
    location_lat?: number;
    location_lng?: number;
    last_active: string;
    is_verified: boolean;
    is_online: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserPreferences {
    age_range: {
        min: number;
        max: number;
    };
    distance: number;
    gender_preference: ("male" | "female" | "other")[];
}

const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
    // Giả lập dữ liệu hồ sơ
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        id: "12345",
        full_name: "Jane Doe",
        username: "janedoe",
        email: "jane.doe@example.com",
        gender: "female",
        birthdate: "2000-05-15T00:00:00.000Z",
        bio: "Lover of art, music, and spontaneous adventures. Looking for a genuine connection and someone to share a laugh with.",
        avatar_url: "https://placehold.co/160x160/F472B6/FFFFFF?text=Ava",
        preferences: {
            age_range: { min: 20, max: 30 },
            distance: 50,
            gender_preference: ["male"],
        },
        last_active: "2024-05-20T10:00:00.000Z",
        is_verified: true,
        is_online: true,
        created_at: "2023-01-10T00:00:00.000Z",
        updated_at: "2024-05-20T10:00:00.000Z",
    };
};

const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const dob = new Date(birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
};

// Component chính
const ProfilePage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // GSAP refs cho các phần tử
    const profileCardRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const basicInfoRef = useRef<HTMLDivElement>(null);
    const preferencesRef = useRef<HTMLDivElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await getCurrentUserProfile();
                if (profileData) {
                    setProfile(profileData);
                } else {
                    setError("Failed to load profile");
                }
            } catch (err) {
                console.error("Error loading profile: ", err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // Hiệu ứng GSAP sẽ chạy sau khi dữ liệu đã tải xong
    useEffect(() => {
        if (!profile || !profileCardRef.current) {
            return;
        }

        const tl = gsap.timeline({
            defaults: {
                ease: Power2.easeOut,
            }
        });

        // Hiệu ứng "bay" toàn bộ card từ dưới lên
        tl.fromTo(profileCardRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
          // Hoạt hình riêng cho avatar
          .fromTo(avatarRef.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, "<0.2")
          // Hoạt hình cho phần thông tin chính
          .fromTo(infoRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "<0.3")
          // Hoạt hình cho các phần nội dung
          .fromTo([aboutRef.current, basicInfoRef.current, preferencesRef.current, actionsRef.current], { y: 20, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.2,
          }, "-=0.2");

    }, [profile]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
                    <p className="mt-4 text-gray-700">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8 rounded-2xl  shadow-lg">
                    <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XMarkIcon className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">
                        Profile not found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error || "Unable to load your profile. Please try again."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-rose-500 to-orange-400 text-white font-semibold py-3 px-6 rounded-full hover:from-rose-600 hover:to-orange-500 transition-all duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-pink-50 to-red-50">
          <div ref={profileCardRef} className="w-full max-w-4xl opacity-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cột chính */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                    <div ref={avatarRef} className="relative">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-rose-500 shadow-lg">
                        <img
                          src={profile.avatar_url || "/default-avatar.png"}
                          alt={profile.full_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div ref={infoRef} className="flex-1 text-center sm:text-left">
                      <h2 className="text-3xl font-bold text-gray-700 mb-1">
                        {profile.full_name}, {calculateAge(profile.birthdate)}
                      </h2>
                      <p className="text-gray-600 mb-2">
                        @{profile.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        Thành viên từ{" "}
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div ref={aboutRef}>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">
                        Giới thiệu
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {profile.bio || "Chưa có giới thiệu."}
                      </p>
                    </div>

                    <div ref={basicInfoRef}>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">
                        Thông tin cơ bản
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giới tính
                          </label>
                          <p className="text-gray-700 capitalize">
                            {profile.gender}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày sinh
                          </label>
                          <p className="text-gray-700">
                            {new Date(profile.birthdate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div ref={preferencesRef}>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">
                        Sở thích hẹn hò
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Độ tuổi
                          </label>
                          <p className="text-gray-700">
                            {profile.preferences.age_range.min} -{" "}
                            {profile.preferences.age_range.max} tuổi
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Khoảng cách
                          </label>
                          <p className="text-gray-700">
                            Lên tới {profile.preferences.distance} km
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột phụ */}
              <div className="space-y-6">
                <div ref={actionsRef} className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Tác vụ nhanh
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/profile/edit"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">
                          Chỉnh sửa hồ sơ
                        </span>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Tài khoản
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-700">
                        Tên đăng nhập
                      </span>
                      <span className="text-gray-500">
                        @{profile.username}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default ProfilePage;
