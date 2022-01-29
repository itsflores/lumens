class Light {
  intensity;
  on;
  x;
  y;
  z;
  radius;

  constructor(x, y, z, radius = 10) {
    this.intensity = 0;
    this.on = false;
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
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
}
