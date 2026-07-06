"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  guildId: string;
  channels: any[];
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Text", value: "0" },
  { label: "Voice", value: "2" },
  { label: "Categories", value: "4" },
  { label: "Announcement", value: "5" },
  { label: "Stage", value: "13" },
  { label: "Forum", value: "15" },
];

function getChannelMeta(type: number) {
  switch (type) {
    case 0:
      return { icon: "#", label: "Text", color: "#60a5fa" };
    case 2:
      return { icon: "🔊", label: "Voice", color: "#22c55e" };
    case 4:
      return { icon: "📁", label: "Category", color: "#a78bfa" };
    case 5:
      return { icon: "📢", label: "Announcement", color: "#f59e0b" };
    case 13:
      return { icon: "🎤", label: "Stage", color: "#fb7185" };
    case 15:
      return { icon: "💬", label: "Forum", color: "#38bdf8" };
    default:
      return { icon: "❔", label: "Unknown", color: "#9ca3af" };
  }
}

export default function ChannelsManager({ guildId, channels }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("text");
  const [parentId, setParentId] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = channels.filter((c) => c.type === 4);

  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const matchesSearch = channel.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || String(channel.type) === filter;

      return matchesSearch && matchesFilter;
    });
  }, [channels, search, filter]);

  const counts = {
    total: channels.length,
    text: channels.filter((c) => c.type === 0).length,
    voice: channels.filter((c) => c.type === 2).length,
    categories: channels.filter((c) => c.type === 4).length,
  };

  async function createChannel() {
    if (!newName.trim()) {
      alert("اكتب اسم القناة");
      return;
    }

    setCreating(true);

    const response = await fetch("http://localhost:3002/channels/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId,
        name: newName.trim(),
        type: newType,
        parentId: parentId || null,
      }),
    });

    const data = await response.json();
    setCreating(false);

    if (!data.success) {
      alert(data.error || "Failed to create channel");
      return;
    }

    setShowCreate(false);
    setNewName("");
    setNewType("text");
    setParentId("");

    router.refresh();
  }

  async function deleteChannel(channelId: string, channelName: string) {
    const ok = confirm(`Delete channel "${channelName}"?`);

    if (!ok) return;

    setDeletingId(channelId);

    const response = await fetch("http://localhost:3002/channels/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId,
        channelId,
      }),
    });

    const data = await response.json();
    setDeletingId(null);

    if (!data.success) {
      alert(data.error || "Failed to delete channel");
      return;
    }

    router.refresh();
  }

  return (
    <>
      <div className="channels-manager-v2">
        <div className="channels-hero">
          <div>
            <p>Discord Channels</p>
            <h1>Channels Manager</h1>
            <span>
              Manage text, voice, categories, permissions, and structure.
            </span>
          </div>

          <button
            className="channels-create-btn"
            onClick={() => setShowCreate(true)}
          >
            + Create Channel
          </button>
        </div>

        <div className="channels-mini-stats">
          <div>
            <strong>{counts.total}</strong>
            <span>Total Channels</span>
          </div>

          <div>
            <strong>{counts.text}</strong>
            <span>Text Channels</span>
          </div>

          <div>
            <strong>{counts.voice}</strong>
            <span>Voice Channels</span>
          </div>

          <div>
            <strong>{counts.categories}</strong>
            <span>Categories</span>
          </div>
        </div>

        <div className="channels-toolbar">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels..."
          />

          <div className="channels-filters">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={filter === item.value ? "active" : ""}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="channels-table-card">
          <table className="channels-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Type</th>
                <th>Position</th>
                <th>Parent</th>
                <th>ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredChannels.map((channel) => {
                const meta = getChannelMeta(channel.type);

                return (
                  <tr key={channel.id}>
                    <td>
                      <div className="channel-name-cell">
                        <span
                          className="channel-type-icon"
                          style={{
                            background: `${meta.color}22`,
                            color: meta.color,
                          }}
                        >
                          {meta.icon}
                        </span>

                        <div>
                          <strong>{channel.name}</strong>
                          <p>{meta.label} Channel</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className="channel-pill"
                        style={{
                          color: meta.color,
                          borderColor: `${meta.color}55`,
                        }}
                      >
                        {meta.label}
                      </span>
                    </td>

                    <td>#{channel.position}</td>

                    <td>{channel.parentId || "No Category"}</td>

                    <td>
                      <code>{channel.id}</code>
                    </td>

                    <td>
                      <div className="channel-actions">
                        <Link href={`/dashboard/${guildId}/channels/${channel.id}`}>
                          Edit
                        </Link>

                        <Link href={`/dashboard/${guildId}/channels/${channel.id}`}>
                          Permissions
                        </Link>

                        <button
                          onClick={() => deleteChannel(channel.id, channel.name)}
                          disabled={deletingId === channel.id}
                        >
                          {deletingId === channel.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredChannels.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="channels-empty">No channels found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div className="tox-modal-overlay">
          <div className="tox-modal">
            <h2>Create Channel</h2>
            <p>Create a new Discord channel from TOX Dashboard.</p>

            <label>
              Channel Name
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="channel-name"
              />
            </label>

            <label>
              Channel Type
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              >
                <option value="text">Text Channel</option>
                <option value="voice">Voice Channel</option>
                <option value="category">Category</option>
              </select>
            </label>

            {newType !== "category" && (
              <label>
                Category
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <option value="">No Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="tox-modal-actions">
              <button
                onClick={() => setShowCreate(false)}
                className="tox-modal-cancel"
              >
                Cancel
              </button>

              <button onClick={createChannel} disabled={creating}>
                {creating ? "Creating..." : "Create Channel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}