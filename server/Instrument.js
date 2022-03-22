const VOL_1 = 0;
const VOL_2 = 0.25;
const VOL_3 = 0.5;
const VOL_4 = 0.75;
const VOL_5 = 1;

const synthFile = (variant) => `./sounds/synth-${variant}.wav`;

class Instrument {
  _variant;
  _volume;
  _file;
  _playFunction;

  constructor(playFunction) {
    this.playFunction = playFunction;
    this.variant = 1;
    this.volume = VOL_2;
    this.file = synthFile(this.variant);
  }

  setVariant(variant) {
    this.variant = variant + 1;
    this.file = synthFile(this.variant);
  }

  setVolume(volume) {
    this.volume = volume * 0.25;
  }

  play() {
    this.playFunction(this.file, this.volume);
  }
}

module.exports = Instrument;
