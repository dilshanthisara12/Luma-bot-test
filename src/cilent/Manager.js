// ============================================
//          src/cilent/Manager.js
//      Handles Loading & Bot Startup
// ============================================

const BotClient = require("./Index");
const HandleLoader = require("../Handles/HandleLoader");
const DatabaseHandler = require("../Handles/DatabaseHandler");
const MoonlinkEvents = require("../Handles/MoonlinkEvents");

const client = new BotClient();

async function start() {
  console.log("╔════════════════════════════════╗");
  console.log("║      🎵 Music Bot Starting     ║");
  console.log("╚════════════════════════════════╝\n");

  try {
    // 1. Load Commands
    HandleLoader.loadCommands(client);

    // 2. Load Events
    HandleLoader.loadEvents(client);

    // 3. Setup Moonlink Events
    MoonlinkEvents.setup(client);

    // 4. Connect Database
    await DatabaseHandler.connect(client);

    // 5. Login to Discord
    await client.login(client.config.token);

    console.log("\n✅ Bot started successfully!\n");
  } catch (error) {
    console.error("❌ Failed to start bot:", error);
    process.exit(1);
  }
}

// Handle unhandled errors
process.on("unhandledRejection", (error) => {
  console.error("⚠️  Unhandled Promise Rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("⚠️  Uncaught Exception:", error);
});

start();

module.exports = client;
