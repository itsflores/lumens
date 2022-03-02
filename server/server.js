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

const testLights = [
  new Light(-700, 200, 1500),
  new Light(-700, 200, 1650),
  new Light(-700, 200, 1800),
  new Light(-700, 200, 1950),
  new Light(-700, 200, 2100),
];
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
    const lightsOn = [false, false, false, false, false];

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
    // console.log("data length: ", positionData.length);

    if (positionData.length > 0) {
      const filteredPoints = positionData.filter(
        ({ x, y, z }) => x < -600 && z < 3000
      );

      for (const entry of filteredPoints) {
        for (let i in testLights) {
          let delta = calcDistance(entry, testLights[i]);

          if (delta < 100) {
            lightsOn[i] = true;
          }
        }
      }
    }

    for (let i in testLights) {
      if (lightsOn[i]) {
        testLights[i].turnOn();
      } else {
        testLights[i].turnOff();
      }

      if (testLights[i].on) {
        testStrip.pixel(49 - i * 2).color("#ffffff");
      } else {
        testStrip.pixel(49 - i * 2).off();
      }
    }

    testStrip.show();
    // console.log(`test light is ${testLight.toString()}`);
  });

  client.on("close", () => {
    console.log("Connection lost");
  });
};

// listen for clients
populateLights();
board.on("ready", () => {
  const strip = pixel.Strip({
    board,
    contoller: "FIRMATA",
    strips: [{ pin: 3, length: 50 }],
    gamma: 2.8,
  });

  strip.on("ready", () => {
    strip.off();
    testStrip = strip;
  });
});

wss.on("connection", handleConnection);
console.log(`Websockets listening on port ${PORT}`);
