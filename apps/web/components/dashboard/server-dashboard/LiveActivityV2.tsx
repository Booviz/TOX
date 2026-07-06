type Props = {
  stats: any;
};

export default function LiveActivityV2({ stats }: Props) {
  return (
    <div className="server-card">
      <h2>Live Activity</h2>
      <p>Bot Status: {stats.botStatus}</p>
    </div>
  );
}