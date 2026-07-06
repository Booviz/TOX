module.exports = (app, client) => {
  app.get("/channels", async (req, res) => {
    const guildId = req.query.guildId;

    if (!guildId) {
      return res.status(400).json({ error: "guildId required" });
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const channels = guild.channels.cache
      .sort((a, b) => a.rawPosition - b.rawPosition)
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        position: channel.rawPosition,
        parentId: channel.parentId,
      }));

    res.json({ guildId, channels });
  });

  app.post("/channels/delete", async (req, res) => {
    try {
      const { guildId, channelId } = req.body;

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

      await channel.delete("Deleted from TOX Dashboard");

      return res.json({
        success: true,
        channelId,
      });
    } catch (error) {
      console.error("Delete channel error:", error);

      return res.status(500).json({
        error: error.message || "Failed to delete channel",
      });
    }
  });
};