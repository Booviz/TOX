import { cn } from '@/lib/utils'
import { initials } from '@/lib/format'

const statusColor: Record<string, string> = {
  online: 'bg-success',
  idle: 'bg-warning',
  dnd: 'bg-destructive',
  offline: 'bg-muted-foreground',
}

export function DiscordAvatar({
  name,
  color,
  size = 36,
  status,
  className,
}: {
  name: string
  color: string
  size?: number
  status?: string
  className?: string
}) {
  return (
    <span className={cn('relative inline-flex shrink-0', className)} style={{ width: size, height: size }}>
      <span
        className="flex h-full w-full items-center justify-center rounded-full font-semibold text-white"
        style={{ backgroundColor: color, fontSize: size * 0.38 }}
        aria-hidden="true"
      >
        {initials(name)}
      </span>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 end-0 rounded-full ring-2 ring-card',
            statusColor[status] ?? 'bg-muted-foreground',
          )}
          style={{ width: size * 0.3, height: size * 0.3 }}
        />
      )}
    </span>
  )
}
