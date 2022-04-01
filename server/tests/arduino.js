const five = require("johnny-five");
const pixel = require("node-pixel");

const board = new five.Board({ port: "/dev/cu.usbmodem1401" });

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
    // strip.color("#FFFFFF");
    strip.color("#FF0000");
    // strip.color("#FFFF00");
    // strip.pixel(2).off();
    // strip.pixel(4).off();
    // strip.color("#06804D");
    // strip.color("#604596");
    strip.show();
    // strip.off();
  });
});
