const five = require("johnny-five");
const pixel = require("node-pixel");

const board = new five.Board({ port: "/dev/cu.usbmodem11401" });

board.on("ready", () => {
  const strip = pixel.Strip({
    board,
    contoller: "FIRMATA",
    strips: [{ pin: 3, length: 50 }],
    gamma: 2.8,
  });

  strip.on("ready", () => {
    // for (let i = 0; i < 50; i++) {
    //   if (i % 2 !== 0) {
    //     strip.pixel(i).color("#074");
    //   } else {
    //     strip.pixel(i).off();
    //   }
    // }

    // strip.color("#903");
    // strip.pixel(2).off();
    // strip.pixel(4).off();
    // strip.show();
    strip.off();
  });
});
