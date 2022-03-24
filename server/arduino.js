const five = require("johnny-five");
const pixel = require("node-pixel");

const board = new five.Board({ port: "/dev/cu.usbmodem11401" });

board.on("ready", () => {
  const strip = pixel.Strip({
    board,
    contoller: "FIRMATA",
    strips: [
      { pin: 3, length: 50 },  
      // { pin: 7, length: 50 },
      // { pin: 2, length: 50 },
    ],
    gamma: 2.8,
  });

  // const strip2 = pixel.Strip({
  //   board,
  //   contoller: "FIRMATA",
  //   strips: [{ pin: 7, length: 50 }],
  //   gamma: 2.8,
  // });

  strip.on("ready", () => {
    // for (let i = 0; i < 100; i++) {
    //   if (i < 60) {
    //     strip.pixel(i).color("#0057b7");
    //   } else {
    //     strip.pixel(i).color("#ffd700");
    //   }
    // }

    // for (let i = 0; i < 100; i++) {
    //   if (i < 80) {
    //     strip.pixel(i).color("#FFF");
    //   }
    // }

    // for (let i = 0; i < 100; i++) {
    //   if (i < 100) {
    //     strip.pixel(i).color("#FF0000");
    //   } else {
    //     strip.pixel(i).color("#00FF00");
    //   }
    // }

    // strip.color("#0000FF");
    // strip.color("#FF0000");
    // strip.color("#FFFF00");
    // strip.pixel(2).off();
    // strip.pixel(4).off();
    // strip.color("#06804D");
    // strip.color("#604596");
    // strip.show();
    strip.off();
  });

  // strip2.on("ready", () => {
  //   strip2.color("#0000FF");
  //   strip2.show();
  // })
});
