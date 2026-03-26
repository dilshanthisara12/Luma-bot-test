// ============================================
//          src/commands/queue.js
// ============================================

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { errorEmbed, formatDuration, chunk } = require("../Functions/Utils");

module.exports = {
  name: "queue",
  aliases: ["q", "list"],
  description: "Show the current music queue",
  cooldown: 3,

  async execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });

    if (!player.current && player.queue.size === 0) {
      return message.reply({ embeds: [errorEmbed(client, "The queue is empty!")] });
    }

    const tracks = player.queue.tracks || [];
    const pages  = chunk(tracks, 10);
    let page     = 0;

    const buildEmbed = (pageIndex) => {
      const embed = new EmbedBuilder()
        .setColor(client.config.colors.main)
        .setTitle(`🎵 Music Queue — ${message.guild.name}`)
        .setFooter({
          text: `Page ${pageIndex + 1}/${Math.max(pages.length, 1)} • ${tracks.length} tracks in queue`,
        });

      if (player.current) {
        embed.setDescription(
          `**Now Playing:**\n` +
          `[${player.current.title}](${player.current.uri}) — \`${formatDuration(player.current.duration)}\`` +
          ` | <@${player.current.userData?.requester}>\n\n` +
          (pages.length === 0 ? "*No tracks queued.*" : "**Up Next:**")
        );
      }

      if (pages[pageIndex]) {
        const trackList = pages[pageIndex]
          .map((t, i) => {
            const num = pageIndex * 10 + i + 1;
            return `\`${num}.\` [${t.title}](${t.uri}) — \`${formatDuration(t.duration)}\` | <@${t.userData?.requester}>`;
          })
          .join("\n");

        embed.addFields({ name: "\u200B", value: trackList });
      }

      return embed;
    };

    const buildRow = (pageIndex) =>
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("queue_prev")
          .setLabel("◀ Prev")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(pageIndex === 0),
        new ButtonBuilder()
          .setCustomId("queue_next")
          .setLabel("Next ▶")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(pageIndex >= pages.length - 1)
      );

    const msg = await message.reply({
      embeds: [buildEmbed(page)],
      components: pages.length > 1 ? [buildRow(page)] : [],
    });

    if (pages.length <= 1) return;

    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 60_000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "queue_prev" && page > 0) page--;
      if (interaction.customId === "queue_next" && page < pages.length - 1) page++;

      await interaction.update({
        embeds: [buildEmbed(page)],
        components: [buildRow(page)],
      });
    });

    collector.on("end", () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  },
};
