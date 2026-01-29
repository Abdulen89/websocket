const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

const server = new WebSocket.Server({ port: PORT });

server.on("connection", (ws) => {
  console.log("Client connected");

  ws.send("Hello from Render WebSocket!");

  ws.on("message", (msg) => {
    ws.send("Echo: " + msg.toString());
  });
});

console.log("WebSocket running on port " + PORT);
