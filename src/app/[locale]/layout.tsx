import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import Navbar from "@/app/[locale]/components/Navbar";
import GlobalIncomingCallListener from "@/app/[locale]/components/chat/GlobalIncomingCallListener";
import { AuthProvider } from "./AuthProvider";
import ProfilePage from "./profile/page";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SpeedInsights } from "@vercel/speed-insights/next"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "500", "600"],
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tmtdating.vercel.app';
  
  // Localized content
  const localizedContent = {
    vi: {
      title: 'Matcha - Ứng dụng hẹn hò hiện đại',
      description: 'Ứng dụng hẹn hò hiện đại giúp bạn tìm kiếm tình yêu đích thực với tính năng ghép đôi thông minh, video chat và nhắn tin an toàn',
      keywords: ['hẹn hò', 'ghép đôi', 'tình yêu', 'mối quan hệ', 'ứng dụng hẹn hò', 'tìm kiếm tình yêu'],
    },
    ko: {
      title: 'Matcha - 현대적인 데이팅 앱',
      description: '진정한 사랑을 찾을 수 있도록 도와주는 현대적인 데이팅 앱으로 스마트 매칭, 비디오 채팅, 안전한 메시징 기능을 제공합니다',
      keywords: ['데이팅', '매칭', '사랑', '관계', '데이팅 앱', '진정한 사랑 찾기'],
    },
    en: {
      title: 'Matcha - Modern Dating App',
      description: 'Modern dating app to help you find true love with smart matching, video chat, and secure messaging',
      keywords: ['dating', 'match', 'love', 'relationship', 'dating app', 'find love', 'online dating'],
    }
  };

  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.en;
  
  return {
    title: {
      default: content.title,
      template: `%s | ${content.title}`
    },
    description: content.description,
    keywords: content.keywords,
    authors: [{ name: 'Matcha Team', url: baseUrl }],
    creator: 'Matcha',
    publisher: 'Matcha',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'vi': '/vi', 
        'ko': '/ko',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      alternateLocale: ['en', 'vi', 'ko'].filter(l => l !== locale),
      url: baseUrl,
      title: content.title,
      description: content.description,
      siteName: 'Matcha',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Matcha Dating App - Find Your True Love',
          type: 'image/svg+xml',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      images: ['/og-image.svg'],
      creator: '@matcha_app',
      site: '@matcha_app',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Matcha',
      'application-name': 'Matcha',
      'msapplication-TileColor': '#ec4899',
      'msapplication-config': '/browserconfig.xml',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  
  // Structured data for the dating app
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Matcha",
    "description": "Modern dating app to help you find true love",
    "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://tmtdating.vercel.app',
    "applicationCategory": "DatingApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Smart Matching Algorithm",
      "Video Chat",
      "Secure Messaging",
      "Profile Management",
      "Location-based Matching"
    ],
    "screenshot": "/og-image.svg",
    "softwareVersion": "1.0.0",
    "author": {
      "@type": "Organization",
      "name": "Matcha Team"
    }
  };

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="google-site-verification" content="UEg2Aj4jti8_J9KcWPSU2YQTkAR_KfrPvnszug8OeVk" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${sourceSans.variable} antialiased h-full`}
      >
        <AuthProvider >
          <NextIntlClientProvider messages={messages}>
            <div className="h-full flex flex-col bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 dark:text-red-50 ">
              <Navbar />
              <GlobalIncomingCallListener />
              {children}
            </div>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}