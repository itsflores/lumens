// Units are in millimetres
const LIGHT_RADIUS = 50;
const LED_COLOR = "#FFFFFF";

class Light {
  _on;
  _x;
  _y;
  _z;
  _led;
  _radius;

  treePosition;
  soundUpdate;

  instrument;

  constructor(
    x,
    y,
    z,
    led,
    soundUpdate,
    instrument,
    maxDepth = false,
    radius = LIGHT_RADIUS
  ) {
    this._on = false;
    this._x = x;
    this._y = y;
    this._z = z;
    this._radius = radius;
    this.treePosition = {
      minX: x - radius,
      minY: y - radius,
      minZ: maxDepth ? 1 : z - radius,
      maxX: x + radius,
      maxY: y + radius,
      maxZ: maxDepth ? 2999 : z + radius,
    };
    this._led = led;
    this.soundUpdate = soundUpdate;
    this.instrument = instrument;
  }

  setRadius(radius) {
    this._radius = radius;
  }

  turnOn() {
    if (this.isOff()) {
      this._led.color(LED_COLOR);
      this._on = true;
      this.soundUpdate();
    }
  }

  turnOff() {
    if (this.isOn()) {
      this._led.off();
      this._on = false;
    }
  }

  isOn() {
    return this._on;
  }

  isOff() {
    return this._on === false;
  }

  toString() {
    return this._on ? "on" : "off";
  }
}

module.exports = Light;
