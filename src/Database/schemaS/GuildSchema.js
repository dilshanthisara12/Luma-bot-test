// ============================================
//      src/Database/schemaS/GuildSchema.js
//           Guild Settings Schema
// ============================================

const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema(
  {
    guildId: {
      type: String,
      required: true,
      unique: true,
    },

    // Music Settings
    prefix: {
      type: String,
      default: "!",
    },

    volume: {
      type: Number,
      default: 80,
      min: 0,
      max: 150,
    },

    djRole: {
      type: String,
      default: null,
    },

    musicChannel: {
      type: String,
      default: null,
    },

    autoPlay: {
      type: Boolean,
      default: true,
    },

    // Loop mode: 0 = off, 1 = track, 2 = queue
    loop: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Static method to get or create guild settings
GuildSchema.statics.getOrCreate = async function (guildId) {
  let guild = await this.findOne({ guildId });
  if (!guild) {
    guild = await this.create({ guildId });
  }
  return guild;
};

module.exports = mongoose.model("Guild", GuildSchema);
