const RBush3D = require("rbush-3d");
const Light = require("../classes/Light");

const tree3d = new RBush3D.RBush3D();
const tree2d = new RBush();

const lights = [];

const Z_DELTA = 150;
const Y_DELTA = 150;

const populateRightWall = () => {
  // let xPos = -700;
  let xPos = 700;
  let zPos = 1500;
  let yPos = 200;

  for (let i = 0; i < 5; i++) {
    zPos = 1500;

    const row = [];
    const isEven = i % 2 === 0;

    for (let j = 0; j < 5; j++) {
      const newId = isEven ? 2 * j + 10 * i : 10 * (i + 1) - 2 * (j + 1);

      const newLight = new Light(xPos, yPos, zPos, newId);

      row.push(newLight);

      tree3d.insert({
        minX: xPos - newLight.radius / 2,
        minY: yPos - newLight.radius / 2,
        minZ: zPos - newLight.radius / 2,
        maxX: xPos + newLight.radius / 2,
        maxY: yPos + newLight.radius / 2,
        maxZ: zPos + newLight.radius / 2,
      });

      zPos += Z_DELTA;
    }
    yPos -= Y_DELTA;

    lights.push(row);
  }
};

populateRightWall();

console.log(tree3d.all());

const result = tree3d.collides({
  minX: 675,
  minY: -425,
  minZ: 1625,
});

console.log(result);

// console.log(lights);
