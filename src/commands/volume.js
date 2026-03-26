// ============================================
//         src/commands/volume.js
// ============================================

const { EmbedBuilder } = require("discord.js");
const { checkVoice, errorEmbed, successEmbed } = require("../Functions/Utils");

module.exports = {
  name: "volume",
  aliases: ["vol", "v"],
  description: "Set or check the player volume",
  usage: "volume [0-150]",
  cooldown: 2,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });

    // Show current volume if no args
    if (!args.length) {
      const bar  = volumeBar(player.volume);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colors.info)
            .setTitle("🔊 Current Volume")
            .setDescription(`${bar}\n**${player.volume}%**`)
        ]
      });
    }

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    const vol = parseInt(args[0]);
    if (isNaN(vol)) return message.reply({ embeds: [errorEmbed(client, "Please provide a valid number!")] });

    const max = client.config.music.maxVolume;
    if (vol < 0 || vol > max) {
      return message.reply({ embeds: [errorEmbed(client, `Volume must be between **0** and **${max}**!`)] });
    }

    player.setVolume(vol);

    const bar   = volumeBar(vol);
    const emoji = vol === 0 ? "🔇" : vol < 50 ? "🔈" : vol < 100 ? "🔉" : "🔊";

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colors.success)
          .setTitle(`${emoji} Volume Updated`)
          .setDescription(`${bar}\n**${vol}%**`)
      ]
    });
  },
};

function volumeBar(vol, length = 15) {
  const filled = Math.round((vol / 150) * length);
  return "█".repeat(Math.min(filled, length)) + "░".repeat(Math.max(length - filled, 0));
}
