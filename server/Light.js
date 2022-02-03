class Light {
  intensity;
  on;

  x;
  y;
  z;

  radius;

  note;
  octave;

  constructor(x, y, z, radius = 10, note, octave) {
    this.intensity = 0;
    this.on = false;
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.note = note;
    this.octave = octave;
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

  updateIntensity(x, y, z) {
    // calculations
  }
}
