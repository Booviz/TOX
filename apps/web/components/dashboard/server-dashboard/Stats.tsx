type Props = {
  stats: any;
};

export default function Stats({ stats }: Props) {
  const cards = [
  {
    title: "Members",
    value: stats.members,
  },
  {
    title: "Roles",
    value: stats.roles,
  },
  {
    title: "Channels",
    value: stats.channels,
  },
  {
    title: "Text Channels",
    value: stats.textChannels,
  },
  {
    title: "Voice Channels",
    value: stats.voiceChannels,
  },
  {
    title: "Categories",
    value: stats.categories,
  },
  {
    title: "Bot Ping",
    value: `${stats.ping}ms`,
  },
  {
    title: "Bot Status",
    value: stats.botStatus,
  },
];

  return (
    <div className="server-stats">
      {cards.map((card) => (
        <div key={card.title} className="server-stat-card">
          <p>{card.title}</p>
          <h3>{card.value}</h3>
        </div>
      ))}
    </div>
  );
}