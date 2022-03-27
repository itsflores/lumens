const LightColors = {
  1: "#FFFFFF",
  2: "#FFFF00",
  3: "#64e764",
  4: "#4465c6",
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

  reset() {
    for (let row = 0; row < this._height; row++) {
      for (let col = 0; col < this._width; col++) {
        this._lights[row][col].turnOff();
      }
    }
  }

  setLights(lights) {
    this._lights = lights;
  }

  updateLEDs(tree, beat) {
    const color = LightColors[beat];

    for (let row = 0; row < this._height; row++) {
      for (let col = 0; col < this._width; col++) {
        if (this._lights[row][col].isOff()) {
          const collision = tree.collides(this._lights[row][col].treePosition);

          if (collision) {
            this._lights[row][col].turnOn(color);
          }
        }
      }
    }
  }
}

module.exports = LEDGrid;
