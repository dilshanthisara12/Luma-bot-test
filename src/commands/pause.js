// ============================================
//          src/commands/pause.js
// ============================================
const { checkVoice, errorEmbed, successEmbed } = require("../Functions/Utils");

module.exports = {
  name: "pause",
  aliases: ["hold"],
  description: "Pause the current song",
  cooldown: 2,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    if (player.paused) return message.reply({ embeds: [errorEmbed(client, "Already paused!")] });

    player.pause();
    return message.reply({ embeds: [successEmbed(client, "⏸️ Paused the player.")] });
  },
};
