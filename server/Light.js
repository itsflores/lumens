// Units are in millimetres
const LIGHT_RADIUS = 50;

class Light {
  intensity;
  on;

  x;
  y;
  z;

  treePosition;

  stripId;

  led;

  radius;

  note;
  octave;

  constructor(x, y, z, led, maxDepth = false, radius = LIGHT_RADIUS) {
    this.intensity = 0;
    this.on = false;
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.treePosition = {
      minX: x - radius,
      minY: y - radius,
      minZ: maxDepth ? 1 : z - radius,
      maxX: x + radius,
      maxY: y + radius,
      maxZ: maxDepth ? 2999 : z + radius,
    };
    this.led = led;
    // this.note = note;
    // this.octave = octave;
  }

  setIntensity(intensity) {
    this.setIntensity = intensity;
  }

  setRadius(radius) {
    this.radius = radius;
  }

  turnOn() {
    this.led.color("#ffffff");
    this.on = true;
  }

  turnOff() {
    this.led.off();
    this.on = false;
  }

  isOn() {
    return this.on;
  }

  toString() {
    return this.on ? "on" : "off";
  }
}

module.exports = Light;
