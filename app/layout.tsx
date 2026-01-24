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
  title: "生活保護の簡単セルフ診断｜受給の可能性をチェック",
  description:
    "いくつかの質問に答えるだけで、生活保護を受けられる可能性を簡単に確認できる無料ツールです。",
  verification: {
    google: "U3rgvTMTOMOMHrD2ocE4ADOS6OrePh_VYuIycJ3OUT8",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}