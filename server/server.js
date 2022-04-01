const five = require("johnny-five");
const pixel = require("node-pixel");
const RBush3D = require("rbush-3d");
const WebSocketServer = require("ws").Server;
const Light = require("./classes/Light");
const LEDGrid = require("./classes/LEDGrid");
const SoundBoard = require("./classes/SoundBoard");
const InstrumentGrid = require("./classes/InstrumentGrid");
const InstrumentLight = require("./classes/InstrumentLight");

const PORT = 8081;
const board = new five.Board({ port: "/dev/cu.usbmodem1401" });
const wss = new WebSocketServer({
  port: PORT,
});

const pointsTree = new RBush3D.RBush3D();
const soundBoard = new SoundBoard();
const { metronome } = soundBoard;
const { chords, melody, bass, effects, drums } = soundBoard.instruments;

let leftWall = null;
let rightWall = null;
let backWall = null;
let LEDStrip = null;

const SIDE_Z_ORIGIN = 1400;

const populateLeftWall = () => {
  const lights = [];

  const Z_ORIGIN = SIDE_Z_ORIGIN;
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

      let soundFunction = () => {};

      if (col === 0) {
        soundFunction = () => {
          drums.setVolume(row);
        };
      }

      if (col === 1) {
        soundFunction = () => {
          effects.setVolume(row);
        };
      }

      if (col === 2) {
        soundFunction = () => {
          bass.setVolume(row);
        };
      }

      if (col === 3) {
        soundFunction = () => {
          chords.setVolume(row);
        };
      }

      if (col === 4) {
        soundFunction = () => {
          melody.setVolume(row);
        };
      }

      const newLight = new InstrumentLight(
        xPos,
        yPos,
        zPos,
        LEDStrip.pixel(stripPosition + 150),
        // LEDStrip.pixel(stripPosition),
        soundFunction
      );

      lightsRow.push(newLight);

      zPos += Z_DELTA;
    }
    yPos -= Y_DELTA;

    lights.push(lightsRow);
  }

  leftWall = new InstrumentGrid(lights);
};

const populateRightWall = () => {
  const lights = [];

  const Z_ORIGIN = SIDE_Z_ORIGIN;
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

      let soundFunction = () => {};

      if (col === 0) {
        soundFunction = () => {
          drums.setVariant(row);
        };
      }

      if (col === 1) {
        soundFunction = () => {
          effects.setVariant(row);
        };
      }

      if (col === 2) {
        soundFunction = () => {
          bass.setVariant(row);
        };
      }

      if (col === 3) {
        soundFunction = () => {
          chords.setVariant(row);
        };
      }

      if (col === 4) {
        soundFunction = () => {
          melody.setVariant(row);
        };
      }

      const newLight = new InstrumentLight(
        xPos,
        yPos,
        zPos,
        LEDStrip.pixel(stripPosition + 100),
        // LEDStrip.pixel(stripPosition),
        soundFunction
      );

      lightsRow.push(newLight);

      zPos += Z_DELTA;
    }
    yPos -= Y_DELTA;

    lights.push(lightsRow);
  }

  rightWall = new InstrumentGrid(lights);
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
        LEDStrip.pixel(stripPosition)
      );

      lightsRow.push(newLight);

      xPos -= DELTA_X;
    }
    yPos -= DELTA_Y;

    lights.push(lightsRow);
  }

  backWall = new LEDGrid(lights);
};

const processBackWall = () => {
  backWall.reset();
  backWall.updateLEDs(pointsTree, metronome.getBar());
};

const handleConnection = (client) => {
  console.log("Connected!");

  client.on("message", (data) => {
    const coordinatesString = data.toString();
    const positionData = JSON.parse(coordinatesString);

    if (positionData.length > 0) {
      soundBoard.turnOn();
    } else {
      soundBoard.turnOff();
    }

    pointsTree.clear();
    pointsTree.load(positionData);

    rightWall.updateLEDs(pointsTree);
    leftWall.updateLEDs(pointsTree);

    LEDStrip.show();

    // console.log(positionData);
    // console.log("data length: ", positionData.length);
  });

  client.on("close", () => {
    console.log("Connection lost");
    soundBoard.turnOff();
  });
};

const init = () => {
  board.on("ready", () => {
    const strip = pixel.Strip({
      board,
      contoller: "FIRMATA",
      strips: [
        { pin: 2, length: 100 },
        { pin: 3, length: 50 },
        { pin: 7, length: 50 },
      ],
      gamma: 2.8,
    });

    strip.on("ready", () => {
      LEDStrip = strip;

      LEDStrip.off();

      populateRightWall();
      populateBackWall();
      populateLeftWall();

      LEDStrip.show();
      soundBoard.playSection();

      metronome.onBeatChange(() => {
        if (metronome.getBeat() === 1) {
          rightWall.tickLEDs();
          leftWall.tickLEDs();
          soundBoard.playSection();
        }

        processBackWall();

        metronome.updateTime();
      });

      wss.on("connection", handleConnection);
      console.log(`Websockets listening on port ${PORT}`);
    });
  });
};

init();
