// ============================================
//       src/Handles/DatabaseHandler.js
//           MongoDB Connection
// ============================================

const mongoose = require("mongoose");

class DatabaseHandler {
  static async connect(client) {
    try {
      await mongoose.connect(client.config.mongoURI, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log("🗄️  Database connected successfully!");

      mongoose.connection.on("error", (err) => {
        console.error("❌ Database error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️  Database disconnected! Retrying...");
        setTimeout(() => DatabaseHandler.connect(client), 5000);
      });

    } catch (err) {
      console.warn("⚠️  Database connection failed (continuing without DB):", err.message);
      // Bot will still work without database
    }
  }
}

module.exports = DatabaseHandler;
