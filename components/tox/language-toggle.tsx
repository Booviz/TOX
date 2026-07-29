'use client'

import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/lib/i18n'

export function LanguageToggle({ variant = 'ghost' }: { variant?: 'ghost' | 'outline' }) {
  const { locale, toggle } = useLocale()
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={toggle}
      className="gap-2"
      aria-label="Toggle language"
    >
      <Languages className="size-4" />
      <span className="font-medium">{locale === 'en' ? 'العربية' : 'English'}</span>
    </Button>
  )
}
