"use client"

import {
  BarChart3,
  ClipboardList,
  FileText,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

const stats = [
  {
    label: "Total Forms",
    value: "12",
    note: "+2 this week",
    icon: ClipboardList,
  },
  {
    label: "Total Responses",
    value: "156",
    note: "+18 this week",
    icon: Users,
  },
  {
    label: "Active Forms",
    value: "8",
    note: "66.7% of total",
    icon: ShieldCheck,
  },
  {
    label: "Responses Today",
    value: "24",
    note: "+5 today",
    icon: BarChart3,
  },
]

const recentForms = [
  {
    name: "Staff Application",
    description: "Application for new staff members",
    responses: 42,
    status: "Active",
    updated: "2h ago",
  },
  {
    name: "Community Feedback",
    description: "Collect feedback from members",
    responses: 28,
    status: "Active",
    updated: "5h ago",
  },
  {
    name: "Report User",
    description: "Report rule violations",
    responses: 31,
    status: "Active",
    updated: "1d ago",
  },
  {
    name: "Event Registration",
    description: "Register for community events",
    responses: 15,
    status: "Draft",
    updated: "2d ago",
  },
  {
    name: "Partnership Request",
    description: "Request a partnership",
    responses: 8,
    status: "Closed",
    updated: "3d ago",
  },
]

const templates = [
  {
    title: "Staff Application",
    description: "Application form for new staff members",
  },
  {
    title: "Community Application",
    description: "General application for your community",
  },
  {
    title: "Whitelist Form",
    description: "Server whitelist request form",
  },
  {
    title: "Event Registration",
    description: "Register members for events",
  },
  {
    title: "Custom Form",
    description: "Blank form to create your own",
  },
]

export default function FormsPage() {
  return (
    <div className="space-y-5 p-6">
      <section className="rounded-2xl border border-border bg-gradient-to-r from-card via-card to-primary/20 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                TOX Forms System
              </span>

              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                System Enabled
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Forms</h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Create custom forms, collect responses and manage submissions
              easily.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background/40 px-4 text-sm font-medium hover:bg-muted">
              <RefreshCcw className="size-4" />
              Refresh
            </button>

            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Plus className="size-4" />
              Create Form
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <span className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                  Live
                </span>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                {item.label}
              </p>

              <p className="mt-2 text-2xl font-bold">{item.value}</p>

              <p className="mt-2 text-xs text-emerald-400">{item.note}</p>
            </div>
          )
        })}
      </section>

      <section className="rounded-2xl border border-border bg-card p-2">
        <div className="flex flex-wrap gap-2">
          {["Overview", "Forms", "Responses", "Templates", "Settings"].map(
            (tab, index) => (
              <button
                key={tab}
                className={
                  index === 0
                    ? "rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    : "rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              >
                {tab}
              </button>
            )
          )}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.6fr_0.8fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Forms</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your latest forms and submissions.
              </p>
            </div>

            <button className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
              View All Forms
            </button>
          </div>

          <div className="space-y-3">
            {recentForms.map((form) => (
              <div
                key={form.name}
                className="flex flex-col gap-4 rounded-xl border border-border bg-background/30 p-4 lg:flex-row lg:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">{form.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {form.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Responses</p>
                    <p className="mt-1 font-medium">{form.responses}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                      {form.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Updated</p>
                    <p className="mt-1 font-medium">{form.updated}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Quick Actions</h2>

            <div className="mt-4 space-y-3">
              {[
                "Create New Form",
                "Browse Templates",
                "View Responses",
                "Form Settings",
              ].map((action) => (
                <button
                  key={action}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-background/30 px-4 py-3 text-left hover:bg-muted"
                >
                  <span className="text-sm font-medium">{action}</span>
                  <Plus className="size-4 text-primary" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </div>

              <div>
                <h2 className="font-semibold">Smart Forms</h2>
                <p className="text-xs text-muted-foreground">
                  Build advanced forms with TOX.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-background/30 p-3">
                <p className="text-xs text-muted-foreground">Views</p>
                <p className="mt-1 text-xl font-bold">312</p>
              </div>

              <div className="rounded-xl border border-border bg-background/30 p-3">
                <p className="text-xs text-muted-foreground">Conversion</p>
                <p className="mt-1 text-xl font-bold">50%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Popular Templates</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start quickly using a ready-made form.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {templates.map((template) => (
            <div
              key={template.title}
              className="flex min-h-52 flex-col rounded-2xl border border-border bg-background/30 p-4"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardList className="size-5" />
              </div>

              <h3 className="mt-4 font-semibold">{template.title}</h3>

              <p className="mt-2 flex-1 text-xs leading-5 text-muted-foreground">
                {template.description}
              </p>

              <button className="mt-4 rounded-xl border border-primary/30 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}