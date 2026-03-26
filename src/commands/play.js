// ============================================
//          src/commands/play.js
// ============================================

const { EmbedBuilder } = require("discord.js");
const { checkVoice, errorEmbed } = require("../Functions/Utils");

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Play a song or add it to the queue",
  usage: "play <song name / URL>",
  cooldown: 3,

  async execute(message, args, client) {
    // Voice check
    const voiceError = checkVoice(message);
    if (voiceError) {
      return message.reply({ embeds: [errorEmbed(client, voiceError)] });
    }

    if (!args.length) {
      return message.reply({ embeds: [errorEmbed(client, "Please provide a song name or URL!")] });
    }

    // Create or get player
    const player = client.manager.players.create({
      guildId: message.guild.id,
      voiceChannelId: message.member.voice.channel.id,
      textChannelId: message.channel.id,
      autoPlay: true,
    });

    await player.connect();

    // Set default volume from settings
    if (!player.playing && !player.paused) {
      player.setVolume(client.config.music.defaultVolume);
    }

    const query = args.join(" ");

    // Loading message
    const loadMsg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colors.info)
          .setDescription(`🔍 Searching for: **${query}**`)
      ]
    });

    try {
      const result = await client.manager.search({
        query,
        requester: message.author.id,
      });

      if (!result.tracks.length) {
        return loadMsg.edit({
          embeds: [errorEmbed(client, "No results found for your query!")]
        });
      }

      switch (result.loadType) {
        case "playlist": {
          player.queue.add(result.tracks);
          if (!player.playing) await player.play();

          loadMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.colors.success)
                .setTitle("📋 Playlist Added")
                .setDescription(`**[${result.playlistInfo.name}](${query})**`)
                .addFields(
                  { name: "🎵 Tracks", value: `${result.tracks.length}`, inline: true },
                  { name: "🎧 Requested by", value: `${message.author}`, inline: true }
                )
            ]
          });
          break;
        }

        case "search":
        case "track": {
          const track = result.tracks[0];
          player.queue.add(track);
          if (!player.playing) await player.play();

          loadMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.colors.success)
                .setTitle("➕ Added to Queue")
                .setDescription(`**[${track.title}](${track.uri})**`)
                .addFields(
                  { name: "👤 Artist",    value: track.author || "Unknown", inline: true },
                  { name: "🎧 Requested", value: `${message.author}`,       inline: true },
                  { name: "📊 Position",  value: player.playing ? `#${player.queue.size}` : "Now", inline: true }
                )
                .setThumbnail(track.artworkUrl || null)
            ]
          });
          break;
        }

        case "empty":
          loadMsg.edit({ embeds: [errorEmbed(client, "No results found!")] });
          break;

        case "error":
          loadMsg.edit({
            embeds: [errorEmbed(client, `Search error: ${result.error || "Unknown"}`)]
          });
          break;
      }

    } catch (err) {
      console.error("Play error:", err);
      loadMsg.edit({ embeds: [errorEmbed(client, "An error occurred while searching.")] });
    }
  },
};
