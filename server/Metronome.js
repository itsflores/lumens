const BAR_LEN = 789;
const SECTION_LEN = 12624; // BAR_LEN x 16

class Metronome {
  _bar;
  _beat;

  constructor() {
    this._bar = 1;
    this._beat = 1;
  }

  init() {
    setInterval(() => {
      this.updateBar();
    }, BAR_LEN);
  }

  getBar() {
    return this._bar;
  }

  getBeat() {
    return this._beat;
  }

  updateTime() {
    if (this.getBar() === 4) {
      this._bar = 1;
    } else {
      this._bar += 1;
    }

    if (this.getBeat() === 16) {
      this._beat = 1;
    } else {
      this._beat += 1;
    }
  }

  updateBeat() {}

  onBarChange(callback = () => {}) {
    setInterval(() => {
      callback();
    }, BAR_LEN);
  }

  onSectionChange(callback = () => {}) {
    setInterval(() => {
      callback();
    }, SECTION_LEN);
  }
}

module.exports = Metronome;
