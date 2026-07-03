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
};