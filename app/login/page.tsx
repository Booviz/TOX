'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bot, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ToxLogo } from '@/components/tox/logo'
import { LanguageToggle } from '@/components/tox/language-toggle'
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleDiscordLogin = async () => {
  setLoading(true);

  await signIn("discord", {
    callbackUrl: "/servers",
  });
};

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{ background: 'radial-gradient(600px 400px at 50% 20%, rgba(124,58,237,0.28), transparent 70%)' }}
      />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/"><ArrowLeft className="size-4" /> Home</Link>
        </Button>
        <LanguageToggle />
      </div>

      <Card className="w-full max-w-md border-border bg-card p-8">
        <div className="flex flex-col items-center text-center">
          <ToxLogo size={44} showText={false} />
          <h1 className="mt-6 text-2xl font-bold">Welcome to TOX</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in with Discord to manage your servers.</p>
        </div>

        <Button onClick={handleDiscordLogin} disabled={loading} size="lg" className="mt-8 w-full gap-2 bg-[#5865F2] text-white hover:bg-[#4752c4]">
          {loading ? <Loader2 className="size-5 animate-spin" /> : <Bot className="size-5" />}
          {loading ? 'Connecting…' : 'Continue with Discord'}
        </Button>

        <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-background/60 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
          <span>TOX only requests the permissions it needs and never stores your Discord password. Tokens stay server-side.</span>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our <span className="text-foreground">Terms</span> and{' '}
          <span className="text-foreground">Privacy Policy</span>.
        </p>
      </Card>
    </div>
  )
}
