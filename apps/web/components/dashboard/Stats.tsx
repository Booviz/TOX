import GlassCard from "../ui/GlassCard";

export function Stats() {
  return (
    <section className="tox-stats">

      <GlassCard>
        <p>Servers</p>
        <h2>42</h2>
        <span>+12%</span>
      </GlassCard>

      <GlassCard>
        <p>Tickets</p>
        <h2>128</h2>
        <span>+31%</span>
      </GlassCard>

      <GlassCard>
        <p>Members</p>
        <h2>9.3K</h2>
        <span>+8%</span>
      </GlassCard>

      <GlassCard>
        <p>AI Score</p>
        <h2>99%</h2>
        <span>Excellent</span>
      </GlassCard>

    </section>
  );
}