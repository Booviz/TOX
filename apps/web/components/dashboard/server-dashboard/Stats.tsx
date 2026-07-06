type Props = {
  stats: any;
};

export default function Stats({ stats }: Props) {
  const cards = [
    { icon: "👥", title: "Members", value: stats.members, hint: `${stats.users ?? 0} users • ${stats.bots ?? 0} bots` },
    { icon: "👑", title: "Roles", value: stats.roles, hint: "Server hierarchy" },
    { icon: "💬", title: "Channels", value: stats.channels, hint: `${stats.textChannels} text • ${stats.voiceChannels} voice` },
    { icon: "📝", title: "Text Channels", value: stats.textChannels, hint: "Messages & logs" },
    { icon: "🔊", title: "Voice Channels", value: stats.voiceChannels, hint: "Voice rooms" },
    { icon: "📁", title: "Categories", value: stats.categories, hint: "Channel groups" },
    { icon: "⚡", title: "Bot Ping", value: `${stats.ping}ms`, hint: "Discord gateway" },
    { icon: "🟢", title: "Bot Status", value: stats.botStatus, hint: "Live connection" },
    { icon: "🎭", title: "Emojis", value: stats.emojis ?? 0, hint: "Server emojis" },
    { icon: "🚀", title: "Boosts", value: stats.boosts ?? 0, hint: `Level ${stats.boostLevel ?? 0}` },
    { icon: "💾", title: "Memory", value: `${stats.memoryMB ?? 0} MB`, hint: "Bot usage" },
    { icon: "⏱️", title: "Uptime", value: `${Math.floor((stats.uptimeSeconds ?? 0) / 60)}m`, hint: "Running time" },
  ];

  return (
    <div className="tox-stats-grid">
      {cards.map((card) => (
        <div key={card.title} className="tox-stat-card">
          <div className="tox-stat-icon">{card.icon}</div>

          <div>
            <p>{card.title}</p>
            <h3>{card.value}</h3>
            <span>{card.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}