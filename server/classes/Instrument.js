const VOL_1 = 0;
const VOL_2 = 0.25;
const VOL_3 = 0.5;
const VOL_4 = 0.75;
const VOL_5 = 1;

const synthFile = (name, variant) => `./sounds/${name}-${variant}.wav`;

class Instrument {
  _variant;
  _volume;
  _file;
  _playFunction;
  _name;

  constructor(name, playFunction) {
    this._playFunction = playFunction;
    this._variant = 1;
    this._volume = VOL_3;
    this._name = name;
    this._file = synthFile(this._name, this._variant);
  }

  setVariant(variant) {
    this._variant = variant + 1;
    this._file = synthFile(this._name, this._variant);
  }

  setVolume(volume) {
    this._volume = volume * 0.25;
  }

  play() {
    this._playFunction(this._file, this._volume);
  }
}

module.exports = Instrument;
