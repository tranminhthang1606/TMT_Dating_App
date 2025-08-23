"use client";

import { uploadProfilePhoto } from "@/lib/actions/profile";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export default function PhotoUpload({
  onPhotoUploaded,
}: {
  onPhotoUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Hiệu ứng xuất hiện ban đầu của nút
    gsap.fromTo(buttonRef.current, { scale: 0, opacity: 0 }, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
    });
  }, []);

  useEffect(() => {
    // Hiệu ứng khi bắt đầu hoặc kết thúc tải ảnh
    if (uploading) {
      // Bắt đầu tải, co nút lại và hiện spinner
      gsap.to(buttonRef.current, {
        width: "2rem",
        height: "2rem",
        duration: 0.3,
      });
      gsap.to(iconRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
      });
      gsap.to(spinnerRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        delay: 0.2,
      });
    } else {
      // Kết thúc tải, trả nút về trạng thái ban đầu
      gsap.to(spinnerRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
      });
      gsap.to(buttonRef.current, {
        width: "2.5rem",
        height: "2.5rem",
        duration: 0.3,
        delay: 0.2,
      });
      gsap.to(iconRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        delay: 0.2,
      });
    }
  }, [uploading]);

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một file ảnh.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Dung lượng file phải nhỏ hơn 5MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadProfilePhoto(file);
      if (result.success && result.url) {
        onPhotoUploaded(result.url);
        setError(null);
      } else {
        setError(result.error ?? "Tải ảnh lên thất bại.");
      }
    } catch (error) {
      setError("Thay đổi ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  }

  function handleClick() {
    setError('');
    fileInputRef.current?.click();
  }

  return (
    <div className="absolute bottom-0 right-0">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="relative w-10 h-10 flex items-center justify-center bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Đổi ảnh đại diện"
      >
        <div 
          ref={spinnerRef}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin absolute scale-0 opacity-0"
        ></div>
        <svg
          ref={iconRef}
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
      {error && (
        <p className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-red-500 w-max">
          {error}
        </p>
      )}
    </div>
  );
}
