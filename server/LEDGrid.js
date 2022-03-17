class LEDGrid {
  lights;

  width;
  height;

  constructor(lights) {
    this.lights = lights;
    this.height = lights.length;
    this.width = lights[0].length;
  }

  reset() {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.lights[row][col].turnOff();
      }
    }
  }

  setLights(lights) {
    this.lights = lights;
  }

  updateLEDs(tree) {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (!this.lights[row][col].isOn()) {
          const collision = tree.collides(this.lights[row][col].treePosition);

          if (collision) {
            this.lights[row][col].turnOn();
          }
        }
      }
    }
  }
}

module.exports = LEDGrid;
