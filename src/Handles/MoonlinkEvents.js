// ============================================
//       src/Handles/MoonlinkEvents.js
//        All Moonlink Manager Events
// ============================================

const { EmbedBuilder } = require("discord.js");

class MoonlinkEvents {
  static setup(client) {
    const { manager, config } = client;

    // ── Debug ──────────────────────────────────
    if (config.debug) {
      manager.on("debug", (msg) => {
        console.log(`[Moonlink Debug] ${msg}`);
      });
    }

    // ── Node Events ────────────────────────────
    manager.on("nodeConnect", (node) => {
      console.log(`✅ Lavalink Node [${node.identifier}] connected!`);
    });

    manager.on("nodeDisconnect", (node) => {
      console.warn(`⚠️  Lavalink Node [${node.identifier}] disconnected!`);
    });

    manager.on("nodeError", (node, error) => {
      console.error(`❌ Lavalink Node [${node.identifier}] error:`, error);
    });

    manager.on("nodeReconnect", (node) => {
      console.log(`🔄 Lavalink Node [${node.identifier}] reconnecting...`);
    });

    // ── Track Start ────────────────────────────
    manager.on("trackStart", (player, track) => {
      const channel = client.channels.cache.get(player.textChannelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setColor(config.colors.main)
        .setTitle("🎵 Now Playing")
        .setDescription(`**[${track.title}](${track.uri})**`)
        .addFields(
          { name: "👤 Artist",    value: track.author || "Unknown",       inline: true },
          { name: "⏱️ Duration",  value: formatDuration(track.duration),  inline: true },
          { name: "🎧 Requested", value: `<@${track.userData?.requester || "Unknown"}>`, inline: true }
        )
        .setFooter({ text: `Volume: ${player.volume}% | Queue: ${player.queue.size} tracks` });

      if (track.artworkUrl) embed.setThumbnail(track.artworkUrl);

      channel.send({ embeds: [embed] });
    });

    // ── Track End ──────────────────────────────
    manager.on("trackEnd", (player, track) => {
      // Handled by queueEnd if queue is empty
    });

    // ── Track Error ────────────────────────────
    manager.on("trackError", (player, track, payload) => {
      const channel = client.channels.cache.get(player.textChannelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setColor(config.colors.error)
        .setTitle("❌ Track Error")
        .setDescription(`Failed to play **${track?.title || "Unknown"}**\n\`${payload?.exception?.message || "Unknown error"}\``);

      channel.send({ embeds: [embed] });
    });

    // ── Track Stuck ────────────────────────────
    manager.on("trackStuck", (player, track) => {
      const channel = client.channels.cache.get(player.textChannelId);
      if (channel) {
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.warning)
              .setDescription(`⚠️ Track got stuck, skipping: **${track?.title}**`)
          ]
        });
      }
      player.skip();
    });

    // ── Queue End ──────────────────────────────
    manager.on("queueEnd", (player) => {
      const channel = client.channels.cache.get(player.textChannelId);
      if (channel) {
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.info)
              .setDescription("✅ Queue finished! All songs have been played.")
          ]
        });
      }

      // Auto-leave after delay
      if (config.music.leaveOnEnd) {
        setTimeout(() => {
          if (!player.playing && player.queue.size === 0) {
            player.destroy();
            if (channel) {
              channel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor(config.colors.info)
                    .setDescription("👋 Left the voice channel due to inactivity.")
                ]
              });
            }
          }
        }, config.music.leaveOnEndDelay);
      }
    });

    console.log("🎵 Moonlink events registered!");
  }
}

// ── Helper: Format Duration ──────────────────
function formatDuration(ms) {
  if (!ms) return "0:00";
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours   = Math.floor(ms / (1000 * 60 * 60));
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

module.exports = MoonlinkEvents;
