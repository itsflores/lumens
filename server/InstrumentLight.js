// Units are in millimetres
const LIGHT_RADIUS = 50;
const LIGHT_COLOR = "#FFFFFF";

class InstrumentLight {
  _on;
  _x;
  _y;
  _z;
  _led;
  _radius;
  _next;

  treePosition;
  soundUpdate;

  constructor(x, y, z, led, soundUpdate, radius = LIGHT_RADIUS) {
    this._on = false;
    this._x = x;
    this._y = y;
    this._z = z;
    this._radius = radius;
    this.treePosition = {
      minX: x - radius,
      minY: y - radius,
      minZ: z - radius,
      maxX: x + radius,
      maxY: y + radius,
      maxZ: z + radius,
    };
    this._led = led;
    this._next = false;
    this.soundUpdate = soundUpdate;
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

  setNext(next) {
    if (next === this._next) {
      return;
    }

    this._next = next;

    if (this.isOff()) {
      if (next) {
        this._led.color("#604596");
      } else {
        this._led.off();
      }
    }
  }

  isNext() {
    return this._next;
  }

  turnOff() {
    if (this.isOn() || !this.isNext()) {
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

module.exports = InstrumentLight;
