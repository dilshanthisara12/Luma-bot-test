// ============================================
//          src/commands/loop.js
// ============================================

const { checkVoice, errorEmbed, successEmbed } = require("../Functions/Utils");

module.exports = {
  name: "loop",
  aliases: ["repeat", "lp"],
  description: "Toggle loop mode (off / track / queue)",
  cooldown: 2,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    // Cycle: 0 (off) → 1 (track) → 2 (queue) → 0
    const next = (player.loop + 1) % 3;
    player.setLoop(next);

    const modes = [
      "❌ Loop **disabled**",
      "🔂 Looping **current track**",
      "🔁 Looping **entire queue**",
    ];

    return message.reply({ embeds: [successEmbed(client, modes[next])] });
  },
};
