"use client";

type Props = {
  guildId: string;
  channelId: string;
};

export default function ChannelActions({ guildId, channelId }: Props) {
  async function deleteChannel() {
    const ok = confirm("Are you sure you want to delete this channel?");
    if (!ok) return;

    await fetch("http://localhost:3002/channels/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guildId, channelId }),
    });

    window.location.href = `/dashboard/${guildId}/channels`;
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ marginBottom: 12 }}>Danger Zone</h3>

      <button
        onClick={deleteChannel}
        style={{
          padding: "12px 18px",
          borderRadius: 12,
          border: "none",
          background: "#dc2626",
          color: "#fff",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Delete Channel
      </button>
    </div>
  );
}