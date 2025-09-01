import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/app/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buni Money Tracker',
  description: 'Track your income and expenses with ease',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0idXJsKCNncmFkaWVudDApIi8+CjxwYXRoIGQ9Ik0xNiA4QzE5LjMxMzcgOCAyMiAxMC42ODYzIDIyIDE0VjE4QzIyIDIxLjMxMzcgMTkuMzEzNyAyNCAxNiAyNEMxMi42ODYzIDI0IDEwIDIxLjMxMzcgMTAgMThWMTRDMTAgMTAuNjg2MyAxMi42ODYzIDggMTYgOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiAxMkMxNy4xMDQ2IDEyIDE4IDEyLjg5NTQgMTggMTRWMTZDMTggMTcuMTA0NiAxNy4xMDQ2IDE4IDE2IDE4QzE0Ljg5NTQgMTggMTQgMTcuMTA0NiAxNCAxNlYxNEMxNCAxMi44OTU0IDE0Ljg5NTQgMTIgMTYgMTJaIiBmaWxsPSIjMTA5OTY1Ii8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MCIgeDE9IjAiIHkxPSIwIiB4Mj0iMzIiIHkyPSIzMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMTA5OTY1Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzA2NzRjYSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0idXJsKCNncmFkaWVudDApIi8+CjxwYXRoIGQ9Ik0xNiA4QzE5LjMxMzcgOCAyMiAxMC42ODYzIDIyIDE0VjE4QzIyIDIxLjMxMzcgMTkuMzEzNyAyNCAxNiAyNEMxMi42ODYzIDI0IDEwIDIxLjMxMzcgMTAgMThWMTRDMTAgMTAuNjg2MyAxMi42ODYzIDggMTYgOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiAxMkMxNy4xMDQ2IDEyIDE4IDEyLjg5NTQgMTggMTRWMTZDMTggMTcuMTA0NiAxNy4xMDQ2IDE4IDE2IDE4QzE0Ljg5NTQgMTggMTQgMTcuMTA0NiAxNCAxNlYxNEMxNCAxMi44OTU0IDE0Ljg5NTQgMTIgMTYgMTJaIiBmaWxsPSIjMTA5OTY1Ii8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MCIgeDE9IjAiIHkxPSIwIiB4Mj0iMzIiIHkyPSIzMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMTA5OTY1Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzA2NzRjYSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
