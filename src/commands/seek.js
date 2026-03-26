// ============================================
//          src/commands/seek.js
// ============================================

const { checkVoice, errorEmbed, successEmbed, formatDuration } = require("../Functions/Utils");

module.exports = {
  name: "seek",
  aliases: ["jump", "goto"],
  description: "Seek to a position in the current track",
  usage: "seek <1:30 or 90>",
  cooldown: 2,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player)         return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });
    if (!player.current) return message.reply({ embeds: [errorEmbed(client, "Nothing is currently playing!")] });

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    if (!player.current.isSeekable) {
      return message.reply({ embeds: [errorEmbed(client, "This track cannot be seeked!")] });
    }

    if (!args.length) {
      return message.reply({ embeds: [errorEmbed(client, "Provide a time! e.g. `!seek 1:30` or `!seek 90`")] });
    }

    let ms = 0;
    const input = args[0];

    if (input.includes(":")) {
      const parts = input.split(":").map(Number);
      if (parts.length === 3) {
        ms = (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
      } else {
        ms = (parts[0] * 60 + parts[1]) * 1000;
      }
    } else {
      ms = parseInt(input) * 1000;
    }

    if (isNaN(ms) || ms < 0) {
      return message.reply({ embeds: [errorEmbed(client, "Invalid time format! Use `1:30` or `90`.")] });
    }

    if (ms > player.current.duration) {
      return message.reply({
        embeds: [errorEmbed(client, `Track is only **${formatDuration(player.current.duration)}** long!`)]
      });
    }

    player.seek(ms);
    return message.reply({
      embeds: [successEmbed(client, `Seeked to **${formatDuration(ms)}** / ${formatDuration(player.current.duration)}`)]
    });
  },
};
