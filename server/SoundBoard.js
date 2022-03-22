const player = require("sound-play");
const Instrument = require("./Instrument");

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
