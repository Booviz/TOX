import GlassCard from "../ui/GlassCard";

export function AIWidget() {
  return (
    <GlassCard className="tox-ai-widget">
      <div className="ai-left">
        <h3>TOX AI Assistant</h3>
        <p>
          AI is monitoring your Discord community 24/7 and detecting unusual
          activity in real time.
        </p>
      </div>

      <button>Open AI Center</button>
    </GlassCard>
  );
}