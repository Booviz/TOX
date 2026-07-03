require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  Client,
  GatewayIntentBits,
} = require("discord.js");

const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

require("./routes/server")(app, client);
require("./routes/channels")(app, client);


app.post("/channels/create", async (req, res) => {
  const { guildId, name, type, parentId } = req.body;

  if (!guildId || !name) {
    return res.status(400).json({
      error: "guildId and name required",
    });
  }

  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    return res.status(404).json({
      error: "Guild not found",
    });
  }

  const channel = await guild.channels.create({
    name,
    type: type === "voice" ? 2 : 0,
    parent: parentId || null,
  });

  res.json({
    success: true,
    channel: {
      id: channel.id,
      name: channel.name,
      type: channel.type,
      parentId: channel.parentId,
    },
  });
});

app.post("/channels/rename", async (req, res) => {
  const { guildId, channelId, name } = req.body;

  if (!guildId || !channelId || !name) {
    return res.status(400).json({
      error: "guildId, channelId and name required",
    });
  }

  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    return res.status(404).json({
      error: "Guild not found",
    });
  }

  const channel = guild.channels.cache.get(channelId);

  if (!channel) {
    return res.status(404).json({
      error: "Channel not found",
    });
  }

  await channel.setName(name);

  res.json({
    success: true,
    channel: {
      id: channel.id,
      name: channel.name,
    },
  });
});

app.post("/channels/delete", async (req, res) => {
  const { guildId, channelId } = req.body;

  if (!guildId || !channelId) {
    return res.status(400).json({
      error: "guildId and channelId required",
    });
  }

  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    return res.status(404).json({
      error: "Guild not found",
    });
  }

  const channel = guild.channels.cache.get(channelId);

  if (!channel) {
    return res.status(404).json({
      error: "Channel not found",
    });
  }

  await channel.delete();

  res.json({
    success: true,
  });
});

app.get("/channel", async (req, res) => {
  const { guildId, channelId } = req.query;

  if (!guildId || !channelId) {
    return res.status(400).json({
      error: "guildId and channelId required",
    });
  }

  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    return res.status(404).json({
      error: "Guild not found",
    });
  }

  const channel = guild.channels.cache.get(channelId);

  if (!channel) {
    return res.status(404).json({
      error: "Channel not found",
    });
  }

  res.json({
    id: channel.id,
    name: channel.name,
    type: channel.type,
    topic: channel.topic ?? "",
    nsfw: channel.nsfw ?? false,
    parentId: channel.parentId,
    position: channel.rawPosition,
    rateLimitPerUser: channel.rateLimitPerUser ?? 0,

    permissionOverwrites: channel.permissionOverwrites.cache.map((p) => {
  const role = guild.roles.cache.get(p.id);
  const member = guild.members.cache.get(p.id);

  return {
    id: p.id,
    type: p.type,
    name: role?.name || member?.user.username || "Unknown",
    avatar: member?.user.displayAvatarURL() || null,
    allow: p.allow.toArray(),
    deny: p.deny.toArray(),
     };
   }),
  });
});

app.post("/channel/update", async (req, res) => {
  const { guildId, channelId, name, topic, slowmode } = req.body;

  if (!guildId || !channelId) {
    return res.status(400).json({
      error: "guildId and channelId required",
    });
  }

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    return res.status(404).json({ error: "Guild not found" });
  }

  const channel = guild.channels.cache.get(channelId);
  if (!channel) {
    return res.status(404).json({ error: "Channel not found" });
  }

  if (name) {
    await channel.setName(name);
  }

  if ("topic" in req.body && channel.setTopic) {
    await channel.setTopic(topic || "");
  }

  if ("slowmode" in req.body && channel.setRateLimitPerUser) {
    await channel.setRateLimitPerUser(Number(slowmode) || 0);
  }

  res.json({
    success: true,
  });
});

app.get("/members", async (req, res) => {
  const guildId = req.query.guildId;

  if (!guildId) {
    return res.status(400).json({
      error: "guildId required",
    });
  }

  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    return res.status(404).json({
      error: "Guild not found",
    });
  }

  await guild.members.fetch();

  const members = guild.members.cache
    .filter((member) => !member.user.bot)
    .map((member) => ({
      id: member.id,
      username: member.user.username,
      displayName: member.displayName,
      avatar: member.user.displayAvatarURL({
        extension: "png",
        size: 128,
      }),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  res.json({
    guildId,
    members,
  });
});

app.get("/roles", async (req, res) => {
  const guildId = req.query.guildId;

  if (!guildId) {
    return res.status(400).json({
      error: "guildId required",
    });
  }

  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    return res.status(404).json({
      error: "Guild not found",
    });
  }

  const roles = guild.roles.cache
    .filter((role) => role.name !== "@everyone")
    .sort((a, b) => b.position - a.position)
    .map((role) => ({
      id: role.id,
      name: role.name,
      color: role.hexColor,
      position: role.position,
      members: role.members.size,
      managed: role.managed,
    }));

  res.json({
    guildId,
    roles,
  });
});

const { PermissionFlagsBits } = require("discord.js");

app.get("/permissions", (req, res) => {
  res.json({
    permissions: Object.keys(PermissionFlagsBits),
  });
});

app.post("/channel/permissions/update", async (req, res) => {
  try {
    const { guildId, channelId, targetId, permissions } = req.body;

    if (!guildId || !channelId || !targetId || !permissions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: "Guild not found" });

    const channel = guild.channels.cache.get(channelId);
    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const overwriteData = {};

    for (const [permission, value] of Object.entries(permissions)) {
      if (value === "allow") overwriteData[permission] = true;
      if (value === "deny") overwriteData[permission] = false;
      if (value === "inherit") overwriteData[permission] = null;
    }

    await channel.permissionOverwrites.edit(targetId, overwriteData);

    return res.json({
      success: true,
      targetId,
      updated: overwriteData,
    });
  } catch (error) {
    console.error("Permission update error:", error);
    return res.status(500).json({
      error: error.message || "Failed to update permissions",
    });
  }
});

