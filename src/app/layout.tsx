import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader, Young_Serif } from "next/font/google";
import "./globals.css";
import RegisterSW from "@/components/pwa/register-sw";
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const youngSerif = Young_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  themeColor: "#EA580C",
};

export const metadata: Metadata = {
  title: "FestaLab: mostre a festa pronta antes de montar | Grátis",
  description: "Monte a decoração da festa no celular ou computador (mesa de doces, painéis, balões e arco) e gere uma foto realista com IA para mostrar ao cliente. 100% gratuito.",
  applicationName: "FestaLab",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FestaLab",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-icon.png", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html
        lang="pt-BR"
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${youngSerif.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#FAFAF8] text-zinc-900">
          {children}
          <RegisterSW />
        </body>
      </html>
    </ClerkProvider>
  );
}
