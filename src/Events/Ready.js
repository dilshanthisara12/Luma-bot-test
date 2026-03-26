// ============================================
//          src/Events/Ready.js
//     Fires when bot logs in successfully
// ============================================

const { ActivityType } = require("discord.js");

module.exports = {
  name: "clientReady",
  once: true,

  async execute(client) {
    console.log(`\n🤖 Logged in as: ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guilds`);

    // Set bot activity
    client.user.setPresence({
      activities: [
        {
          name: client.config.activity.name,
          type: ActivityType.Listening,
        },
      ],
      status: "online",
    });

    // Initialize Moonlink Manager
    try {
      await client.manager.init(client.user.id);
      console.log("🎵 Moonlink Manager initialized!\n");
    } catch (err) {
      console.error("❌ Moonlink init failed:", err);
    }
  },
};
