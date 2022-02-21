<p align="center">
  <img width="600" src="./assets/logo.png">
</p>

<br>

# Project Lumens (lumière exagéré)

## What is it?
Project Lumens is a visual representation of sound and movement. Additionally, it is being accounted for my honours project in the Bachelor's Degree of Computer Science at Carleton University.

## How does it work?
<img width="600" src="./assets/diagram.png">

## Dependencies

## Movement
- [OpenFrameworks](https://openframeworks.cc/)
- [ofxKinect](https://github.com/ofTheo/ofxKinect)
- [Poco](https://pocoproject.org/)

## Sound TBD

## Triangulation
- [Node](https://nodejs.org/en/)

## Hardware
- Kinect (Model 1414)

### LEDs
- Arduino Uno
- StandardFirmata protocol (to enable control through NodeJS)
- [johnny-five](https://github.com/rwaldron/johnny-five)
- [node-pixel](https://github.com/ajfisher/node-pixel)

**Important**
To use node-pixel on an M1 machine, I had to install `firmata` separately and then force the installation of `node-pixel`