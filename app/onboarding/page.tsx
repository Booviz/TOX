'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Check, ChevronRight, Bot, Loader2, ShieldCheck, ShieldAlert, Link2,
  UserCheck, Server, PartyPopper, ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { guilds } from '@/lib/demo-data'
import { DiscordAvatar } from '@/components/tox/discord-avatar'
import { ToxLogo } from '@/components/tox/logo'
import { formatNumber } from '@/lib/format'
import { toast } from 'sonner'

const steps = [
  { id: 1, title: 'Connect account', icon: Link2 },
  { id: 2, title: 'Choose a server', icon: Server },
  { id: 3, title: 'Install TOX bot', icon: Bot },
  { id: 4, title: 'Permission check', icon: UserCheck },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(false)

  const guild = guilds.find((g) => g.id === selected)

  const next = () => setStep((s) => Math.min(4, s + 1))

  const install = () => {
    setInstalling(true)
    setTimeout(() => {
      setInstalling(false)
      setInstalled(true)
      toast.success('TOX bot installed successfully')
    }, 1200)
  }

  const finish = () => {
    toast.success('Setup complete. Welcome aboard!')
    router.push(`/dashboard/${selected ?? guilds[0].id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <ToxLogo />
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/servers"><ArrowLeft className="size-4" /> Skip to servers</Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Stepper */}
        <ol className="flex items-center justify-between">
          {steps.map((s, i) => {
            const done = step > s.id
            const active = step === s.id
            return (
              <li key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full border transition-colors',
                      done && 'border-success bg-success text-success-foreground',
                      active && 'border-primary bg-primary text-primary-foreground glow-primary',
                      !done && !active && 'border-border bg-card text-muted-foreground',
                    )}
                  >
                    {done ? <Check className="size-5" /> : <s.icon className="size-5" />}
                  </div>
                  <span className={cn('hidden text-xs sm:block', active ? 'text-foreground' : 'text-muted-foreground')}>{s.title}</span>
                </div>
                {i < steps.length - 1 && <div className={cn('mx-2 h-0.5 flex-1', step > s.id ? 'bg-success' : 'bg-border')} />}
              </li>
            )
          })}
        </ol>

        <Card className="mt-8 border-border bg-card p-6 sm:p-8">
          {step === 1 && (
            <div className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Link2 className="size-7" />
              </div>
              <h2 className="mt-5 text-xl font-bold">Connect your Discord account</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                We use Discord OAuth to securely read the servers you can manage. You&apos;re signed in as Nova.
              </p>
              <div className="mx-auto mt-6 flex max-w-sm items-center gap-3 rounded-lg border border-border bg-background/60 p-3">
                <DiscordAvatar name="Nova" color="#7c3aed" size={40} status="online" />
                <div className="text-start">
                  <p className="text-sm font-medium">Nova</p>
                  <p className="text-xs text-muted-foreground">nova.dev · Connected</p>
                </div>
                <Badge className="ms-auto gap-1 bg-success/15 text-success"><Check className="size-3" /> Linked</Badge>
              </div>
              <Button onClick={next} size="lg" className="mt-8 gap-2">Continue <ChevronRight className="size-4" /></Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold">Choose a server to manage</h2>
              <p className="mt-1 text-sm text-muted-foreground">Select a server where you have admin permissions.</p>
              <div className="mt-6 grid gap-3">
                {guilds.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelected(g.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-3 text-start transition-colors',
                      selected === g.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                    )}
                  >
                    <DiscordAvatar name={g.name} color={g.iconColor} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{formatNumber(g.memberCount)} members · {g.ownerAdmin}</p>
                    </div>
                    {g.botInstalled ? (
                      g.missingPermissions ? (
                        <Badge className="gap-1 bg-warning/15 text-warning"><ShieldAlert className="size-3" /> Missing perms</Badge>
                      ) : (
                        <Badge className="gap-1 bg-success/15 text-success"><Check className="size-3" /> Installed</Badge>
                      )
                    ) : (
                      <Badge variant="secondary" className="text-muted-foreground">Not installed</Badge>
                    )}
                    <div className={cn('flex size-5 items-center justify-center rounded-full border', selected === g.id ? 'border-primary bg-primary' : 'border-border')}>
                      {selected === g.id && <Check className="size-3 text-primary-foreground" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button disabled={!selected} onClick={next} className="gap-2">Continue <ChevronRight className="size-4" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Bot className="size-7" />
              </div>
              <h2 className="mt-5 text-xl font-bold">Install TOX in {guild?.name}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Add the TOX bot to your server. It requests only the permissions required for the modules you enable.
              </p>
              {!installed ? (
                <Button onClick={install} disabled={installing} size="lg" className="mt-6 gap-2">
                  {installing ? <Loader2 className="size-5 animate-spin" /> : <Bot className="size-5" />}
                  {installing ? 'Installing…' : 'Invite TOX bot'}
                </Button>
              ) : (
                <div className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
                  <Check className="size-4" /> TOX is now in {guild?.name}
                </div>
              )}
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button disabled={!installed} onClick={next} className="gap-2">Continue <ChevronRight className="size-4" /></Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-success/12 text-success">
                  <ShieldCheck className="size-7" />
                </div>
                <h2 className="mt-5 text-xl font-bold">Permission health check</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">We verified TOX has everything it needs to run smoothly.</p>
              </div>
              <div className="mt-6 space-y-2">
                {[
                  { label: 'Manage Roles', ok: true },
                  { label: 'Manage Channels', ok: true },
                  { label: 'Kick / Ban Members', ok: true },
                  { label: 'Manage Messages', ok: true },
                  { label: 'View Audit Log', ok: !guild?.missingPermissions },
                ].map((p) => (
                  <div key={p.label} className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-4 py-2.5">
                    <span className="text-sm">{p.label}</span>
                    {p.ok ? (
                      <Badge className="gap-1 bg-success/15 text-success"><Check className="size-3" /> Granted</Badge>
                    ) : (
                      <Badge className="gap-1 bg-warning/15 text-warning"><ShieldAlert className="size-3" /> Missing</Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={finish} size="lg" className="gap-2"><PartyPopper className="size-4" /> Go to dashboard</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
