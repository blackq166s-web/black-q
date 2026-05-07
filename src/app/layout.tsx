import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_TAGLINE_CN, ogImageUrl } from "@/lib/og";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: `${SITE_TAGLINE_CN}。我是 BlackQ,一名 AI 工程师。`,
  keywords: ["BlackQ", "AI", "工程师", "Trip Planner", "AI 工具", "智能文档", "长沙"],
  authors: [{ name: "BlackQ", url: SITE_URL }],
  creator: "BlackQ",
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_TAGLINE_CN,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: ogImageUrl({ title: SITE_TAGLINE, subtitle: SITE_TAGLINE_CN }),
        width: 1200,
        height: 630,
        alt: SITE_TAGLINE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_TAGLINE_CN,
    images: [ogImageUrl({ title: SITE_TAGLINE, subtitle: SITE_TAGLINE_CN })],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen pb-[calc(env(safe-area-inset-bottom)+72px)] md:pb-0">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
