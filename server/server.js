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
    // console.log(positionData.slice(0, 5));
    if (positionData.length > 0) {
      drawStringMesh(positionData);
    }
  });

  client.on("close", () => {
    console.log("Connection lost");
  });
};

const drawStringMesh = (data) => {
  const rows = 30;
  const columns = 30;

  let mesh = Array.from(Array(rows), () => new Array(columns).fill("."));

  console.log(mesh);

  data.forEach((point) => {
    const x = Math.round(point.x / 10 + rows / 2);
    const y = Math.round((point.y / 10) * -1 + columns / 2);

    if (x > 0 && x < 30 && y > 0 && y < 30) {
      mesh[y][x] = "G";
    }
  });

  const stringMesh = mesh.map((row) => row.join("")).join("\n");
  console.log(stringMesh);
  // fs.writeFileSync('test.txt', mesh);
};

// drawStringMesh([]);

// listen for clients and handle them:
wss.on("connection", handleConnection);
console.log(`Websockets listening on port ${PORT}`);
