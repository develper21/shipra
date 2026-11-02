import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AppLayoutWrapper } from '@/components/common/AppLayoutWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Shipra — Open Source Mobile App Deployment & APK Distribution',
  description: 'The open-source, framework-agnostic alternative to Expo Internal Distribution. Instant APK upload, high-res QR codes, automated virus scanning, and direct downloads with zero paywalls.',
  keywords: ['android distribution', 'apk hosting', 'expo alternative', 'react native deployment', 'flutter apk install', 'internal testing', 'open source apk share'],
  authors: [{ name: 'Shipra Team' }],
  icons: {
    icon: '/shipra.svg',
    shortcut: '/shipra.svg',
    apple: '/shipra.svg',
  },
  openGraph: {
    title: 'Shipra — Free, Unlimited Android App Distribution',
    description: 'Deploy & test Android APKs instantly with automatic malware scanning and smart device QR codes.',
    type: 'website',
    url: 'https://shipra.dev',
    siteName: 'Shipra',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipra — Open Source Android App Distribution',
    description: 'Instant APK hosting and internal distribution without Google Play lags or store review delays.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white`}>
        <AppProvider>
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
