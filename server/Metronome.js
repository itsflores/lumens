const BEAT_LEN = 395;
const BAR_LEN = 790;
const SECTION_LEN = 12640; // BAR_LEN x 16

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

  onBarChange(callback = () => {}) {
    setInterval(callback, BAR_LEN);
  }

  onSectionChange(callback = () => {}) {
    setInterval(callback, SECTION_LEN);
  }
}

module.exports = Metronome;
