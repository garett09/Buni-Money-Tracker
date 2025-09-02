import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './styles/performance.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/app/contexts/ThemeContext'
import { PerformanceOptimizer } from '@/app/components/PerformanceOptimizer'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'


// Optimize font loading with display: swap
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: 'Buni Money Tracker',
  description: 'Track your income and expenses with ease - Fast, secure, and intuitive money management',
  keywords: ['money tracker', 'expense tracker', 'budget app', 'financial management'],
  authors: [{ name: 'Buni Money Tracker Team' }],
  creator: 'Buni Money Tracker',
  publisher: 'Buni Money Tracker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://buni-money-tracker.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Buni Money Tracker',
    description: 'Track your income and expenses with ease',
    url: 'https://buni-money-tracker.vercel.app',
    siteName: 'Buni Money Tracker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Buni Money Tracker',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buni Money Tracker',
    description: 'Track your income and expenses with ease',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0idXJsKCNncmFkaWVudDApIi8+CjxwYXRoIGQ9Ik0xNiA4QzE5LjMxMzcgOCAyMiAxMC42ODYzIDIyIDE0VjE4QzIyIDIxLjMxMzcgMTkuMzEzNyAyNCAxNiAyNEMxMi42ODYzIDI0IDEwIDIxLjMxMzcgMTAgMThWMTRDMTAgMTAuNjg2MyAxMi42ODYzIDggMTYgOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiAxMkMxNy4xMDQ2IDEyIDE4IDEyLjg5NTQgMTggMTRWMTZDMTggMTcuMTA0NiAxNy4xMDQ2IDE4IDE2IDE4QzE0Ljg5NTQgMTggMTQgMTcuMTA0NiAxNCAxNlYxNEMxNCAxMi44OTU0IDE0Ljg5NTQgMTIgMTYgMTJaIiBmaWxsPSIjMTA5OTY1Ii8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MCIgeDE9IjAiIHkxPSIwIiB4Mj0iMzIiIHkyPSIzMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMTA5OTY1Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzA2NzRjYSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0idXJsKCNncmFkaWVudDApIi8+CjxwYXRoIGQ9Ik0xNiA4QzE5LjMxMzcgOCAyMiAxMC42ODYzIDIyIDE0VjE4QzIyIDIxLjMxMzcgMTkuMzEzNyAyNCAxNiAyNEMxMi42ODYzIDI0IDEwIDIxLjMxMzcgMTAgMThWMTRDMTAgMTAuNjg2MyAxMi42ODYzIDggMTYgOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiAxMkMxNy4xMDQ2IDEyIDE4IDEyLjg5NTQgMTggMTRWMTZDMTggMTcuMTA0NiAxNy4xMDQ2IDE4IDE2IDE4QzE0Ljg5NTQgMTggMTQgMTcuMTA0NiAxNCAxNlYxNEMxNCAxMi44OTU0IDE0Ljg5NTQgMTIgMTYgMTJaIiBmaWxsPSIjMTA5OTY1Ii8+CjxkZWZzPgo8bGluYXIyR3JhZGllbnQgaWQ9ImdyYWRpZW50MCIgeDE9IjAiIHkxPSIwIiB4Mj0iMzIiIHkyPSIzMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMTA5OTY1Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzA2NzRjYSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=',
        type: 'image/svg+xml',
      },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'theme-color': '#109965',
    'msapplication-TileColor': '#109965',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Buni Money Tracker',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources */}

        <link rel="preload" href="/api/accounts" as="fetch" crossOrigin="anonymous" />
        
        {/* Service Worker */}
        <link rel="serviceworker" href="/sw.js" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <PerformanceOptimizer />
          {children}
          <Toaster position="top-right" />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
