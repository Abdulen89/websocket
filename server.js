const WebSocket = require("ws");
const axios = require("axios");

const wss = new WebSocket.Server({ port: 8080 });

console.log("✅ WebSocket running on port 8080");

// 🔥 employeeId => socket
const clients = new Map();

// ================= CONNECTION =================
wss.on("connection", (ws) => {
  console.log("🟢 Client connected");

  ws.on("message", async (msg) => {
    let data;

    try {
      data = JSON.parse(msg.toString());
    } catch {
      console.log("❌ Invalid JSON");
      return;
    }

    console.log("📩 Incoming:", data);

    // ================= REGISTER =================
    if (data.type === "register") {
      const employeeId = data.employeeId;

      clients.set(employeeId, ws);

      console.log("✅ Registered employee:", employeeId);

      ws.send(
        JSON.stringify({
          type: "registered",
          message: "Socket connected successfully",
        })
      );
      return;
    }

    // ================= ADMIN PERMISSION UPDATE =================
    if (data.type === "permission_update") {
      const targetId = data.employeeId;

      console.log("🔐 Permission update for employee:", targetId);

      // 1) PHP DB update
      await axios.post(
        "https://unexcoriated-cohen-uninterlinked.ngrok-free.dev/abdulen/mobile_api/admin/live_permission_update.php",
        data
      );

      console.log("✅ DB updated successfully");

      // 2) Only target employee receives update
      const targetSocket = clients.get(targetId);

      if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
        targetSocket.send(
          JSON.stringify({
            type: "permission_updated",
            permissions: data.permissions,
          })
        );

        console.log("🚀 Sent realtime update to employee:", targetId);
      } else {
        console.log("⚠️ Employee offline:", targetId);
      }
    }
  });

  // ================= DISCONNECT =================
  ws.on("close", () => {
    console.log("🔴 Client disconnected");

    for (const [id, socket] of clients.entries()) {
      if (socket === ws) {
        clients.delete(id);
        console.log("❌ Removed employee:", id);
      }
    }
  });
});
