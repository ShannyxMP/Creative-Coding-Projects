const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const colormap = require("colormap");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let elCanvas;
let mx, my;
const cursor = { x: 9999, y: 9999 }; // Store the position of the cursor in an object that is visible on the sketch// Cursor position (initially out of view)

const sketch = ({ context, width, height, canvas }) => {
  // Defining variables:
  // Define grid:
  const cols = 50;
  const rows = 50;
  const numCells = cols * rows;
  // Grid scale:
  const gw = width;
  const gh = height * 0.9; // Smaller to compress orbs closer together
  // Cells:
  const cw = gw / cols;
  const ch = gh / rows;

  const orbs = [];

  let offset = 25; // To shift each row horizontally to create a diamond shape
  let x, y, color;
  let fox, foy, lox, loy; // Define first orb & last orb's: x and y positions, and then use that to create an even margin that centres the drawing regardless of size
  let frequency = 0.002;
  let amplitude = 90;

  const colors = colormap({
    colormap: "phase",
    nshade: amplitude,
  });

  elCanvas = canvas; // Reference to the canvas element
  canvas.addEventListener("mousedown", onMouseDown); // Add interaction listener

  // Populate orbs with offset for each row:
  for (i = 0; i < cols; i++) {
    for (j = 0; j < rows; j++) {
      x = cw * i + j * offset;
      y = ch * j;

      n = random.noise2D(x, y, frequency, amplitude, color);

      color =
        colors[
          Math.floor(
            math.mapRange(n, -amplitude, amplitude, 0, amplitude * 0.8)
          )
        ];

      orbs.push(new Orb({ x, y, radius: 5, color }));
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

  mx = (width - -tb) * 0.5;
  my = (height - -ta) * 0.5;

  return ({ context, width, height, frame }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);

    orbs.forEach((orb) => {
      n = random.noise2D(
        orb.ix + frame * 3,
        orb.iy,
        frequency,
        amplitude,
        color
      );
      orb.x = orb.ix + n;
      orb.y = orb.iy + n;

      orb.update();
      orb.draw(context);
    });

    context.restore();
  };
};

const onMouseDown = (event) => {
  window.addEventListener("mousemove", onMouseMove); // Track mouse movement
  window.addEventListener("mouseup", onMouseUp);

  onMouseMove(event); // Trigger movement handler immediately
};

const onMouseMove = (event) => {
  // Calculate the position of the cursor proportional to the scale of the sketch (refer to sketch-curves-intro.js)
  const x = (event.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (event.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  cursor.x = x - mx;
  cursor.y = y - my;

  console.log(cursor);
};

const onMouseUp = () => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);

  // To reset values so that they are not near the particles when not dragging the cursor:
  cursor.x = 9999;
  cursor.y = 9999;
};

canvasSketch(sketch, settings);

class Orb {
  constructor({ x, y, radius, color }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colors = color;

    // Initial positions and radius (for resetting/noise calculations):
    this.ix = x;
    this.iy = y;
    this.iradius = radius;

    // To initialise the mouse interaction
    this.minDist = 100; //**test**/
    this.shrink = 8;
  }

  update() {
    let dx, dy, dd, distDelta;

    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    if (dd < this.minDist) {
      // Move the orb slightly toward the cursor
      let force = (this.minDist - dd) * 0.05; // Strength of movement
      this.x += dx * force;
      this.y += dy * force;
    } else {
      // Smoothly return particles to their original positions
      this.x += (this.ix - this.x) * 0.05;
      this.y += (this.iy - this.y) * 0.05;
    }
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
}
