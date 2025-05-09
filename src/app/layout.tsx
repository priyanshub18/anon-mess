import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "anon-mess",
  description: "Anonymous SMS Messenger",
  icons: ["/favicon.ico"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <AuthProvider>
        <body suppressHydrationWarning={true} className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <NavBar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
