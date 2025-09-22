import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { FontSizeProvider } from "@/components/providers/FontSizeProvider";
import { CompactModeProvider } from "@/components/providers/CompactModeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeTracker - Learn to Code Together",
  description: "A comprehensive platform for tracking coding progress, managing assignments, and fostering collaborative learning between students and teachers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <FontSizeProvider>
              <CompactModeProvider>
                <SessionProvider>
                  {children}
                </SessionProvider>
              </CompactModeProvider>
            </FontSizeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
