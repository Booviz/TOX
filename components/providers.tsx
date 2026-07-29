'use client'

import { SessionProvider } from 'next-auth/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { LocaleProvider } from '@/lib/i18n'

export function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster
            position="top-center"
            richColors
            theme="dark"
          />
        </TooltipProvider>
      </LocaleProvider>
    </SessionProvider>
  )
}