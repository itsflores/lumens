const five = require("johnny-five");
const pixel = require("node-pixel");
const RBush3D = require("rbush-3d");
const WebSocketServer = require("ws").Server;
const Light = require("./Light");
const PORT = process.env.PORT || 8081;

const board = new five.Board({ port: "/dev/cu.usbmodem11401" });

const wss = new WebSocketServer({
  port: PORT,
});

const tree3d = new RBush3D.RBush3D();

const rightWall = [];
const backLights = [];

const Z_DELTA = 150;
const Y_DELTA = 150;

let LEDStrip = null;

const resetRightWall = () => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      LEDStrip.pixel(rightWall[row][col].id).off();
    }
  }
};

const populateRightWall = () => {
  let Z_ORIGIN = 1500;
  let xPos = 700;
  let zPos = Z_ORIGIN;
  let yPos = 200;

  for (let i = 0; i < 5; i++) {
    zPos = Z_ORIGIN;

    const row = [];
    const isEven = i % 2 === 0;

    for (let j = 0; j < 5; j++) {
      const newId = isEven ? 2 * j + 10 * i : 10 * (i + 1) - 2 * (j + 1);

      const newLight = new Light(xPos, yPos, zPos, newId);

      row.push(newLight);

      zPos += Z_DELTA;
    }
    yPos -= Y_DELTA;

    rightWall.push(row);
  }
};

const populateBackWall = () => {
  let X_ORIGIN = 600;
  let SHORT_DELTA_X = 60;
  let SHORT_DELTA_Y = 10;

  let xPos = X_ORIGIN;
  let zPos = 2800;
  let yPos = 200;

  for (let i = 0; i < 5; i++) {
    xPos = X_ORIGIN;

    const row = [];
    const isEven = i % 2 === 0;

    for (let j = 0; j < 20; j++) {
      const newId = isEven ? j + 20 * i : 20 * (i + 1) - (j + 1);

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

    if (tree3d.all().length > 0) {
      tree3d.clear();
    }

    tree3d.load(positionData);

    processSideWalls();
    // processBackWalls(positionData);

    // console.log(positionData);
    // console.log("data length: ", positionData.length);
  });

  client.on("close", () => {
    console.log("Connection lost");
  });
};

const processSideWalls = () => {
  resetRightWall();

  if (tree3d.all().length > 0) {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (!rightWall[row][col].on) {
          const collision = tree3d.collides(rightWall[row][col].treePosition);

          if (collision) {
            LEDStrip.pixel(rightWall[row][col].id).color("#ffffff");
            break;
          }
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
// populateBackLights();
board.on("ready", () => {
  const strip = pixel.Strip({
    board,
    contoller: "FIRMATA",
    strips: [{ pin: 3, length: 50 }],
    gamma: 2.8,
  });

  // const strip = pixel.Strip({
  //   board,
  //   contoller: "FIRMATA",
  //   strips: [{ pin: 3, length: 100 }],
  //   gamma: 2.8,
  // });

  strip.on("ready", () => {
    strip.off();
    LEDStrip = strip;
    populateRightWall();
  });
});

wss.on("connection", handleConnection);
console.log(`Websockets listening on port ${PORT}`);
