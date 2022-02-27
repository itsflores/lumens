const five = require("johnny-five");
const pixel = require("node-pixel");

const board = new five.Board({ port: "/dev/cu.usbmodem1301" });

board.on("ready", () => {
  const led = new five.Led(3);
  // led.blink(1000);
  // board.digitalWrite(4, 1900);

  const strip = pixel.Strip({
    board,
    contoller: "FIRMATA",
    strips: [{ pin: 3, length: 16 }],
    gamma: 2.8,
  });

  strip.on("ready", () => {
    // strip.color("#903");
    // strip.pixel(0).color("#074");
    // strip.pixel(2).off();
    // strip.pixel(4).off();
    // strip.show();
    strip.off();
  });
});
