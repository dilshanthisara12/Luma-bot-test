// ============================================
//          src/commands/skip.js
// ============================================
const { checkVoice, errorEmbed, successEmbed } = require("../Functions/Utils");

module.exports = {
  name: "skip",
  aliases: ["s", "next"],
  description: "Skip the current song",
  cooldown: 2,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    if (!player.current) return message.reply({ embeds: [errorEmbed(client, "Nothing to skip!")] });

    const title = player.current.title;
    player.skip();
    return message.reply({ embeds: [successEmbed(client, `Skipped: **${title}**`)] });
  },
};
