import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://black-q.com"),
  title: {
    default: "BlackQ — Bring AI to everyone",
    template: "%s · BlackQ",
  },
  description: "让 AI 走进每个人的生活。我是 BlackQ,一名 AI 工程师。",
  openGraph: {
    title: "BlackQ — Bring AI to everyone",
    description: "让 AI 走进每个人的生活。",
    url: "https://black-q.com",
    siteName: "BlackQ",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackQ — Bring AI to everyone",
    description: "让 AI 走进每个人的生活。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
