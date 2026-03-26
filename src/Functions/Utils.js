// ============================================
//          src/Functions/Utils.js
//         Common Utility Functions
// ============================================

const { EmbedBuilder } = require("discord.js");

// ── Format milliseconds → m:ss or h:mm:ss ───
function formatDuration(ms) {
  if (!ms || isNaN(ms)) return "0:00";
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours   = Math.floor(ms / (1000 * 60 * 60));

  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// ── Build a progress bar ─────────────────────
function progressBar(current, total, length = 15) {
  if (!total) return "▬".repeat(length);
  const progress = Math.max(0, Math.min(length, Math.round((current / total) * length)));
  return "▬".repeat(progress) + "🔘" + "▬".repeat(length - progress);
}

// ── Quick error embed ────────────────────────
function errorEmbed(client, description) {
  return new EmbedBuilder()
    .setColor(client.config.colors.error)
    .setDescription(`❌ ${description}`);
}

// ── Quick success embed ──────────────────────
function successEmbed(client, description) {
  return new EmbedBuilder()
    .setColor(client.config.colors.success)
    .setDescription(`✅ ${description}`);
}

// ── Quick info embed ─────────────────────────
function infoEmbed(client, description) {
  return new EmbedBuilder()
    .setColor(client.config.colors.info)
    .setDescription(`ℹ️ ${description}`);
}

// ── Check if user is in same VC as bot ───────
function checkVoice(message, player) {
  if (!message.member.voice.channel) {
    return "You need to join a voice channel first!";
  }
  if (player && message.member.voice.channel.id !== player.voiceChannelId) {
    return "You must be in the same voice channel as me!";
  }
  return null;
}

// ── Chunk array into pages ───────────────────
function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

module.exports = {
  formatDuration,
  progressBar,
  errorEmbed,
  successEmbed,
  infoEmbed,
  checkVoice,
  chunk,
};
