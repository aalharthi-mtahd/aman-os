// src/app/layout.tsx
import type { Metadata } from 'next'
import { Syne, IBM_Plex_Mono, Tajawal } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { SessionProvider } from '@/components/providers/session-provider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-mono',
})

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
})

export const metadata: Metadata = {
  title: 'Aman OS — AI Operating System for Escrow Growth',
  description: 'Command center, prediction engine, and sales coach for Aman escrow platform.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()
  const session = await getServerSession(authOptions)
  const isRtl = locale === 'ar'

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`${syne.variable} ${ibmPlexMono.variable} ${tajawal.variable}`}
    >
      <body className="bg-brand-dark text-gray-200 antialiased">
        <SessionProvider session={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
