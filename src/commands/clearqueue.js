// ============================================
//       src/commands/clearqueue.js
// ============================================

const { checkVoice, errorEmbed, successEmbed } = require("../Functions/Utils");

module.exports = {
  name: "clearqueue",
  aliases: ["cq", "clear"],
  description: "Clear all tracks from the queue",
  cooldown: 3,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    if (player.queue.size === 0) {
      return message.reply({ embeds: [errorEmbed(client, "The queue is already empty!")] });
    }

    const count = player.queue.size;
    player.queue.clear();

    return message.reply({
      embeds: [successEmbed(client, `🗑️ Cleared **${count}** tracks from the queue.`)]
    });
  },
};
