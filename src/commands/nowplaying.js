// ============================================
//        src/commands/nowplaying.js
// ============================================

const { EmbedBuilder } = require("discord.js");
const { errorEmbed, formatDuration, progressBar } = require("../Functions/Utils");

module.exports = {
  name: "nowplaying",
  aliases: ["np", "current", "song"],
  description: "Show the currently playing track",
  cooldown: 3,

  execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player)          return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });
    if (!player.current)  return message.reply({ embeds: [errorEmbed(client, "Nothing is currently playing!")] });

    const track    = player.current;
    const position = track.position || 0;
    const duration = track.duration  || 0;

    const bar = progressBar(position, duration, 18);

    const loopText = player.loop === 1
      ? "🔂 Track"
      : player.loop === 2
        ? "🔁 Queue"
        : "Disabled";

    const embed = new EmbedBuilder()
      .setColor(client.config.colors.main)
      .setAuthor({ name: "🎵 Now Playing" })
      .setTitle(track.title)
      .setURL(track.uri)
      .addFields(
        { name: "👤 Artist",    value: track.author || "Unknown",                        inline: true  },
        { name: "🎧 Requested", value: `<@${track.userData?.requester || "Unknown"}>`,   inline: true  },
        { name: "🔁 Loop",      value: loopText,                                         inline: true  },
        {
          name: "⏱️ Progress",
          value: `\`${formatDuration(position)}\` ${bar} \`${formatDuration(duration)}\``,
          inline: false,
        },
        { name: "🔊 Volume",    value: `${player.volume}%`,          inline: true },
        { name: "⏸️ Status",    value: player.paused ? "Paused" : "Playing", inline: true },
        { name: "📊 Queue",     value: `${player.queue.size} tracks`, inline: true },
      )
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

    if (track.artworkUrl) embed.setThumbnail(track.artworkUrl);

    return message.reply({ embeds: [embed] });
  },
};
