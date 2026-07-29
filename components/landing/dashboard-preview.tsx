'use client'

import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Ticket, Shield, Users, Activity } from 'lucide-react'
import { messageActivity } from '@/lib/demo-data'

const data = messageActivity(24).map((d) => ({ v: d.messages }))

const kpis = [
  { icon: Users, label: 'Members', value: '48,213', accent: 'text-primary' },
  { icon: Activity, label: 'Messages', value: '82.4K', accent: 'text-info' },
  { icon: Ticket, label: 'Open tickets', value: '37', accent: 'text-success' },
  { icon: Shield, label: 'Blocked', value: '1,204', accent: 'text-warning' },
]

export function DashboardPreview() {
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-2xl shadow-primary/10 sm:p-4">
      <div className="flex items-center gap-1.5 pb-3">
        <span className="size-3 rounded-full bg-destructive/70" />
        <span className="size-3 rounded-full bg-warning/70" />
        <span className="size-3 rounded-full bg-success/70" />
        <span className="ms-3 text-xs text-muted-foreground">app.toxplatform.gg/dashboard</span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-border bg-background/60 p-2 sm:p-3">
            <k.icon className={`size-4 ${k.accent}`} />
            <p className="mt-2 text-sm font-semibold sm:text-lg">{k.value}</p>
            <p className="truncate text-[10px] text-muted-foreground sm:text-xs">{k.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-border bg-background/60 p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium">Message activity</p>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">Last 24 days</span>
        </div>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="prevFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#7c3aed" strokeWidth={2} fill="url(#prevFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
