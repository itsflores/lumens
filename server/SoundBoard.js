const player = require("sound-play");
const Instrument = require("./Instrument");

const VOL_1 = 0;
const VOL_2 = 0.25;
const VOL_3 = 0.5;
const VOL_4 = 0.75;
const VOL_5 = 1;

const BAR_LEN = 27480;

const playAudio = (audioPath, volume) => {
  player.play(audioPath, volume);
};

class SoundBoard {
  instruments;
  _on;

  constructor() {
    this._on = false;
    this.instruments = {
      synth: new Instrument(playAudio),
    };
  }

  useInstruments() {
    this.instruments.synth.play();
  }

  turnOn() {
    if (!this._on) {
      this._on = true;
    }
  }

  turnOff() {
    if (this._on) {
      this._on = false;
    }
  }

  play() {
    setInterval(() => {
      if (this._on) {
        this.useInstruments();
      }
    }, BAR_LEN);
  }
}

module.exports = SoundBoard;
