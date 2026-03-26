// ============================================
//         src/commands/remove.js
// ============================================

const { checkVoice, errorEmbed, successEmbed } = require("../Functions/Utils");

module.exports = {
  name: "remove",
  aliases: ["rm", "delete"],
  description: "Remove a track from the queue by position",
  usage: "remove <number>",
  cooldown: 2,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    if (!args.length) {
      return message.reply({ embeds: [errorEmbed(client, "Provide a track number! e.g. `!remove 3`")] });
    }

    const pos = parseInt(args[0]);
    if (isNaN(pos) || pos < 1) {
      return message.reply({ embeds: [errorEmbed(client, "Please provide a valid track number!")] });
    }

    if (pos > player.queue.size) {
      return message.reply({
        embeds: [errorEmbed(client, `Only **${player.queue.size}** tracks in the queue!`)]
      });
    }

    const tracks = player.queue.tracks;
    const track  = tracks[pos - 1];

    player.queue.remove(pos - 1);

    return message.reply({
      embeds: [successEmbed(client, `Removed **${track.title}** from position **#${pos}**`)]
    });
  },
};
