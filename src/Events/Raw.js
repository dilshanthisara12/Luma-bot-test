// ============================================
//           src/Events/Raw.js
//   Forward voice packets to Moonlink
// ============================================

module.exports = {
  name: "raw",
  once: false,

  execute(packet, client) {
    // Required for Moonlink to handle voice state/server updates
    client.manager.packetUpdate(packet);
  },
};
