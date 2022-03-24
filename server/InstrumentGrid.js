const LightColors = {
  1: "#FFFFFF",
  2: "#FFFF00",
  3: "#64e764",
  4: "#4465c6",
};

const colHasNext = (col) => {
  for (let i = 0; i < 5; i++) {
    if (col[i].isNext()) {
      return i;
    }
  }

  return null;
};

class LEDGrid {
  _lights;
  _width;
  _height;

  constructor(lights) {
    this._lights = lights;
    this._height = lights.length;
    this._width = lights[0].length;
  }

  getColumn(col) {
    return this._lights.map((row) => row[col]);
  }

  reset() {
    for (let i = 0; i < this._width; i++) {
      const lights = this.getColumn(i);

      for (let light of lights) {
        light.turnOff();
      }
    }
  }

  setLights(lights) {
    this._lights = lights;
  }

  updateLEDs(tree) {
    for (let i = 0; i < this._width; i++) {
      const lights = this.getColumn(i);

      for (let light of lights) {
        const nextLight = colHasNext(lights);
        const collision = tree.collides(light.treePosition);

        if (collision) {
          if (nextLight !== null) {
            lights[nextLight].setNext(false);
          }

          light.setNext(true);
        }
      }
    }
  }

  tickLEDs() {
    for (let i = 0; i < this._width; i++) {
      const lights = this.getColumn(i);

      for (let light of lights) {
        if (light.isNext()) {
          light.turnOn();
        } else {
          light.turnOff();
        }
      }
    }
  }
}

module.exports = LEDGrid;
