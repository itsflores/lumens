// Units are in millimetres
const LIGHT_RADIUS = 50;

class Light {
  intensity;
  on;

  x;
  y;
  z;

  radius;

  note;
  octave;

  constructor(x, y, z, radius = LIGHT_RADIUS) {
    this.intensity = 0;
    this.on = false;
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    // this.note = note;
    // this.octave = octave;
  }

  setIntensity(intensity) {
    this.setIntensity = intensity;
  }

  setRadius(radius) {
    this.radius = radius;
  }

  switch() {
    this.on = !this.on;
  }

  turnOn() {
    this.on = true;
  }

  turnOff() {
    this.on = false;
  }

  updateIntensity(x, y, z) {
    // calculations
  }

  toString() {
    return this.on ? "on" : "off";
  }
}

module.exports = Light;
