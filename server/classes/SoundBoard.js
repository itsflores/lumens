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
      bass: new Instrument("bass", playAudio),
      chords: new Instrument("chords", playAudio),
      drums: new Instrument("drums", playAudio),
      effects: new Instrument("effects", playAudio),
      melody: new Instrument("melody", playAudio),
    };
  }

  useInstruments() {
    this.instruments.bass.play();
    this.instruments.chords.play();
    this.instruments.drums.play();
    this.instruments.effects.play();
    this.instruments.melody.play();
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
