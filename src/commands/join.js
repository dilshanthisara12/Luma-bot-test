// ============================================
//          src/commands/join.js
// ============================================

const { errorEmbed, successEmbed } = require("../Functions/Utils");

module.exports = {
  name: "join",
  aliases: ["connect", "j"],
  description: "Join your voice channel",
  cooldown: 3,

  async execute(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply({ embeds: [errorEmbed(client, "You need to join a voice channel first!")] });
    }

    const existing = client.manager.players.get(message.guild.id);
    if (existing?.voiceChannelId === voiceChannel.id) {
      return message.reply({ embeds: [errorEmbed(client, "I'm already in your voice channel!")] });
    }

    const player = client.manager.players.create({
      guildId: message.guild.id,
      voiceChannelId: voiceChannel.id,
      textChannelId: message.channel.id,
      autoPlay: true,
    });

    await player.connect();
    return message.reply({ embeds: [successEmbed(client, `Joined **${voiceChannel.name}**! 🎶`)] });
  },
};
