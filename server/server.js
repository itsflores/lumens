const five = require("johnny-five");
const pixel = require("node-pixel");
const RBush3D = require("rbush-3d");
const WebSocketServer = require("ws").Server;
const Light = require("./Light");
const PORT = process.env.PORT || 8081;

const board = new five.Board({ port: "/dev/cu.usbmodem1401" });

const wss = new WebSocketServer({
  port: PORT,
});

const tree3d = new RBush3D.RBush3D();

const leftWall = [];
const rightWall = [];
const backWall = [];

const Z_DELTA = 150;
const Y_DELTA = 150;

let LEDStrip = null;

const resetWall = (wall) => {
  for (let row = 0; row < wall.length; row++) {
    for (let col = 0; col < wall[0].length; col++) {
      LEDStrip.pixel(wall[row][col].stripId).off();
      wall[row][col].turnOff();
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

      const newLight = new Light(xPos, yPos, zPos, newId + 100);

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
  let SHORT_DELTA_Y = 100;

  let xPos = X_ORIGIN;
  let zPos = 2800;
  let yPos = 0;

  for (let i = 0; i < 5; i++) {
    xPos = X_ORIGIN;

    const row = [];
    const isEven = i % 2 === 0;

    for (let j = 0; j < 20; j++) {
      const newId = isEven ? j + 20 * i : 20 * (i + 1) - (j + 1);

      const newLight = new Light(xPos, yPos, zPos, newId, true);

      row.push(newLight);

      xPos -= SHORT_DELTA_X;
    }
    yPos -= SHORT_DELTA_Y;

    backWall.push(row);
  }
};

const handleConnection = (client) => {
  console.log("Connected!");

  client.on("message", (data) => {
    const coordinatesString = data.toString();
    const positionData = JSON.parse(coordinatesString);

    // if (tree3d.all().length > 0) {
    tree3d.clear();
    // }

    tree3d.load(positionData);

    // if (tree3d.all().length > 0) {
    processRightWall();
    processBackWall();
    // }

    // console.log(positionData);
    // console.log("data length: ", positionData.length);

    LEDStrip.show();
  });

  client.on("close", () => {
    console.log("Connection lost");
  });
};

const processRightWall = () => {
  resetWall(rightWall);
  updateWallState(rightWall);
};

const processBackWall = () => {
  resetWall(backWall);
  updateWallState(backWall);
};

const updateWallState = (wall) => {
  for (let row = 0; row < wall.length; row++) {
    for (let col = 0; col < wall[0].length; col++) {
      if (!wall[row][col].isOn()) {
        const collision = tree3d.collides(wall[row][col].treePosition);

        if (collision) {
          wall[row][col].turnOn();
          LEDStrip.pixel(wall[row][col].stripId).color("#ffffff");
        }
      }
    }
  }
};

// listen for clients
// populateBackLights();
board.on("ready", () => {
  const strip = pixel.Strip({
    board,
    contoller: "FIRMATA",
    strips: [
      { pin: 3, length: 100 },
      { pin: 7, length: 50 },
    ],
    gamma: 2.8,
  });

  strip.on("ready", () => {
    strip.off();
    LEDStrip = strip;
    populateRightWall();
    populateBackWall();
  });
});

wss.on("connection", handleConnection);
console.log(`Websockets listening on port ${PORT}`);
