import Link from "next/link";

type Props = {
  guildId: string;
  active?: string;
};

const items = [
  { label: "Overview", href: "" },
  { label: "Members", href: "members" },
  { label: "Channels", href: "channels" },
  { label: "Roles", href: "roles" },
  { label: "Tickets", href: "tickets" },
  { label: "Logs", href: "logs" },
  { label: "Settings", href: "settings" },
];

export default function Sidebar({ guildId, active = "Overview" }: Props) {
  return (
    <aside style={{ width: 260, background: "#111113", borderRadius: 22, padding: 20, border: "1px solid rgba(255,255,255,.06)" }}>
      <h2 style={{ color: "#fff", fontSize: 22, marginBottom: 24 }}>TOX</h2>

      {items.map((item) => (
        <Link
          key={item.label}
          href={`/dashboard/${guildId}${item.href ? `/${item.href}` : ""}`}
          style={{
            display: "block",
            padding: "14px 18px",
            borderRadius: 14,
            marginBottom: 10,
            textDecoration: "none",
            background: active === item.label ? "linear-gradient(90deg,#7c3aed,#4f46e5)" : "transparent",
            color: "#fff",
            fontWeight: active === item.label ? 700 : 500,
          }}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}