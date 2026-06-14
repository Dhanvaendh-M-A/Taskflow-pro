import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "TaskFlow Pro - Premium Task Management",
  description: "AI-powered task management with real-time collaboration, beautiful analytics, and seamless team workflows.",
  keywords: ["task management", "productivity", "team collaboration", "project management"],
  authors: [{ name: "TaskFlow Pro" }],
  openGraph: {
    title: "TaskFlow Pro - Premium Task Management",
    description: "AI-powered task management with real-time collaboration",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
