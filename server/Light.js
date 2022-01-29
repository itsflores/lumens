class Light {
  intensity;
  on;

  constructor() {
    this.intensity = 0;
    this.on = false;
  }

  setIntensity(intensity) {
    this.setIntensity = intensity;
  }

  switch() {
    this.on = !this.on;
  }
}
