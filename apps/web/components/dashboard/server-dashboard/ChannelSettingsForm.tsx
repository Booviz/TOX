"use client";

import { useState } from "react";

type Props = {
  guildId: string;
  channelId: string;
  channel: {
    name: string;
    topic: string;
    rateLimitPerUser: number;
  };
};

export default function ChannelSettingsForm({
  guildId,
  channelId,
  channel,
}: Props) {
  const [name, setName] = useState(channel.name);
  const [topic, setTopic] = useState(channel.topic ?? "");
  const [slowmode, setSlowmode] = useState(channel.rateLimitPerUser ?? 0);
  const [loading, setLoading] = useState(false);

  async function saveChanges() {
    setLoading(true);

    await fetch("http://localhost:3002/channel/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId,
        channelId,
        name,
        topic,
        slowmode,
      }),
    });

    setLoading(false);
    alert("Channel updated!");
    window.location.reload();
  }

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div>
        <h3>Name</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            marginTop: 10,
            width: "100%",
            background: "#09090b",
            color: "#fff",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #2d2d2d",
          }}
        />
      </div>

      <div>
        <h3>Topic</h3>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="No topic"
          style={{
            marginTop: 10,
            width: "100%",
            background: "#09090b",
            color: "#fff",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #2d2d2d",
          }}
        />
      </div>

      <div>
        <h3>Slowmode</h3>
        <select
          value={slowmode}
          onChange={(e) => setSlowmode(Number(e.target.value))}
          style={{
            marginTop: 10,
            width: "100%",
            background: "#09090b",
            color: "#fff",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #2d2d2d",
          }}
        >
          <option value={0}>Off</option>
          <option value={5}>5 seconds</option>
          <option value={10}>10 seconds</option>
          <option value={30}>30 seconds</option>
          <option value={60}>1 minute</option>
          <option value={300}>5 minutes</option>
          <option value={900}>15 minutes</option>
          <option value={3600}>1 hour</option>
        </select>
      </div>

      <button
        onClick={saveChanges}
        disabled={loading}
        style={{
          padding: "14px 18px",
          borderRadius: 12,
          border: "none",
          background: "#7c3aed",
          color: "#fff",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}