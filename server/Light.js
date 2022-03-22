// Units are in millimetres
const LIGHT_RADIUS = 50;
const LED_COLOR = "#FFFFFF";

class Light {
  intensity;
  on;
  x;
  y;
  z;
  treePosition;
  led;
  radius;
  soundUpdate;

  constructor(
    x,
    y,
    z,
    led,
    soundUpdate,
    maxDepth = false,
    radius = LIGHT_RADIUS
  ) {
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
    this.soundUpdate = soundUpdate;
  }

  setIntensity(intensity) {
    this.setIntensity = intensity;
  }

  setRadius(radius) {
    this.radius = radius;
  }

  turnOn() {
    if (this.isOff()) {
      this.led.color(LED_COLOR);
      this.on = true;
      this.soundUpdate();
    }
  }

  turnOff() {
    if (this.isOn()) {
      this.led.off();
      this.on = false;
    }
  }

  isOn() {
    return this.on;
  }

  isOff() {
    return this.on === false;
  }

  toString() {
    return this.on ? "on" : "off";
  }
}

module.exports = Light;
