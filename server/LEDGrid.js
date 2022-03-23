class LEDGrid {
  _lights;
  _width;
  _height;
  _type; // sound | volume - for music

  constructor(lights, type = "lights") {
    this._lights = lights;
    this._height = lights.length;
    this._width = lights[0].length;
    this._type = type;
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

  updateLEDs(tree) {
    if (this._type === "lights") {
      for (let row = 0; row < this._height; row++) {
        for (let col = 0; col < this._width; col++) {
          if (this._lights[row][col].isOff()) {
            const collision = tree.collides(
              this._lights[row][col].treePosition
            );

            if (collision) {
              this._lights[row][col].turnOn();
            }
          }
        }
      }
    } else {
      for (let row = 0; row < this._height; row++) {
        for (let col = 0; col < this._width; col++) {
          if (this._lights[row][col].isOff()) {
            const collision = tree.collides(
              this._lights[row][col].treePosition
            );

            if (collision) {
              this._lights[row][col].turnOn();
              break;
            }
          }
        }
      }
    }
  }
}

module.exports = LEDGrid;
