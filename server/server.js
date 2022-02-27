const five = require("johnny-five");
const pixel = require("node-pixel");
const WebSocketServer = require("ws").Server;
const Light = require("./Light");
const PORT = process.env.PORT || 8081;

const board = new five.Board({ port: "/dev/cu.usbmodem1301" });

const wss = new WebSocketServer({
  port: PORT,
});

const lights = [];

const testLight = new Light(-700, 0, 1500);
let testStrip = null;

const calcDistance = (pointA, pointB) =>
  Math.abs(
    Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y, pointB.z - pointA.z)
  );

const populateLights = () => {
  const num = 8;
  const between = 200;

  let posX = -610;
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

    console.log(positionData);
    console.log("data length: ", positionData.length);

    if (positionData.length > 0) {
      const filteredPoints = positionData.filter(
        ({ x, y, z }) => x < -600 && z < 3000
      );

      for (const entry of filteredPoints) {
        let delta = calcDistance(entry, testLight);

        if (delta < 200) {
          testLight.turnOn();
        }
      }

      // drawLights(filteredPoints);
    } else {
      testLight.turnOff();
    }

    if (testLight.on) {
      testStrip.color("#fff");
      testStrip.show();
    } else {
      testStrip.off();
    }

    console.log(`test light is ${testLight.toString()}`);
  });

  client.on("close", () => {
    console.log("Connection lost");
  });
};

const drawLights = (data) => {
  for (const entry of data) {
    const { x, y, z } = entry;

    for (let i in lights) {
      let delta = calcDistance(entry, lights[i]);

      if (delta < 500) {
        console.log(delta);
      }

      if (delta < 100) {
        lights[i].turnOn();
      } else {
        lights[i].turnOff();
      }
    }
  }

  for (let light of lights) {
    light.toString();
  }
};

// listen for clients
populateLights();
board.on("ready", () => {
  const strip = pixel.Strip({
    board,
    contoller: "FIRMATA",
    strips: [{ pin: 3, length: 16 }],
    gamma: 2.8,
  });

  strip.on("ready", () => {
    testStrip = strip;
  });
});

wss.on("connection", handleConnection);
console.log(`Websockets listening on port ${PORT}`);
