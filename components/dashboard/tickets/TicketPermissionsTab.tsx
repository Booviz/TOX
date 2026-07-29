"use client"

import {
  FolderOpen,
  ShieldCheck,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  TicketChannelOption,
  TicketPermissionsTabProps,
  TicketRoleOption,
} from "./types"

export default function TicketPermissionsTab({
  channels,
  roles,
  channelSettings,
  permissionSettings,
  onChannelSettingsChange,
  onPermissionSettingsChange,
}: TicketPermissionsTabProps) {
  const textChannels = channels.filter(
    (channel) =>
      channel.type !== "category"
  )

  const categoryChannels =
    channels.filter(
      (channel) =>
        channel.type === "category"
    )

  const selectableRoles =
    roles.filter(
      (role) => !role.managed
    )

  return (
    <div className="space-y-5">
      <Section
        icon={
          <FolderOpen className="size-4" />
        }
        title="Channels"
        description="Choose where the panel is published and where ticket channels are created."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Panel channel"
            description="The text channel where the ticket panel will be sent."
            value={
              channelSettings.panelChannelId
            }
            options={textChannels}
            placeholder="Select panel channel"
            onChange={(
              panelChannelId
            ) =>
              onChannelSettingsChange({
                ...channelSettings,
                panelChannelId,
              })
            }
          />

          <SelectField
            label="Existing ticket channel"
            description="Used only when the panel is configured to reuse one channel."
            value={
              channelSettings.existingTicketChannelId
            }
            options={textChannels}
            placeholder="Select existing channel"
            onChange={(
              existingTicketChannelId
            ) =>
              onChannelSettingsChange({
                ...channelSettings,
                existingTicketChannelId,
              })
            }
          />

        </div>

        <div className="mt-4">
          <Field
            label="Ticket channel name"
            description="Variables such as {ticketNumber}, {username} and {category} are supported."
          >
            <input
              value={
                channelSettings.ticketNameTemplate
              }
              onChange={(event) =>
                onChannelSettingsChange({
                  ...channelSettings,
                  ticketNameTemplate:
                    event.target.value,
                })
              }
              className="ticket-input"
              placeholder="ticket-{ticketNumber}"
            />
          </Field>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <OptionCard
            label="Private by default"
            description="Only the ticket owner and selected staff roles can access the channel."
            enabled={
              channelSettings.privateByDefault
            }
            onClick={() =>
              onChannelSettingsChange({
                ...channelSettings,
                privateByDefault:
                  !channelSettings.privateByDefault,
              })
            }
          />

          <OptionCard
            label="Hide from everyone"
            description="Explicitly deny the @everyone role from viewing ticket channels."
            enabled={
              channelSettings.hideFromEveryone
            }
            onClick={() =>
              onChannelSettingsChange({
                ...channelSettings,
                hideFromEveryone:
                  !channelSettings.hideFromEveryone,
              })
            }
          />

          <OptionCard
            label="Sync category permissions"
            description="Copy permission overwrites from the selected parent category."
            enabled={
              channelSettings.syncCategoryPermissions
            }
            onClick={() =>
              onChannelSettingsChange({
                ...channelSettings,
                syncCategoryPermissions:
                  !channelSettings.syncCategoryPermissions,
              })
            }
          />
        </div>
      </Section>

      <Section
        icon={
          <Users className="size-4" />
        }
        title="Role access"
        description="Choose the roles allowed to manage tickets and transcripts."
      >
        <div className="space-y-5">
          <RoleSelector
            title="Staff roles"
            description="Roles that can view, reply to and manage regular tickets."
            roles={selectableRoles}
            selected={
              permissionSettings.staffRoleIds
            }
            onChange={(
              staffRoleIds
            ) =>
              onPermissionSettingsChange({
                ...permissionSettings,
                staffRoleIds,
              })
            }
          />

          <RoleSelector
            title="Admin roles"
            description="Roles with elevated ticket controls."
            roles={selectableRoles}
            selected={
              permissionSettings.adminRoleIds
            }
            onChange={(
              adminRoleIds
            ) =>
              onPermissionSettingsChange({
                ...permissionSettings,
                adminRoleIds,
              })
            }
          />

          <RoleSelector
            title="Transcript roles"
            description="Roles allowed to access generated ticket transcripts."
            roles={selectableRoles}
            selected={
              permissionSettings.transcriptRoleIds
            }
            onChange={(
              transcriptRoleIds
            ) =>
              onPermissionSettingsChange({
                ...permissionSettings,
                transcriptRoleIds,
              })
            }
          />

          <RoleSelector
            title="Blocked roles"
            description="Members with these roles cannot open tickets."
            roles={selectableRoles}
            selected={
              permissionSettings.blockedRoleIds
            }
            onChange={(
              blockedRoleIds
            ) =>
              onPermissionSettingsChange({
                ...permissionSettings,
                blockedRoleIds,
              })
            }
          />
        </div>
      </Section>

      <Section
        icon={
          <ShieldCheck className="size-4" />
        }
        title="Ticket permissions"
        description="Control which actions users and staff can perform."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <OptionCard
            label="User can close"
            description="Allow the ticket owner to close their own ticket."
            enabled={
              permissionSettings.allowUserClose
            }
            onClick={() =>
              onPermissionSettingsChange({
                ...permissionSettings,
                allowUserClose:
                  !permissionSettings.allowUserClose,
              })
            }
          />

          <OptionCard
            label="User can add members"
            description="Allow the ticket owner to grant another member access."
            enabled={
              permissionSettings.allowUserAddMembers
            }
            onClick={() =>
              onPermissionSettingsChange({
                ...permissionSettings,
                allowUserAddMembers:
                  !permissionSettings.allowUserAddMembers,
              })
            }
          />

          <OptionCard
            label="User can remove members"
            description="Allow the ticket owner to remove added members."
            enabled={
              permissionSettings.allowUserRemoveMembers
            }
            onClick={() =>
              onPermissionSettingsChange({
                ...permissionSettings,
                allowUserRemoveMembers:
                  !permissionSettings.allowUserRemoveMembers,
              })
            }
          />

          <OptionCard
            label="Staff can rename"
            description="Allow staff to rename ticket channels."
            enabled={
              permissionSettings.staffCanRename
            }
            onClick={() =>
              onPermissionSettingsChange({
                ...permissionSettings,
                staffCanRename:
                  !permissionSettings.staffCanRename,
              })
            }
          />

          <OptionCard
            label="Staff can move"
            description="Allow staff to move tickets between categories."
            enabled={
              permissionSettings.staffCanMove
            }
            onClick={() =>
              onPermissionSettingsChange({
                ...permissionSettings,
                staffCanMove:
                  !permissionSettings.staffCanMove,
              })
            }
          />

          <OptionCard
            label="Staff can delete"
            description="Allow staff to permanently delete ticket channels."
            enabled={
              permissionSettings.staffCanDelete
            }
            onClick={() =>
              onPermissionSettingsChange({
                ...permissionSettings,
                staffCanDelete:
                  !permissionSettings.staffCanDelete,
              })
            }
          />

          <OptionCard
            label="Staff can claim"
            description="Allow staff members to claim responsibility for tickets."
            enabled={
              permissionSettings.staffCanClaim
            }
            onClick={() =>
              onPermissionSettingsChange({
                ...permissionSettings,
                staffCanClaim:
                  !permissionSettings.staffCanClaim,
              })
            }
          />
        </div>
      </Section>
    </div>
  )
}

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>

        <div>
          <h2 className="font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  )
}

