var WebSocketServer = require("ws").Server;

const wssPort = process.env.PORT || 8081;
const wss = new WebSocketServer({ port: wssPort });
let client = null; // client variable

function handleConnection(client, request) {
  console.log("New Connection");
  client = client;

  function endClient() {
    client = null;
    console.log("connection closed");
  }

  function clientResponse(data) {
    console.log(JSON.parse(data));
  }

  client.on("message", clientResponse);
  client.on("close", endClient);
}

// listen for clients and handle them:
wss.on("connection", handleConnection);
