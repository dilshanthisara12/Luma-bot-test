// ============================================
//         src/commands/shuffle.js
// ============================================

const { checkVoice, errorEmbed, successEmbed } = require("../Functions/Utils");

module.exports = {
  name: "shuffle",
  aliases: ["mix", "sh"],
  description: "Shuffle the current queue",
  cooldown: 3,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    if (player.queue.size < 2) {
      return message.reply({ embeds: [errorEmbed(client, "Need at least 2 tracks in the queue to shuffle!")] });
    }

    player.queue.shuffle();
    return message.reply({ embeds: [successEmbed(client, `🔀 Shuffled **${player.queue.size}** tracks in the queue!`)] });
  },
};
