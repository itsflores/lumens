const player = require("sound-play");

player.play("./sounds/guitar.wav");

setTimeout(() => {
  player.play("./sounds/guitar.wav");
}, 1000);
