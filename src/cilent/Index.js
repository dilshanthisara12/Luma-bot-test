// ============================================
//          src/cilent/Index.js
//       Main Bot Entry Point (Client)
// ============================================

const { Client, GatewayIntentBits, Collection, ActivityType } = require("discord.js");
const { Manager } = require("moonlink.js");
const settings = require("../settings");

class BotClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: false,
      },
    });

    // Collections
    this.commands = new Collection();
    this.aliases  = new Collection();
    this.cooldowns = new Collection();

    // Settings
    this.config = settings;

    // Moonlink Manager
    this.manager = new Manager({
      nodes: settings.nodes,
      options: settings.moonlink?.options,
      send: (guildId, payload) => {
        const guild = this.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
      },
    });
  }
}

module.exports = BotClient;
