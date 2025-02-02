const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = ({ context, width, height }) => {
  // Defining variables:
  // Define grid:
  const cols = 20;
  const rows = 10;
  const numCells = cols * rows;
  // Grid scale:
  const gw = width * 0.8;
  const gh = height * 0.4; // Smaller to compress orbs closer together
  // Cells:
  const cw = gw / cols;
  const ch = gh / rows;
  // Margin:
  // const mx = (width - gw) * 0.5;
  // const my = (height - gh) * 0.5;

  const orbs = [];

  let offset = 25; // To shift each row horizontally to create a diamond shape
  let x, y, color;
  let fox, foy, lox, loy; // Define first orb & last orb's: x and y positions, and then use that to create an even margin that centres the drawing regardless of size

  color = "blue";

  // Correct the Orb initialization
  // orbs.push(new Orb({ x: tx, y: ty, radius: 10, color }));

  // Populate orbs with offset for each row:
  for (i = 0; i < cols; i++) {
    for (j = 0; j < rows; j++) {
      x = cw * i + j * offset;
      y = ch * j;

      orbs.push(new Orb({ x, y, radius: 10, color }));
    }
  }

  // To define first orb & last orbs: x and y positions, and then use that to create an even margin that centres the drawing regardless of size
  fox = orbs[0].x; // First orb's x pos
  foy = orbs[0].y;
  lox = orbs[numCells - 1].x; // Last orb's x pos
  loy = orbs[numCells - 1].y;
  console.log(fox, foy, lox, loy);

  // To define the margin in order to centre by calculating height and width of the total created orbs
  const ta = foy - loy; // Height of skewed rectangle
  const tb = fox - lox; // Width of skewed rectangle
  console.log(ta, tb);

  const mx = (width - -tb) * 0.5;
  const my = (height - -ta) * 0.5;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);

    orbs.forEach((orb) => {
      orb.draw(context);
    });

    context.restore();
  };
};

canvasSketch(sketch, settings);

class Orb {
  constructor({ x, y, radius = 100, color }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colors = color;

    // Initial positions (for resetting/noise calculations):
    this.ix = x;
    this.iy = y;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.colors;
    context.fill();

    context.restore();
  }

  // TODO: update positions to simulate 2D noise that ripple out, like sketch-04.js
}
