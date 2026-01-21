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
  title: {
    default: "DevSetup.AI | High Performance Workspaces",
    template: "%s | DevSetup.AI"
  },
  description: "Curated desk setups for software engineers. Discover the best mechanical keyboards, ergonomic chairs, and productivity tools.",
  openGraph: {
    title: "DevSetup.AI | High Performance Workspaces",
    description: "Curated desk setups for software engineers. Stop buying cheap gear.",
    url: "https://bibliophileai.vercel.app",
    siteName: "DevSetup.AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevSetup.AI",
    description: "Curated desk setups for software engineers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