app.post("/channel/permissions/add-role", async (req, res) => {
  try {
    const { guildId, channelId, roleId } = req.body;

    if (!guildId || !channelId || !roleId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: "Guild not found" });

    const channel = guild.channels.cache.get(channelId);
    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const role = guild.roles.cache.get(roleId);
    if (!role) return res.status(404).json({ error: "Role not found" });

    await channel.permissionOverwrites.edit(roleId, {
      ViewChannel: null,
    });

    return res.json({
      success: true,
      permission: {
        id: role.id,
        type: 0,
        name: role.name,
        avatar: null,
        allow: [],
        deny: [],
      },
    });
  } catch (error) {
    console.error("Add role permission error:", error);
    return res.status(500).json({
      error: error.message || "Failed to add role permission",
    });
  }
});

app.post("/channel/permissions/remove", async (req, res) => {
  try {
    const { guildId, channelId, targetId } = req.body;

    if (!guildId || !channelId || !targetId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: "Guild not found" });

    const channel = guild.channels.cache.get(channelId);
    if (!channel) return res.status(404).json({ error: "Channel not found" });

    await channel.permissionOverwrites.delete(targetId);

    return res.json({ success: true });
  } catch (error) {
    console.error("Remove permission error:", error);
    return res.status(500).json({
      error: error.message || "Failed to remove permission",
    });
  }
});

app.get("/role", async (req, res) => {
  try {
    const { guildId, roleId } = req.query;

    if (!guildId || !roleId) {
      return res.status(400).json({ error: "guildId and roleId required" });
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: "Guild not found" });

    await guild.members.fetch();
    await guild.roles.fetch();

    const role = guild.roles.cache.get(roleId);
    if (!role) return res.status(404).json({ error: "Role not found" });

    const members = role.members.map((member) => ({
      id: member.id,
      username: member.user.username,
      displayName: member.displayName,
      avatar: member.user.displayAvatarURL({ extension: "png", size: 128 }),
    }));

    res.json({
      role: {
        id: role.id,
        name: role.name,
        color: role.hexColor,
        position: role.position,
        members: role.members.size,
        managed: role.managed,
        mentionable: role.mentionable,
        hoist: role.hoist,
        permissions: role.permissions.toArray(),
      },
      members,
    });
  } catch (error) {
    console.error("Get role error:", error);
    res.status(500).json({ error: error.message || "Failed to get role" });
  }
});

app.post("/roles/create", async (req, res) => {
  try {
    const { guildId, name, color } = req.body;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: "Guild not found" });

    const role = await guild.roles.create({
      name: name || "New Role",
      color: color || "#99a1af",
      reason: "Created from TOX dashboard",
    });

    res.json({
      success: true,
      role: {
        id: role.id,
        name: role.name,
        color: role.hexColor,
        position: role.position,
        members: 0,
        managed: role.managed,
      },
    });
  } catch (error) {
    console.error("Create role error:", error);
    res.status(500).json({ error: error.message || "Failed to create role" });
  }
});

app.post("/roles/update", async (req, res) => {
  try {
    const {
      guildId,
      roleId,
      name,
      color,
      hoist,
      mentionable,
      permissions,
    } = req.body;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: "Guild not found" });

    const role = guild.roles.cache.get(roleId);
    if (!role) return res.status(404).json({ error: "Role not found" });

    if (typeof name === "string") await role.setName(name);
    if (typeof color === "string") await role.setColor(color);
    if (typeof hoist === "boolean") await role.setHoist(hoist);
    if (typeof mentionable === "boolean") await role.setMentionable(mentionable);
    if (Array.isArray(permissions)) await role.setPermissions(permissions);

    res.json({ success: true });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: error.message || "Failed to update role" });
  }
});

app.post("/roles/delete", async (req, res) => {
  try {
    const { guildId, roleId } = req.body;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: "Guild not found" });

    const role = guild.roles.cache.get(roleId);
    if (!role) return res.status(404).json({ error: "Role not found" });

    await role.delete("Deleted from TOX dashboard");

    res.json({ success: true });
  } catch (error) {
    console.error("Delete role error:", error);
    res.status(500).json({ error: error.message || "Failed to delete role" });
  }
});

app.post("/roles/clone", async (req, res) => {
  try {
    const { guildId, roleId } = req.body;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: "Guild not found" });

    const role = guild.roles.cache.get(roleId);
    if (!role) return res.status(404).json({ error: "Role not found" });

    const cloned = await guild.roles.create({
      name: `${role.name || "Role"} Copy`,
      color: role.hexColor,
      hoist: role.hoist,
      mentionable: role.mentionable,
      permissions: role.permissions,
      reason: "Cloned from TOX dashboard",
    });

    res.json({
      success: true,
      roleId: cloned.id,
    });
  } catch (error) {
    console.error("Clone role error:", error);
    res.status(500).json({ error: error.message || "Failed to clone role" });
  }
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

app.listen(3002, () => {
  console.log("TOX API running on http://localhost:3002");
});