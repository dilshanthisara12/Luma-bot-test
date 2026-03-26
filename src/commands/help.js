// ============================================
//          src/commands/help.js
// ============================================

const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h", "commands", "cmds"],
  description: "Show all available commands",
  cooldown: 5,

  execute(message, args, client) {
    const prefix = client.config.prefix;

    const embed = new EmbedBuilder()
      .setColor(client.config.colors.main)
      .setTitle("🎵 Music Bot — Commands")
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        {
          name: "🎶 Playback",
          value: [
            `\`${prefix}play <song>\` — Play a song or add to queue`,
            `\`${prefix}pause\` — Pause music`,
            `\`${prefix}resume\` — Resume music`,
            `\`${prefix}skip\` — Skip current track`,
            `\`${prefix}stop\` — Stop and disconnect`,
            `\`${prefix}seek <time>\` — Seek to position (e.g. 1:30)`,
          ].join("\n"),
        },
        {
          name: "📋 Queue",
          value: [
            `\`${prefix}queue\` — Show the current queue`,
            `\`${prefix}nowplaying\` — Show current track info`,
            `\`${prefix}shuffle\` — Shuffle the queue`,
            `\`${prefix}remove <#>\` — Remove a track from queue`,
            `\`${prefix}clearqueue\` — Clear entire queue`,
            `\`${prefix}loop\` — Toggle loop (off/track/queue)`,
          ].join("\n"),
        },
        {
          name: "🎛️ Audio",
          value: [
            `\`${prefix}volume [0-150]\` — Set/check volume`,
            `\`${prefix}filter\` — Show audio filters`,
            `\`${prefix}filter <name>\` — Apply an audio filter`,
            `\`${prefix}autoplay\` — Toggle autoplay`,
          ].join("\n"),
        },
        {
          name: "🔧 Misc",
          value: [
            `\`${prefix}join\` — Join your voice channel`,
            `\`${prefix}help\` — Show this help menu`,
          ].join("\n"),
        }
      )
      .setFooter({
        text: `${client.guilds.cache.size} servers | Moonlink v5.2`,
        iconURL: client.user.displayAvatarURL(),
      });

    return message.reply({ embeds: [embed] });
  },
};
