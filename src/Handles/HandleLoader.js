// ============================================
//        src/Handles/HandleLoader.js
//     Loads Commands & Events Dynamically
// ============================================

const fs   = require("fs");
const path = require("path");

class HandleLoader {

  // ── Load All Commands ──────────────────────
  static loadCommands(client) {
    const commandsPath = path.join(__dirname, "../commands");

    if (!fs.existsSync(commandsPath)) {
      console.warn("⚠️  Commands folder not found!");
      return;
    }

    const files = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));
    let loaded  = 0;

    for (const file of files) {
      try {
        const command = require(`${commandsPath}/${file}`);

        if (!command.name) {
          console.warn(`⚠️  Skipping ${file} — missing 'name'`);
          continue;
        }

        client.commands.set(command.name.toLowerCase(), command);

        if (Array.isArray(command.aliases)) {
          for (const alias of command.aliases) {
            client.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
          }
        }

        loaded++;
      } catch (err) {
        console.error(`❌ Failed to load command ${file}:`, err.message);
      }
    }

    console.log(`📂 Commands loaded: ${loaded}/${files.length}`);
  }

  // ── Load All Events ────────────────────────
  static loadEvents(client) {
    const eventsPath = path.join(__dirname, "../Events");

    if (!fs.existsSync(eventsPath)) {
      console.warn("⚠️  Events folder not found!");
      return;
    }

    const files = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));
    let loaded  = 0;

    for (const file of files) {
      try {
        const event = require(`${eventsPath}/${file}`);

        if (!event.name) {
          console.warn(`⚠️  Skipping ${file} — missing 'name'`);
          continue;
        }

        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }

        loaded++;
      } catch (err) {
        console.error(`❌ Failed to load event ${file}:`, err.message);
      }
    }

    console.log(`📂 Events loaded: ${loaded}/${files.length}`);
  }
}

module.exports = HandleLoader;
