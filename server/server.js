const WebSocketServer = require("ws").Server;
const PORT = process.env.PORT || 8081;
const wss = new WebSocketServer({
  port: PORT,
});

const handleConnection = (client) => {
  console.log("Connected!");

  client.on("message", (data) => {
    console.log(data.toString());
  });

  client.on("close", () => {
    console.log("Connection lost");
  });

  // reply
  // client.send("hello!");
};

// listen for clients and handle them:
wss.on("connection", handleConnection);
console.log(`Websockets listening on port ${PORT}`);
