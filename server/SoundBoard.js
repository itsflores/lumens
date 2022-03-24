const player = require("sound-play");
const Instrument = require("./Instrument");

const playAudio = (audioPath, volume) => {
  player.play(audioPath, volume);
};

class SoundBoard {
  instruments;
  _on;

  constructor() {
    this._on = false;
    this.instruments = {
      synth: new Instrument("synth", playAudio),
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

  playSection() {
    if (this._on) {
      this.useInstruments();
    }
  }
}

module.exports = SoundBoard;
