import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingSidebar } from "@/components/layout/floating-sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "이베이 멀티채널 관리 시스템",
  description: "이베이 및 멀티채널 판매자를 위한 통합 정산·수익성 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <FloatingSidebar />
          <main className="pl-24 p-6">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
