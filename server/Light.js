// Units are in millimetres
const LIGHT_RADIUS = 50;
const LIGHT_COLOR = "#FFFFFF";

class Light {
  _on;
  _x;
  _y;
  _z;
  _led;
  _radius;
  _next;

  treePosition;

  constructor(x, y, z, led, radius = LIGHT_RADIUS) {
    this._on = false;
    this._x = x;
    this._y = y;
    this._z = z;
    this._radius = radius;
    this.treePosition = {
      minX: x - radius,
      minY: y - radius,
      minZ: 1,
      maxX: x + radius,
      maxY: y + radius,
      maxZ: 2999,
    };
    this._led = led;
    this._next = false;
  }

  setRadius(radius) {
    this._radius = radius;
  }

  turnOn(color = LIGHT_COLOR) {
    if (this.isOff()) {
      this._led.color(color);
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
