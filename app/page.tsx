'use client'

import Link from 'next/link'
import {
  Ticket, Shield, ScrollText, Sparkles, Users, BarChart3, Gift, Trophy,
  Terminal, FileText, Database, Webhook, Check, ArrowRight, Star, Bot, Zap, Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { LandingNav } from '@/components/landing/landing-nav'
import { DashboardPreview } from '@/components/landing/dashboard-preview'
import { ToxLogo } from '@/components/tox/logo'
import { useLocale } from '@/lib/i18n'

const features = [
  { icon: Ticket, title: 'Advanced Tickets', desc: 'Panel builder, categories, questions, SLA, transcripts and automation.' },
  { icon: Shield, title: 'AutoMod & Security', desc: 'Spam, raids, scams and links stopped with escalation and a rule simulator.' },
  { icon: ScrollText, title: 'Unified Logging', desc: 'Every message, member, role and moderation event with before/after diffs.' },
  { icon: Sparkles, title: 'TOX AI Builder', desc: 'Describe what you want in plain language and approve a config plan.' },
  { icon: Trophy, title: 'Leveling', desc: 'Message and voice XP, role rewards, leaderboards and rank cards.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Growth, churn, activity, tickets and moderation with exports.' },
]

const modules = [
  { icon: Ticket, name: 'Tickets' }, { icon: Shield, name: 'AutoMod' }, { icon: ScrollText, name: 'Logs' },
  { icon: Gift, name: 'Welcome' }, { icon: Trophy, name: 'Levels' }, { icon: Users, name: 'Moderation' },
  { icon: Terminal, name: 'Commands' }, { icon: FileText, name: 'Forms' }, { icon: Database, name: 'Backup' },
  { icon: BarChart3, name: 'Analytics' }, { icon: Webhook, name: 'Webhooks' }, { icon: Sparkles, name: 'AI Assistant' },
]

const integrations = ['YouTube', 'Twitch', 'X', 'Google Sheets', 'Stripe', 'GitHub', 'Spotify', 'Reddit']

const stats = [
  { value: '120K+', label: 'Servers managed' },
  { value: '38M+', label: 'Members protected' },
  { value: '4.2M', label: 'Tickets resolved' },
  { value: '99.98%', label: 'Uptime' },
]

const pricing = [
  { name: 'Free', price: '$0', period: '/mo', features: ['1 server', 'Core tickets & logs', 'Basic AutoMod', 'Community support'], cta: 'Start free', highlight: false },
  { name: 'Pro', price: '$9', period: '/mo', features: ['5 servers', 'Full ticketing suite', 'Advanced AutoMod', 'Leveling & welcome cards', 'AI Builder (limited)'], cta: 'Upgrade to Pro', highlight: true },
  { name: 'Business', price: '$29', period: '/mo', features: ['25 servers', 'Unlimited AI Builder', 'Backups & analytics', 'Team roles & audit logs', 'Priority support'], cta: 'Go Business', highlight: false },
  { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited servers', 'SLA & dedicated support', 'SSO & granular roles', 'Custom integrations'], cta: 'Contact sales', highlight: false },
]

const testimonials = [
  { name: 'Aria K.', role: 'Owner, Atlas Community', quote: 'We replaced six bots with TOX. The ticket system alone saved our staff hours every day.' },
  { name: 'Marco D.', role: 'Admin, Nebula Gaming', quote: 'Raid protection is unreal. The AI builder set up our entire AutoMod stack in minutes.' },
  { name: 'Lena P.', role: 'Community Lead', quote: 'The dashboard is gorgeous and fast. Analytics finally make sense to our whole team.' },
]

const faqs = [
  { q: 'Do I need coding knowledge?', a: 'No. Everything is configured visually, and the AI builder turns plain-language requests into ready-to-apply settings.' },
  { q: 'Is TOX safe for my server?', a: 'Yes. All sensitive actions require confirmation, everything is logged in audit trails, and destructive operations are never run automatically.' },
  { q: 'Can I try it for free?', a: 'Absolutely. The Free plan covers one server with core tickets, logging and basic AutoMod. Upgrade any time.' },
  { q: 'Does it support Arabic?', a: 'Fully. TOX ships with complete Arabic and English support including true RTL layouts.' },
  { q: 'Can I migrate from other bots?', a: 'Yes. Import roles and channels via backups, and rebuild automations with the AI builder in minutes.' },
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

export default function LandingPage() {
  const { t } = useLocale()
  const botInviteUrl = createBotInviteUrl()
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] opacity-40"
          style={{ background: 'radial-gradient(600px 300px at 50% 0%, rgba(124,58,237,0.35), transparent 70%)' }}
        />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-5 gap-1.5 border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="size-3.5" /> Now with TOX AI Builder
              </Badge>
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {t('landing.hero.title')}
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {t('landing.hero.sub')}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">

  <Button
    asChild
    size="lg"
    className="
      group
      h-14
      rounded-2xl
      px-8
      text-base
      font-semibold
      bg-gradient-to-r
      from-violet-600
      via-purple-600
      to-fuchsia-600
      border-0
      shadow-[0_12px_35px_rgba(124,58,237,0.35)]
      transition-all
      duration-300
      hover:scale-[1.03]
      hover:-translate-y-0.5
      hover:shadow-[0_18px_45px_rgba(124,58,237,0.55)]
    "
  >
    <a
      href={botInviteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3"
    >
      <Bot className="size-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />

      <span>
        Add TOX to Discord
      </span>

      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  </Button>

  <Button
    asChild
    variant="outline"
    size="lg"
    className="
      group
      h-14
      rounded-2xl
      px-8
      text-base
      font-semibold
      border-white/10
      bg-white/[0.02]
      backdrop-blur-xl
      transition-all
      duration-300
      hover:scale-[1.03]
      hover:-translate-y-0.5
      hover:bg-violet-500/10
      hover:border-violet-500/40
      hover:text-white
    "
  >
    <Link
      href="/servers"
      className="flex items-center gap-3"
    >
      <Zap className="size-5 text-violet-400 transition-transform duration-300 group-hover:scale-110" />

      <span>
        Explore Dashboard
      </span>
    </Link>
  </Button>

</div>
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Check className="size-4 text-success" /> No credit card</span>
                <span className="flex items-center gap-1.5"><Globe className="size-4 text-info" /> Arabic & English</span>
              </div>
            </div>
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-foreground sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Everything your server needs, unified</h2>
          <p className="mt-4 text-pretty text-muted-foreground">One platform, one dashboard, one bill — instead of a dozen disconnected bots.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-border bg-card p-6 transition-colors hover:border-primary/40">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Modular by design</h2>
            <p className="mt-4 text-muted-foreground">Enable only what you need. Every module shares the same clean, fast dashboard.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {modules.map((m) => (
              <div key={m.name} className="flex items-center gap-3 rounded-lg border border-border bg-background/60 p-4 transition-colors hover:border-primary/40">
                <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
                  <m.icon className="size-5" />
                </div>
                <span className="text-sm font-medium">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Connect your favorite tools</h2>
          <p className="mt-4 text-muted-foreground">Notifications, payments and data flow straight into your server.</p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {integrations.map((i) => (
            <span key={i} className="rounded-full border border-border bg-card px-5 py-2.5 text-sm text-muted-foreground">{i}</span>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Simple, scalable pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free, upgrade as your community grows.</p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {pricing.map((p) => (
              <Card
  key={p.name}
  className={`relative flex flex-col overflow-visible p-6 ${
    p.highlight
      ? 'border-primary pt-9 shadow-[0_0_30px_rgba(124,58,237,0.15)]'
      : 'border-border'
  }`}
>
  {p.highlight && (
    <Badge className="absolute left-6 top-0 -translate-y-1/2 border border-violet-400/30 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 text-white shadow-lg">
      Most popular
    </Badge>
  )}
                <h3 className="font-semibold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                </div>
                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full" variant={p.highlight ? 'default' : 'outline'}>
                  <Link href="/billing">{p.cta}</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Loved by community builders</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((tm) => (
            <Card key={tm.name} className="border-border bg-card p-6">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">&ldquo;{tm.quote}&rdquo;</p>
              <div className="mt-5">
                <p className="text-sm font-semibold">{tm.name}</p>
                <p className="text-xs text-muted-foreground">{tm.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-balance text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
          <Accordion className="mt-10">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-start">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden border-primary/30 bg-card p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-50" style={{ background: 'radial-gradient(500px 220px at 50% 0%, rgba(124,58,237,0.35), transparent 70%)' }} />
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Ready to run your server the smart way?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Add TOX to your Discord in under a minute and let the AI builder do the heavy lifting.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <a
                href={botInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Bot className="size-5" />
                {t('landing.cta.add')}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/servers">{t('landing.cta.demo')} <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <ToxLogo />
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">The all-in-one Discord management platform, supercharged with AI.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Modules', 'Pricing', 'Changelog'] },
              { title: 'Resources', links: ['Documentation', 'API', 'Status', 'Community'] },
              { title: 'Company', links: ['About', 'Blog', 'Privacy', 'Terms'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold">{col.title}</p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><span className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">{l}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} TOX Platform. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Not affiliated with Discord Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}