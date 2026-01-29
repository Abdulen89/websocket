const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

const server = new WebSocket.Server({ port: PORT });

server.on("connection", (ws) => {
  console.log("Client connected");

  ws.send("Hello from Render WebSocket Server!");

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());
    ws.send("Echo: " + msg.toString());
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket running on port " + PORT);
