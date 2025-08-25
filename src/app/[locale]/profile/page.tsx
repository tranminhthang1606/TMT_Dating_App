"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Power2 } from "gsap/all";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getCurrentUserProfile } from "@/lib/actions/profile";
import useAuthStore from "@/store/authStore";

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

// const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
//     // Giả lập dữ liệu hồ sơ
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     return {
//         id: "12345",
//         full_name: "Jane Doe",
//         username: "janedoe",
//         email: "jane.doe@example.com",
//         gender: "female",
//         birthdate: "2000-05-15T00:00:00.000Z",
//         bio: "Lover of art, music, and spontaneous adventures. Looking for a genuine connection and someone to share a laugh with.",
//         avatar_url: "https://placehold.co/160x160/F472B6/FFFFFF?text=Ava",
//         preferences: {
//             age_range: { min: 20, max: 30 },
//             distance: 50,
//             gender_preference: ["male"],
//         },
//         last_active: "2024-05-20T10:00:00.000Z",
//         is_verified: true,
//         is_online: true,
//         created_at: "2023-01-10T00:00:00.000Z",
//         updated_at: "2024-05-20T10:00:00.000Z",
//     };
// };

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
    const {signOut} = useAuthStore();
    // GSAP refs cho các phần tử
    const profileCardRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const sideContentRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await getCurrentUserProfile();
                if (profileData) {
                    setProfile(profileData);
                } else {
                    setError("Không thể tải hồ sơ");
                }
            } catch (err) {
                console.error("Lỗi khi tải hồ sơ: ", err);
                setError("Không thể tải hồ sơ");
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

        // Hoạt hình toàn bộ card xuất hiện
        tl.fromTo(profileCardRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
            // Hoạt hình riêng cho avatar
            .fromTo(avatarRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, "<0.2")
            // Hoạt hình cho thông tin chính và bên lề cùng lúc
            .fromTo(mainContentRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "<0.3")
            .fromTo(sideContentRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "<");

    }, [profile]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
                    <p className="mt-4 ">
                        Đang tải hồ sơ...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8 rounded-2xl shadow-lg">
                    <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XMarkIcon className="w-12 h-12 " />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                        Không tìm thấy hồ sơ
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error || "Không thể tải hồ sơ của bạn. Vui lòng thử lại."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-rose-500 to-orange-400  font-semibold py-3 px-6 rounded-full hover:from-rose-600 hover:to-orange-500 transition-all duration-200"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen flex flex-col items-center p-4">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 mb-2">
                    Hồ sơ của tôi
                </h1>
                <p className="">
                    Quản lý hồ sơ và sở thích của bạn
                </p>
            </header>
            <div ref={profileCardRef} className="w-full max-w-5xl opacity-0">
                <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 space-y-8">
                    {/* Phần trên cùng: Avatar và Bio */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8">
                        <div ref={avatarRef} className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-rose-500 shadow-lg flex-shrink-0">
                            <img
                                src={profile.avatar_url || "/default-avatar.png"}
                                alt={profile.full_name}
                                className="w-full h-full object-cover"
                            />
                            {profile.is_online && (
                                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></span>
                            )}
                        </div>
                        
                        <div ref={infoRef} className="flex-1 mt-6 lg:mt-0 text-center lg:text-left">
                            <div className="flex justify-center lg:justify-start items-center space-x-2">
                                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                                    {profile.full_name}, {calculateAge(profile.birthdate)}
                                </h2>
                                {profile.is_verified && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
                                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.416 0 2.78.608 3.797 1.549L17.5 5.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75l-.997.996a.75.75 0 0 0-.215.534V12a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-.215a.75.75 0 0 0-.534-.215H8.75a.75.75 0 0 1-.75-.75V8.25a.75.75 0 0 1 .75-.75h.215a.75.75 0 0 0 .534-.215L10.5 6.75a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 .75.75v.215a.75.75 0 0 0 .534.215H15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-.215a.75.75 0 0 0-.534.215L12 11.25a.75.75 0 0 0-.534.215v.215a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-.215a.75.75 0 0 0-.534-.215L5.25 10.5a.75.75 0 0 1-.75-.75V8.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 0 .75-.75V6a.75.75 0 0 1 .75-.75h.215a.75.75 0 0 0 .534-.215L8.603 3.799Z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <p className="text-xl text-gray-600 mt-1">
                                @{profile.username}
                            </p>
                            <p className="mt-4 text-gray-700 leading-relaxed text-lg">
                                {profile.bio || "Chưa có giới thiệu."}
                            </p>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 pb-8"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cột chính - Thông tin */}
                        <div ref={mainContentRef} className="lg:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Thông tin chi tiết
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Thông tin cơ bản</h4>
                                        <div className="grid grid-cols-2 gap-4 text-gray-600">
                                            <div>
                                                <span className="font-medium">Giới tính:</span> <span className="capitalize">{profile.gender}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Ngày sinh:</span> <span>{new Date(profile.birthdate).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Tuổi:</span> <span>{calculateAge(profile.birthdate)}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Tham gia:</span> <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Sở thích hẹn hò</h4>
                                        <div className="grid grid-cols-2 gap-4 text-gray-600">
                                            <div>
                                                <span className="font-medium">Độ tuổi:</span> <span>{profile.preferences.age_range.min} - {profile.preferences.age_range.max} tuổi</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Khoảng cách:</span> <span>Lên tới {profile.preferences.distance} km</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Ưu tiên giới tính:</span> <span className="capitalize">{profile.preferences.gender_preference.join(", ")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cột bên lề - Tác vụ và Tài khoản */}
                        <div ref={sideContentRef} className="lg:col-span-1 space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Tác vụ nhanh</h3>
                                <div className="space-y-4">
                                    <Link
                                        href="/profile/edit"
                                        className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm hover:bg-gray-100 transition-colors duration-200 group"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center  group-hover:rotate-12 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.23-8.23zM21.75 18v.5c0 .717-.384 1.405-1.006 1.855l-5.658 4.244a1.875 1.875 0 01-2.484 0l-5.658-4.244A2.25 2.25 0 011.5 18.5V18" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-800 font-medium">Chỉnh sửa hồ sơ</span>
                                        </div>
                                        <svg
                                            className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
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
                                    <button
                                        onClick={signOut}
                                        className="flex items-center justify-between p-4 rounded-xl cursor-pointer bg-white shadow-sm hover:bg-gray-100 transition-colors duration-200 group w-full"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center  group-hover:rotate-12 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-800 font-medium">Đăng xuất</span>
                                        </div>
                                        <svg
                                            className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
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
                                    </button>
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
