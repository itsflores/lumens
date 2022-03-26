// const BEAT_LEN = 790;

// DIFFERENCE
const BEAT_LEN = 375;
// const BAR_LEN = 6000;

class Metronome {
  _beat;

  constructor() {
    this._beat = 1;
  }

  getBar() {
    const mul4 = this._beat % 4;
    return mul4 === 0 ? 0 : mul4;
  }

  getBeat() {
    return this._beat;
  }

  updateTime() {
    if (this.getBeat() === 16) {
      this._beat = 1;
    } else {
      this._beat += 1;
    }
  }

  onBeatChange(callback = () => {}) {
    setInterval(callback, BEAT_LEN);
  }
}

module.exports = Metronome;
