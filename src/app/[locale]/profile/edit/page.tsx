"use client";

import PhotoUpload from "@/app/[locale]/components/PhotoUpload";
import {
  getCurrentUserProfile,
  updateUserProfile,
} from "@/lib/actions/profile";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Power2 } from "gsap/all";
import { UserIcon, IdentificationIcon, GlobeAsiaAustraliaIcon, PencilSquareIcon, EnvelopeIcon, ArrowLeftIcon, ArrowUpOnSquareIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useTranslations } from 'next-intl';

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


export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('Profile');

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    gender: "male" as "male" | "female" | "other",
    birthdate: "",
    avatar_url: "",
    preferences: {
      age_range: { min: 18, max: 35 },
      distance: 50,
      gender_preference: [] as ("male" | "female" | "other")[],
    },
  });

  
  const formRef = useRef<HTMLFormElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const avatarSectionRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const preferencesRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getCurrentUserProfile();
        if (profileData) {
          setFormData({
            full_name: profileData.full_name || "",
            username: profileData.username || "",
            bio: profileData.bio || "",
            gender: profileData.gender || "male",
            birthdate: profileData.birthdate || "",
            avatar_url: profileData.avatar_url || "",
            preferences: profileData.preferences || {
              age_range: { min: 18, max: 35 },
              distance: 50,
              gender_preference: [],
            },
          });

          
          const tl = gsap.timeline({
            defaults: { ease: Power2.easeOut },
          });

          if (containerRef.current) {
              tl.fromTo(containerRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });
          }

          if (headerRef.current) {
              tl.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "<0.2");
          }
          if (formRef.current) {
            tl.fromTo(avatarSectionRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, "<0.2")
              .fromTo(Array.from(fieldsRef.current?.children || []), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.2")
              .fromTo(bioRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.1")
              .fromTo(preferencesRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.1")
              .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.1");
          }
        }
      } catch (err) {
        setError("Không thể tải hồ sơ.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [loading]);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Logic để cập nhật profile
      const result = await updateUserProfile(formData);
      if (result.success) {
        router.push("/profile");
      } else {
        setError(result.error || t('updateProfileFailed'));
      }
    } catch (err) {
      setError(t('updateProfileFailed'));
    } finally {
      setSaving(false);
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePreferenceChange(field: string, value: any) {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  }

  function handleGenderPreferenceChange(gender: "male" | "female" | "other") {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        gender_preference: prev.preferences.gender_preference.includes(gender)
          ? prev.preferences.gender_preference.filter(g => g !== gender)
          : [...prev.preferences.gender_preference, gender],
      },
    }));
  }

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {t('loadingProfile')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-pink-50 to-red-50 flex pt-24 justify-center p-4">
      <div ref={containerRef} className="container mx-auto opacity-0">
        <header ref={headerRef} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 mb-2">
            {t('editProfile')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('updatePersonalInfo')}
          </p>
        </header>

        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <form
            ref={formRef}
            className="space-y-8"
            onSubmit={handleFormSubmit}
          >
            <div ref={avatarSectionRef}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                <UserIcon className="w-6 h-6 inline-block mr-2 text-pink-500" />
                {t('profileAvatar')}
              </h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
                    <img
                      src={formData.avatar_url || "/default-avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <PhotoUpload
                    onPhotoUploaded={(url) => {
                      setFormData((prev) => ({
                        ...prev,
                        avatar_url: url,
                      }));
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {t('uploadNewAvatar')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('fileTypes')}
                  </p>
                </div>
              </div>
            </div>

            {/* Basic info */}
            <div ref={fieldsRef}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                <IdentificationIcon className="w-6 h-6 inline-block mr-2 text-pink-500" />
                {t('basicInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('fullNameRequired')}
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 text-gray-700 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder={t('fullNamePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('usernameRequired')}
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder={t('usernamePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('genderRequired')}
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('birthdateRequired')}
                  </label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    required
                    className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div ref={bioRef}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                <PencilSquareIcon className="w-6 h-6 inline-block mr-2 text-pink-500" />
                {t('introduceYourself')}
              </h3>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={4}
                maxLength={500}
                className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                placeholder={t('shareAboutYourself')}
              />
              <p className="text-xs text-gray-500 mt-1">
                                    {formData.bio.length}/500 {t('characters')}
              </p>
            </div>

            {/* Preferences Section */}
            <div ref={preferencesRef}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                <HeartIcon className="w-6 h-6 inline-block mr-2 text-pink-500" />
                {t('searchPreferences')}
              </h3>
              
              {/* Age Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('desiredAgeRange')}
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">{t('from')}</label>
                    <input
                      type="number"
                      min="18"
                      max="100"
                      value={formData.preferences.age_range.min}
                      onChange={(e) => handlePreferenceChange("age_range", {
                        ...formData.preferences.age_range,
                        min: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div className="text-gray-400">-</div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">{t('to')}</label>
                    <input
                      type="number"
                      min="18"
                      max="100"
                      value={formData.preferences.age_range.max}
                      onChange={(e) => handlePreferenceChange("age_range", {
                        ...formData.preferences.age_range,
                        max: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Distance */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('maxDistance')} (km)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.preferences.distance}
                  onChange={(e) => handlePreferenceChange("distance", parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{t('minDistance')}</span>
                  <span className="font-medium text-pink-500">{formData.preferences.distance}{t('km')}</span>
                  <span>{t('maxDistance')}</span>
                </div>
              </div>

              {/* Gender Preference */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('genderInterest')}
                </label>
                <div className="flex flex-wrap gap-3">
                  {(["male", "female", "other"] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => handleGenderPreferenceChange(gender)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        formData.preferences.gender_preference.includes(gender)
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-pink-300"
                      }`}
                    >
                      {gender === "male" ? t('genderMale') : gender === "female" ? t('genderFemale') : t('genderOther')}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t('selectAllIfInterestedInAllGenders')}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div ref={buttonsRef} className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center space-x-2 px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>{t('cancel')}</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {saving ? (
                  <>
                    <ArrowUpOnSquareIcon className="w-5 h-5 animate-bounce" />
                    <span>{t('savingProfile')}</span>
                  </>
                ) : (
                  <span>{t('saveChanges')}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
