import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Arabic, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const arabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'TOX Platform — All-in-one Discord Management',
    template: '%s · TOX Platform',
  },
  description:
    'TOX is a premium all-in-one Discord management platform: advanced ticketing, moderation, AutoMod, logging, leveling, backups, analytics and an AI configuration builder.',
  keywords: ['Discord bot', 'Discord management', 'ticketing', 'moderation', 'AutoMod', 'TOX'],
  generator: 'v0.app',
  openGraph: {
    title: 'TOX Platform — All-in-one Discord Management',
    description:
      'Replace a dozen bots with one organized, AI-powered platform for tickets, moderation, security, leveling and analytics.',
    type: 'website',
    siteName: 'TOX Platform',
  },
  twitter: { card: 'summary_large_image', title: 'TOX Platform' },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#070b14',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${arabic.variable} ${mono.variable} font-sans antialiased bg-background`}>
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
