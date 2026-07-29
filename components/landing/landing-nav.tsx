'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ToxLogo } from '@/components/tox/logo'
import { LanguageToggle } from '@/components/tox/language-toggle'
import { useLocale } from '@/lib/i18n'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#modules', label: 'Modules' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

function createBotInviteUrl() {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  const permissions =
    process.env.NEXT_PUBLIC_DISCORD_BOT_PERMISSIONS ?? '8'

  if (!clientId) {
    return '/login'
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'bot applications.commands',
    permissions,
  })

  return `https://discord.com/oauth2/authorize?${params.toString()}`
}

export function LandingNav() {
  const { t } = useLocale()
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  const botInviteUrl = createBotInviteUrl()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <ToxLogo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />

          {status === 'loading' ? (
            <div className="h-9 w-28 animate-pulse rounded-xl bg-secondary" />
          ) : session?.user ? (
            <>
              <Link
                href="/servers"
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-1.5 transition-colors hover:border-primary/40"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'Discord user'}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {session.user.name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                )}

                <span className="max-w-32 truncate text-sm font-medium">
                  {session.user.name ?? 'My account'}
                </span>
              </Link>

              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Sign out"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">
                {t('landing.signin')}
              </Link>
            </Button>
          )}

          <Button asChild size="sm">
            <a href={botInviteUrl}>
              {t('landing.cta.add')}
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="text-foreground md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Menu"
        >
          {open ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </a>
            ))}

            <div className="flex items-center gap-2 pt-2">
              <LanguageToggle variant="outline" />

              {session?.user ? (
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href="/servers">
                    {session.user.name ?? 'My servers'}
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href="/login">
                    {t('landing.signin')}
                  </Link>
                </Button>
              )}
            </div>

            <Button asChild size="sm">
              <a href={botInviteUrl}>
                {t('landing.cta.add')}
              </a>
            </Button>

            {session?.user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}