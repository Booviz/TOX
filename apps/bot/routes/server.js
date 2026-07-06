module.exports = (app, client) => {
  app.get("/", (req, res) => {
    res.send("TOX Bot API Online");
  });

  app.get("/server", async (req, res) => {
    try {
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

      const membersCache = guild.members.cache;
      const channelsCache = guild.channels.cache;

      const botCount = membersCache.filter((m) => m.user.bot).size;
      const userCount = membersCache.filter((m) => !m.user.bot).size;

      const textChannels = channelsCache.filter((c) => c.type === 0).size;
      const voiceChannels = channelsCache.filter((c) => c.type === 2).size;
      const categories = channelsCache.filter((c) => c.type === 4).size;

      const emojis = guild.emojis.cache.size;
      const stickers = guild.stickers?.cache?.size || 0;

      const owner = await guild.fetchOwner().catch(() => null);

      res.json({
        guildId: guild.id,
        name: guild.name,
        icon: guild.iconURL({ extension: "png", size: 256 }),
        banner: guild.bannerURL
          ? guild.bannerURL({ extension: "png", size: 1024 })
          : null,

        owner: owner
          ? {
              id: owner.id,
              username: owner.user.username,
              displayName: owner.displayName,
              avatar: owner.user.displayAvatarURL({
                extension: "png",
                size: 128,
              }),
            }
          : null,

        members: guild.memberCount,
        users: userCount,
        bots: botCount,

        roles: guild.roles.cache.size,
        channels: channelsCache.size,
        textChannels,
        voiceChannels,
        categories,

        emojis,
        stickers,

        boosts: guild.premiumSubscriptionCount || 0,
        boostLevel: guild.premiumTier || 0,

        verificationLevel: guild.verificationLevel,
        features: guild.features || [],

        createdAt: guild.createdAt,
        createdTimestamp: guild.createdTimestamp,

        ping: Math.round(client.ws.ping),
        botStatus: "Online",

        uptimeSeconds: Math.floor(process.uptime()),
        memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      });
    } catch (error) {
      console.error("Server route error:", error);

      return res.status(500).json({
        error: error.message || "Failed to load server data",
      });
    }
  });
};