// ============================================
//         BOT SETTINGS / CONFIGURATION
// ============================================

module.exports = {
  // Bot Token - Discord Developer Portal eken ganna
  token: process.env.TOKEN || "YOUR_BOT_TOKEN_HERE",

  // Bot Prefix
  prefix: "!",

  // Bot Owner IDs
  owners: ["YOUR_DISCORD_USER_ID"],

  // Bot Status
  activity: {
    name: "🎵 Music | !help",
    type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING
  },

  // Embed Colors
  colors: {
    main: "#5865F2",
    success: "#57F287",
    error: "#ED4245",
    warning: "#FEE75C",
    info: "#00b0f4",
  },

  // Lavalink / NodeLink Config
  nodes: [
    {
      host: "localhost",
      port: 2333,
      password: "youshallnotpass",
      identifier: "Main Node",
      secure: false,
    },
  ],

  // Moonlink Options
  moonlink: {
    options: {
      autoResume: true,
      balancingPlayersByRegion: false,
    },
  },

  // Database (MongoDB)
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/musicbot",

  // Music Settings
  music: {
    defaultVolume: 80,
    maxVolume: 150,
    maxQueueSize: 500,
    leaveOnEmpty: true,
    leaveOnEmptyDelay: 30000, // 30 seconds
    leaveOnEnd: true,
    leaveOnEndDelay: 60000, // 60 seconds
  },

  // Debug Mode
  debug: false,
};
