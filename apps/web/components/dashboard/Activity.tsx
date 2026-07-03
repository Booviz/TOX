import GlassCard from "../ui/GlassCard";

export function Activity() {
  return (
    <GlassCard className="tox-activity">
      <h3>Recent Activity</h3>

      <div className="activity-list">

        <div className="activity-item">
          <strong>New ticket opened</strong>
          <span>2 min ago</span>
        </div>

        <div className="activity-item">
          <strong>Member verified</strong>
          <span>10 min ago</span>
        </div>

        <div className="activity-item">
          <strong>AI handled report</strong>
          <span>18 min ago</span>
        </div>

        <div className="activity-item">
          <strong>Raid protection activated</strong>
          <span>32 min ago</span>
        </div>

        <div className="activity-item">
          <strong>Backup completed</strong>
          <span>1 hour ago</span>
        </div>

      </div>
    </GlassCard>
  );
}