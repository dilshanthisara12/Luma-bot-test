// ============================================
//          src/commands/stop.js
// ============================================
const { checkVoice, errorEmbed, successEmbed } = require("../Functions/Utils");

module.exports = {
  name: "stop",
  aliases: ["dc", "leave", "disconnect"],
  description: "Stop music and clear the queue",
  cooldown: 3,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    player.destroy();
    return message.reply({ embeds: [successEmbed(client, "Stopped playback and left the voice channel.")] });
  },
};
