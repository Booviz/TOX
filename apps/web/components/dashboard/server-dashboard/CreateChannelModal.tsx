"use client";

import { useState } from "react";

type Props = {
  guildId: string;
};

export default function CreateChannelModal({ guildId }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("text");
  const [loading, setLoading] = useState(false);

  async function createChannel() {
    if (!name.trim()) return;

    setLoading(true);

    await fetch("http://localhost:3002/channels/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId,
        name,
        type,
      }),
    });

    setLoading(false);
    window.location.reload();
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12 }}>Create Channel</h3>

      <div style={{ display: "flex", gap: 12 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="channel-name"
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #2d2d2d",
            background: "#171717",
            color: "#fff",
          }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #2d2d2d",
            background: "#171717",
            color: "#fff",
          }}
        >
          <option value="text">Text</option>
          <option value="voice">Voice</option>
        </select>

        <button
          onClick={createChannel}
          disabled={loading}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: "none",
            background: "#7c3aed",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}