// ============================================
//        src/Events/MessageCreate.js
//          Command Dispatcher
// ============================================

const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message, client) {
    // Ignore bots & DMs
    if (message.author.bot) return;
    if (!message.guild)      return;

    const prefix = client.config.prefix;

    // Forward raw voice packets to Moonlink
    // (Also handled in raw event below)

    if (!message.content.startsWith(prefix)) return;

    // Parse command & args
    const args        = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    // Find command (direct or via alias)
    const resolvedName = client.aliases.get(commandName) || commandName;
    const command      = client.commands.get(resolvedName);
    if (!command) return;

    // Cooldown check
    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Map());
    }

    const now        = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownMs = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expiry = timestamps.get(message.author.id) + cooldownMs;
      if (now < expiry) {
        const remaining = ((expiry - now) / 1000).toFixed(1);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colors.warning)
              .setDescription(`⏳ Please wait **${remaining}s** before using \`${command.name}\` again.`)
          ]
        });
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownMs);

    // Execute command
    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(`❌ Error in command '${command.name}':`, error);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colors.error)
            .setDescription("❌ An error occurred while running that command.")
        ]
      }).catch(() => {});
    }
  },
};
