import type { Metadata } from "next";
import "./globals.css";
import { FloatingSidebar } from "@/components/layout/floating-sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "eBay Seller Fee Manager - 수수료 관리 시스템",
  description: "2025년 eBay 프로모션 정책을 반영한 한국 셀러를 위한 수수료 최적화 도구",
  keywords: ["eBay", "수수료", "셀러", "관리", "2025", "프로모션", "할인"],
  authors: [{ name: "eBay Seller Fee Manager Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
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
