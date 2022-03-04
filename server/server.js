const five = require("johnny-five");
const pixel = require("node-pixel");
const WebSocketServer = require("ws").Server;
const Light = require("./Light");
const PORT = process.env.PORT || 8081;

const board = new five.Board({ port: "/dev/cu.usbmodem11401" });

const wss = new WebSocketServer({
  port: PORT,
});

const lights = [];

const Z_DELTA = 150;
const Y_DELTA = 150;

const populateLights = () => {
  let xPos = -700;
  let zPos = 1500;
  let yPos = 200;

  for (let i = 0; i < 5; i++) {
    zPos = 1500;

    const row = [];
    const isEven = i % 2 === 0;

    for (let j = 0; j < 5; j++) {
      const newId = isEven ? 2 * j + 10 * i : 10 * (i + 1) - 2 * (j + 1);

      const newLight = new Light(xPos, yPos, zPos, newId);

      row.push(newLight);

      zPos += Z_DELTA;
    }
    yPos -= Y_DELTA;

    lights.push(row);
  }
};

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

const handleConnection = (client) => {
  console.log("Connected!");

  client.on("message", (data) => {
    // const lightsOn = [false, false, false, false, false];
    const lightsOn = Array(5)
      .fill(null)
      .map(() => Array(5).fill(false));

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
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 5; col++) {
            let delta = calcDistance(entry, lights[row][col]);

            if (delta < 100) {
              lightsOn[row][col] = true;
            }
          }
        }
      }

      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          const currLight = lights[row][col];

          if (lightsOn[row][col]) {
            currLight.turnOn();
          } else {
            currLight.turnOff();
          }

          if (currLight.on) {
            testStrip.pixel(49 - currLight.id).color("#ffffff");
          } else {
            testStrip.pixel(49 - currLight.id).off();
          }
        }
      }
      testStrip.show();
    }
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
