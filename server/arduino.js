const five = require("johnny-five");
const board = new five.Board({ port: "/dev/cu.usbmodem1101" });

board.on("ready", () => {
  const led = new five.Led(3);
  // led.blink(1000);
  // board.digitalWrite(4, 1900);

});
