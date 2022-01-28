const fs = require("fs");
const WebSocketServer = require("ws").Server;
const PORT = process.env.PORT || 8081;
const wss = new WebSocketServer({
  port: PORT,
});

const KINECT_WIDTH = 640;
const KINECT_HEIGHT = 480;

const handleConnection = (client) => {
  console.log("Connected!");

  client.on("message", (data) => {
    const coordinatesString = data.toString();
    const coordinates = coordinatesString.split(",").slice(0, -1);
    const positionData = coordinates.map((coor) => {
      const [x, y, z] = coor.split(":");
      return {
        x,
        y,
        z,
      };
    });

    console.log("data length: ", positionData.length);
    console.log(positionData.slice(0, 5));
  });

  client.on("close", () => {
    console.log("Connection lost");
  });

  // reply
  // client.send("hello!");
};

const drawMesh = () => {
  const rows = 48;
  const columns = 80;

  const mesh = Array.from(Array(rows).keys()).fill(
    Array.from(Array(columns).keys()).fill(".")
  );
  const stringMesh = mesh.map((row) => row.join("")).join("\n");

  console.log(stringMesh);
  // fs.writeFileSync('test.txt', mesh);
};

drawMesh();

// listen for clients and handle them:
wss.on("connection", handleConnection);
console.log(`Websockets listening on port ${PORT}`);
