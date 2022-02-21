const fs = require("fs");
const WebSocketServer = require("ws").Server;
const Light = require("./Light");
const PORT = process.env.PORT || 8081;
const wss = new WebSocketServer({
  port: PORT,
});

const lights = [];

const calcDistance = (pointA, pointB) =>
  Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y, pointB.z - pointA.z);

const populateLights = () => {
  const num = 8;
  const between = 200;

  let posX = 0;
  let posZ = 1500;
  let posY = 500;

  for (let i = 0; i < num; i++) {
    const newLight = new Light(posX, posY, posZ);
    posZ += between;
    lights.push(newLight);
  }
};

const handleConnection = (client) => {
  console.log("Connected!");

  client.on("message", (data) => {
    const coordinatesString = data.toString();
    const coordinates = coordinatesString.split(",").slice(0, -1);
    const positionData = coordinates.map((coor) => {
      const [x, y, z] = coor.split(":");
      return {
        x: parseInt(x),
        y: parseInt(y),
        z: parseInt(z),
      };
    });

    // console.log(positionData);
    console.log("data length: ", positionData.length);

    if (positionData.length > 0) {
      const filteredPoints = positionData.filter(
        ({ x, y, z }) => x < -600 && y > 0 && z < 3000
      );

      drawLights(filteredPoints);
    }
  });

  client.on("close", () => {
    console.log("Connection lost");
  });
};

const drawLights = (data) => {
  for (const entry of data) {
    const { x, y, z } = entry;

    for (let light of lights) {
      let delta = calcDistance(entry, light);
      if (delta < 50) {
        light.turnOn();
      } else {
        light.turnOff();
      }
    }
  }

  for (let light of lights) {
    light.toString();
  }
};

// listen for clients
populateLights();
wss.on("connection", handleConnection);
console.log(`Websockets listening on port ${PORT}`);
