import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import Navbar from "@/app/components/Navbar";
import { AuthProvider } from "./AuthProvider";
import ProfilePage from "./profile/page";

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

export const metadata: Metadata = {
  title: "Dating App - Tìm kiếm tình yêu",
  description: "Ứng dụng hẹn hò hiện đại",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${playfair.variable} ${sourceSans.variable} antialiased h-full`}
      >
        <AuthProvider >
          <div className="h-full flex flex-col">
            <Navbar/>
            {children}
          </div>

        </AuthProvider>
      </body>
    </html>
  );
}
