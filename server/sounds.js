const player = require("sound-play");

const audio = player.play("./sounds/guitar.wav", 1);

setTimeout(() => {
  player.play("./sounds/guitar.wav");
}, 1000);
