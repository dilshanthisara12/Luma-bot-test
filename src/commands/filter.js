// ============================================
//         src/commands/filter.js
// ============================================

const { EmbedBuilder } = require("discord.js");
const { checkVoice, errorEmbed, successEmbed } = require("../Functions/Utils");

const FILTERS = {
  reset:      { label: "Reset",       emoji: "🔄", desc: "Remove all filters"        },
  bassboost:  { label: "Bass Boost",  emoji: "🔈", desc: "Heavy bass enhancement"    },
  nightcore:  { label: "Nightcore",   emoji: "🌙", desc: "Faster + higher pitch"     },
  vaporwave:  { label: "Vaporwave",   emoji: "🌊", desc: "Slower + lower pitch"      },
  "8d":       { label: "8D Audio",    emoji: "🎧", desc: "Rotating 8D effect"        },
  tremolo:    { label: "Tremolo",     emoji: "〰️", desc: "Rapid volume oscillation"  },
  vibrato:    { label: "Vibrato",     emoji: "🎵", desc: "Rapid pitch oscillation"   },
  karaoke:    { label: "Karaoke",     emoji: "🎤", desc: "Reduce center vocals"      },
  soft:       { label: "Soft",        emoji: "🌸", desc: "Soft low-pass EQ"          },
  pop:        { label: "Pop",         emoji: "🎶", desc: "Pop music EQ boost"        },
};

module.exports = {
  name: "filter",
  aliases: ["fx", "effect", "filters"],
  description: "Apply an audio filter",
  usage: "filter <name>",
  cooldown: 3,

  async execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply({ embeds: [errorEmbed(client, "Nothing is playing!")] });

    const voiceError = checkVoice(message, player);
    if (voiceError) return message.reply({ embeds: [errorEmbed(client, voiceError)] });

    // Show filter list if no args
    if (!args.length) {
      const list = Object.entries(FILTERS)
        .map(([key, val]) => `${val.emoji} \`${key}\` — ${val.desc}`)
        .join("\n");

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colors.info)
            .setTitle("🎛️ Available Filters")
            .setDescription(list)
            .setFooter({ text: "Usage: !filter <name>" })
        ]
      });
    }

    const filterName = args[0].toLowerCase();
    if (!FILTERS[filterName]) {
      return message.reply({
        embeds: [errorEmbed(client, `Unknown filter! Use \`!filter\` to see all available filters.`)]
      });
    }

    try {
      switch (filterName) {
        case "reset":
          player.filters.resetFilters();
          break;

        case "bassboost":
          player.filters.setEqualizer([
            { band: 0, gain: 0.65 },
            { band: 1, gain: 0.65 },
            { band: 2, gain: 0.65 },
            { band: 3, gain: 0.40 },
            { band: 4, gain: 0.20 },
            { band: 5, gain: 0.0  },
            { band: 6, gain: -0.05 },
          ]);
          break;

        case "nightcore":
          player.filters.setTimescale({ speed: 1.25, pitch: 1.25, rate: 1.0 });
          break;

        case "vaporwave":
          player.filters.setTimescale({ speed: 0.80, pitch: 0.80, rate: 1.0 });
          break;

        case "8d":
          player.filters.setRotation({ rotationHz: 0.2 });
          break;

        case "tremolo":
          player.filters.setTremolo({ frequency: 4.0, depth: 0.75 });
          break;

        case "vibrato":
          player.filters.setVibrato({ frequency: 4.0, depth: 0.75 });
          break;

        case "karaoke":
          player.filters.setKaraoke({
            level: 1.0,
            monoLevel: 1.0,
            filterBand: 220.0,
            filterWidth: 100.0,
          });
          break;

        case "soft":
          player.filters.setEqualizer([
            { band: 0, gain: 0   },
            { band: 1, gain: 0   },
            { band: 2, gain: 0   },
            { band: 3, gain: 0   },
            { band: 4, gain: 0   },
            { band: 5, gain: -0.05 },
            { band: 6, gain: -0.1  },
            { band: 7, gain: -0.1  },
            { band: 8, gain: -0.1  },
            { band: 9, gain: -0.1  },
          ]);
          break;

        case "pop":
          player.filters.setEqualizer([
            { band: 0, gain: 0.2  },
            { band: 1, gain: 0.2  },
            { band: 2, gain: 0.1  },
            { band: 3, gain: 0.0  },
            { band: 4, gain: -0.05},
            { band: 5, gain: -0.1 },
            { band: 6, gain: -0.1 },
          ]);
          break;
      }

      await player.filters.apply();

      const f = FILTERS[filterName];
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colors.success)
            .setDescription(`${f.emoji} **${f.label}** filter applied!\n${f.desc}`)
        ]
      });

    } catch (err) {
      console.error("Filter error:", err);
      return message.reply({ embeds: [errorEmbed(client, "Failed to apply filter. Try again.")] });
    }
  },
};
