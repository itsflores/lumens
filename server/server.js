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
const backLights = [];

const Z_DELTA = 150;
const Y_DELTA = 150;

let LEDStrip = null;

const calcDistance = (pointA, pointB) =>
  Math.abs(
    Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y, pointB.z - pointA.z)
  );

const calc2dDistance = (pointA, pointB) =>
  Math.abs(Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y));

const lightsOn = Array(5)
  .fill(null)
  .map(() => Array(5).fill(false));

const backLightsOn = Array(5)
  .fill(null)
  .map(() => Array(20).fill(false));

const resetLightsOn = () => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      lightsOn[row][col] = false;
    }
  }
};

const resetBackLightsOn = () => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 20; col++) {
      backLightsOn[row][col] = false;
    }
  }
};

const populateLights = () => {
  // let xPos = -700;
  let xPos = 700;
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

const populateBackLights = () => {
  // let xPos = -700;
  let SHORT_DELTA_X = 60;
  let SHORT_DELTA_Y = 10;

  let xPos = 600;
  let zPos = 0;
  let yPos = 200;

  for (let i = 0; i < 5; i++) {
    xPos = 600;

    const row = [];
    const isEven = i % 2 === 0;

    for (let j = 0; j < 20; j++) {
      const newId = isEven ? j + 20 * i : 20 * (i + 1) - (j + 1);

      // console.log(`[${i}, ${j}]: ${newId}`);

      const newLight = new Light(xPos, yPos, zPos, newId);

      row.push(newLight);

      xPos -= SHORT_DELTA_X;
    }
    yPos -= SHORT_DELTA_Y;

    backLights.push(row);
  }
};

const handleConnection = (client) => {
  console.log("Connected!");

  client.on("message", (data) => {
    const coordinatesString = data.toString();
    const positionData = JSON.parse(coordinatesString);

    // processSideWalls(positionData);
    processBackWalls(positionData);

    // console.log(positionData);
    // console.log("data length: ", positionData.length);
  });

  client.on("close", () => {
    console.log("Connection lost");
  });
};

const processSideWalls = (positionData) => {
  // resetLightsOn();

  if (positionData.length > 0) {
    const filteredPoints = positionData.filter(
      ({ x, y, z }) => x > 600 && z < 3000
    );

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (!lightsOn[row][col]) {
          for (const entry of filteredPoints) {
            let delta = calcDistance(entry, lights[row][col]);

            if (delta < 50) {
              lightsOn[row][col] = true;
              break;
            }
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
          LEDStrip.pixel(currLight.id).color("#ffffff");
        } else {
          LEDStrip.pixel(currLight.id).off();
        }
      }
    }
    LEDStrip.show();
  }
};

const processBackWalls = (positionData) => {
  resetBackLightsOn();

  if (positionData.length > 0) {
    const filteredPoints = positionData.filter(({ x, y, z }) => z < 3000);

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 20; col++) {
        if (!backLightsOn[row][col]) {
          for (const entry of filteredPoints) {
            let delta = calc2dDistance(entry, backLights[row][col]);

            if (delta < 50) {
              backLightsOn[row][col] = true;
              break;
            }
          }
        }
      }
    }

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 20; col++) {
        const currLight = backLights[row][col];

        if (backLightsOn[row][col]) {
          currLight.turnOn();
        } else {
          currLight.turnOff();
        }

        if (currLight.on) {
          LEDStrip.pixel(currLight.id).color("#ffffff");
        } else {
          LEDStrip.pixel(currLight.id).off();
        }
      }
    }

    // console.log(backLightsOn);

    LEDStrip.show();
  }
};

// listen for clients
// populateLights();
populateBackLights();
board.on("ready", () => {
  // const strip = pixel.Strip({
  //   board,
  //   contoller: "FIRMATA",
  //   strips: [{ pin: 3, length: 50 }],
  //   gamma: 2.8,
  // });

  const strip = pixel.Strip({
    board,
    contoller: "FIRMATA",
    strips: [{ pin: 3, length: 100 }],
    gamma: 2.8,
  });

  strip.on("ready", () => {
    strip.off();
    LEDStrip = strip;
  });
});

wss.on("connection", handleConnection);
console.log(`Websockets listening on port ${PORT}`);
