// ============================================
//        src/commands/autoplay.js
// ============================================

const { checkVoice, errorEmbed, successEmbed } = require("../Functions/Utils");

module.exports = {
  name: "autoplay",
  aliases: ["ap", "auto"],
  description: "Toggle autoplay mode",
  cooldown: 2,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "No active player!")] });

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    const newState = !player.autoPlay;
    player.setAutoPlay(newState);

    return message.reply({
      embeds: [successEmbed(client, `Autoplay is now **${newState ? "enabled 🟢" : "disabled 🔴"}**`)]
    });
  },
};
