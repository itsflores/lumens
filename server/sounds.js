const player = require("sound-play");

const VOL_1 = 0;
const VOL_2 = 0.25;
const VOL_3 = 0.5;
const VOL_4 = 0.75;
const VOL_5 = 1;

const synth1 = "./sounds/synth-1.wav";
const synth2 = "./sounds/synth-2.wav";
const synth3 = "./sounds/synth-3.wav";
const synth4 = "./sounds/synth-4.wav";
const synth5 = "./sounds/synth-5.wav";

const playAudio = (audioPath, volume) => {
  player.play(audioPath, volume);
};

playAudio(synth5, VOL_2);

setInterval(() => {
  // playAudio(synth1);
  playAudio(synth5);
}, 27480);
