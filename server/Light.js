// Units are in millimetres
const LIGHT_RADIUS = 50;

class Light {
  intensity;
  on;

  x;
  y;
  z;

  treePosition;

  id;

  radius;

  note;
  octave;

  constructor(x, y, z, id, radius = LIGHT_RADIUS) {
    this.intensity = 0;
    this.on = false;
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.id = id;
    this.treePosition = {
      minX: x - radius,
      minY: y - radius,
      minZ: z - radius,
      maxX: x + radius,
      maxY: y + radius,
      maxZ: z + radius,
    };
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