function Field({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">
        {label}
      </span>

      {description && (
        <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">
          {description}
        </span>
      )}

      <div className="mt-2">
        {children}
      </div>
    </label>
  )
}

function SelectField({
  label,
  description,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string
  description: string
  value: string
  options: TicketChannelOption[]
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <Field
      label={label}
      description={description}
    >
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="ticket-input"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
          >
            {option.parentName
              ? `${option.parentName} / ${option.name}`
              : option.name}
          </option>
        ))}
      </select>
    </Field>
  )
}

function RoleSelector({
  title,
  description,
  roles,
  selected,
  onChange,
}: {
  title: string
  description: string
  roles: TicketRoleOption[]
  selected: string[]
  onChange: (value: string[]) => void
}) {
  function toggleRole(
    roleId: string
  ) {
    const active =
      selected.includes(roleId)

    onChange(
      active
        ? selected.filter(
            (id) => id !== roleId
          )
        : [...selected, roleId]
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold">
        {title}
      </p>

      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
        {description}
      </p>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {roles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground md:col-span-2">
            No Discord roles loaded yet.
          </div>
        ) : (
          roles.map((role) => {
            const active =
              selected.includes(
                role.id
              )

            return (
              <button
                key={role.id}
                type="button"
                onClick={() =>
                  toggleRole(role.id)
                }
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border p-3 text-left text-sm transition",
                  active
                    ? "border-primary bg-primary/[0.08] text-foreground"
                    : "border-border bg-background/30 text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="min-w-0 truncate">
                  {role.name}
                </span>

                <span
                  className={cn(
                    "size-3 shrink-0 rounded-full border",
                    active
                      ? "border-primary bg-primary"
                      : "border-border"
                  )}
                />
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

function OptionCard({
  label,
  description,
  enabled,
  onClick,
}: {
  label: string
  description: string
  enabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-left transition",
        enabled
          ? "border-primary bg-primary/[0.08]"
          : "border-border bg-background/30"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">
          {label}
        </span>

        <span
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition",
            enabled
              ? "bg-primary"
              : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white transition",
              enabled
                ? "left-6"
                : "left-1"
            )}
          />
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </button>
  )
}