module.exports = (app, client) => {
  app.get("/", (req, res) => {
    res.send("TOX Bot API Online");
  });

  app.get("/server", async (req, res) => {
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
    await guild.roles.fetch();

    const textChannels = guild.channels.cache.filter(
      (c) => c.type === 0
    ).size;

    const voiceChannels = guild.channels.cache.filter(
      (c) => c.type === 2
    ).size;

    const categories = guild.channels.cache.filter(
      (c) => c.type === 4
    ).size;

    res.json({
      guildId,
      members: guild.memberCount,
      roles: guild.roles.cache.size,
      channels: guild.channels.cache.size,
      textChannels,
      voiceChannels,
      categories,
      ping: Math.round(client.ws.ping),
      botStatus: "Online",
    });
  });
};