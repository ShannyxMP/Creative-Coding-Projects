const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const particles = [];
const cursor = { x: 9999, y: 9999 }; // Store the position of the cursor in an object that is visible on the sketch

let elCanvas;

const sketch = ({ width, height, canvas }) => {
  let x, y, particle;
  let pos = [];

  elCanvas = canvas;
  canvas.addEventListener("mousedown", onMouseDown);

  for (let i = 0; i < 200; i++) {
    x = width * 0.5;
    y = height * 0.5;

    random.insideCircle(400, pos); // Populates a random x & y value - ie. a 2D point
    x += pos[0];
    y += pos[1];

    particle = new Particle({ x, y });

    particles.push(particle);
  }

  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw(context);
    });
  };
};

const onMouseDown = (event) => {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  onMouseMove(event);
};

const onMouseMove = (event) => {
  // Calculate the position of the cursor proportional to the scale of the sketch (refer to sketch-curves-intro.js)
  const x = (event.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (event.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  cursor.x = x; //? Why is this not declared in the particle class?
  cursor.y = y;

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

class Particle {
  constructor({ x, y, radius = 10 }) {
    // Initial Position:
    this.ix = x;
    this.iy = y;

    // Position:
    this.x = x;
    this.y = y;

    // Acceleration:
    this.ax = 0;
    this.ay = 0;

    // Velocity:
    this.vx = 0;
    this.vy = 0;

    this.radius = radius;

    this.minDist = 100;
    this.pushFactor = 0.02;
    this.pullFactor = 0.004;
    this.dampFactor = 0.95; // To have particle eventually revert to original position as opposed to building momentum
  }

  update() {
    //? Is the update() supposed to precede the draw() in this class? And why?

    let dx, dy, dd, distDelta;

    // Pull force to the particle (declared before push as it acts constantly):
    dx = this.ix - this.x;
    dy = this.iy - this.y;

    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    // Push force to the particle:
    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * distDelta * this.pushFactor;
      this.ay += (dy / dd) * distDelta * this.pushFactor;
    }

    // Increment the velocity by the acceleration:
    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.dampFactor;
    this.vy *= this.dampFactor;

    // Increment the position by the velocity:
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fillStyle = "white";
    context.fill();

    context.restore();
  }
}
