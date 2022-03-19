const five = require("johnny-five");
const pixel = require("node-pixel");
const RBush3D = require("rbush-3d");
const WebSocketServer = require("ws").Server;
const Light = require("./Light");
const LEDGrid = require("./LEDGrid");

const PORT = process.env.PORT || 8081;
const board = new five.Board({ port: "/dev/cu.usbmodem1401" });
const wss = new WebSocketServer({
  port: PORT,
});
const pointsTree = new RBush3D.RBush3D();

let leftWall = null;
let rightWall = null;
let backWall = null;
let LEDStrip = null;

const populateLeftWall = () => {
  const lights = [];

  const Z_ORIGIN = 1500;
  const Z_DELTA = 150;
  const Y_DELTA = 150;

  let xPos = -700;
  let zPos = Z_ORIGIN;
  let yPos = 200;

  for (let row = 0; row < 5; row++) {
    zPos = Z_ORIGIN;

    const lightsRow = [];
    const isEven = row % 2 === 0;

    for (let col = 0; col < 5; col++) {
      const stripPosition = isEven
        ? 2 * col + 10 * row
        : 10 * (row + 1) - 2 * (col + 1);

      const newLight = new Light(
        xPos,
        yPos,
        zPos,
        LEDStrip.pixel(stripPosition + 150)
      );

      lightsRow.push(newLight);

      zPos += Z_DELTA;
    }
    yPos -= Y_DELTA;

    lights.push(lightsRow);
  }

  leftWall = new LEDGrid(lights);
};

const populateRightWall = () => {
  const lights = [];

  const Z_ORIGIN = 1500;
  const Z_DELTA = 150;
  const Y_DELTA = 150;

  let xPos = 700;
  let zPos = Z_ORIGIN;
  let yPos = 200;

  for (let row = 0; row < 5; row++) {
    zPos = Z_ORIGIN;

    const lightsRow = [];
    const isEven = row % 2 === 0;

    for (let col = 0; col < 5; col++) {
      const stripPosition = isEven
        ? 2 * col + 10 * row
        : 10 * (row + 1) - 2 * (col + 1);

      const newLight = new Light(
        xPos,
        yPos,
        zPos,
        LEDStrip.pixel(stripPosition + 100)
      );

      lightsRow.push(newLight);

      zPos += Z_DELTA;
    }
    yPos -= Y_DELTA;

    lights.push(lightsRow);
  }

  rightWall = new LEDGrid(lights);
};

const populateBackWall = () => {
  const lights = [];

  const X_ORIGIN = 600;
  const DELTA_X = 60;
  const DELTA_Y = 100;

  let xPos = X_ORIGIN;
  let zPos = 2800;
  let yPos = 0;

  for (let row = 0; row < 5; row++) {
    xPos = X_ORIGIN;

    const lightsRow = [];
    const isEven = row % 2 === 0;

    for (let col = 0; col < 20; col++) {
      const stripPosition = isEven
        ? col + 20 * row
        : 20 * (row + 1) - (col + 1);

      const newLight = new Light(
        xPos,
        yPos,
        zPos,
        LEDStrip.pixel(stripPosition),
        true
      );

      lightsRow.push(newLight);

      xPos -= DELTA_X;
    }
    yPos -= DELTA_Y;

    lights.push(lightsRow);
  }

  backWall = new LEDGrid(lights);
};

const handleConnection = (client) => {
  console.log("Connected!");

  client.on("message", (data) => {
    const coordinatesString = data.toString();
    const positionData = JSON.parse(coordinatesString);

    pointsTree.clear();
    pointsTree.load(positionData);

    processRightWall();
    processLeftWall();
    processBackWall();

    // console.log(positionData);
    // console.log("data length: ", positionData.length);

    LEDStrip.show();
  });

  client.on("close", () => {
    console.log("Connection lost");
  });
};

const processRightWall = () => {
  rightWall.reset();
  rightWall.updateLEDs(pointsTree);
};

const processBackWall = () => {
  backWall.reset();
  backWall.updateLEDs(pointsTree);
};

const processLeftWall = () => {
  leftWall.reset();
  leftWall.updateLEDs(pointsTree);
};

const init = () => {
  board.on("ready", () => {
    const strip = pixel.Strip({
      board,
      contoller: "FIRMATA",
      strips: [
        { pin: 3, length: 100 },
        { pin: 7, length: 50 },
        { pin: 2, length: 50 },
      ],
      gamma: 2.8,
    });

    strip.on("ready", () => {
      strip.off();
      LEDStrip = strip;

      populateRightWall();
      populateBackWall();
      populateLeftWall();

      wss.on("connection", handleConnection);
      console.log(`Websockets listening on port ${PORT}`);
    });
  });
};

init();
