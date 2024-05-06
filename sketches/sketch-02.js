const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
  animate: true, // Enables built-in animation loop
  // fps: 10,
};

/* NO LONGER NEEDED AS YOU HAVE INTEGRATED canvas-sketch-util LIBRARY
// Function to convert degrees to radians
const degToRad = (degrees) => {
  return (degrees / 180) * Math.PI;
};
*/

// Function to randomly determine the direction of movement
const direction = function () {
  let num;
  Math.random() <= 0.5 ? (num = 1) : (num = -1);
  return num;
};

const sketch = ({ context, width, height }) => {
  // Array to store rectangles and arcs
  const rectangles = [];
  const arcs = [];

  const nR = 90; // Number of rectangles
  const nA = 7; // Number of arcs

  // Calculating center coordinates of the canvas
  const cx = width * 0.5;
  const cy = height * 0.5;

  const radius = width * 0.3; // Radius of the circle on which rectangles are placed

  for (let i = 0; i < nR; i++) {
    rectangles.push(new Rectangle(width, height, cx, cy, radius, nR, i)); // Creating new agent object and adding it to the rectangle array
  }
  for (let j = 0; j < nA; j++) {
    arcs.push(new Arc(cx, cy, radius)); // Creating new agent object and adding it to the arc array
  }

  // console.log(rectangles);

  return ({ context, width, height }) => {
    // // Clear the canvas before drawing anything else
    // context.clearRect(0, 0, width, height);

    // Creating a gradient background
    const gradientBackground = context.createLinearGradient(0, 0, 0, height);
    gradientBackground.addColorStop(0.1, "#22092C");
    gradientBackground.addColorStop(0.25, "#872341");
    gradientBackground.addColorStop(0.5, "#BE3144");
    gradientBackground.addColorStop(0.75, "#F05941");

    // Filling the background with the gradient
    context.fillStyle = gradientBackground;
    context.fillRect(0, 0, width, height);

    // Creating shadow effect
    context.shadowColor = "#B2B377";
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    rectangles.forEach((rectangle) => {
      // console.log("rectangles");
      rectangle.update();
      rectangle.draw(context);
    });

    arcs.forEach((arc) => {
      // console.log("arcs");
      arc.update();
      arc.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

// Class that creates the rectangles
class Rectangle {
  constructor(width, height, cx, cy, radius, nR, i) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.n = nR;
    this.i = i;

    // Width and height of rectangles
    this.w = width * 0.01;
    this.h = height * 0.1;
    this.scale1 = random.range(0.1, 2);
    this.scale2 = random.range(0.2, 0.5);
    this.pos = -5;

    // Calculating angle for each rectangle
    this.slice = math.degToRad(360 / this.n); // TODO: put slice formula here instead of leaving it up there
    this.angle = this.slice * this.i;

    // Calculating coordinates of each rectangle
    this.x = this.cx + this.radius * Math.sin(this.angle);
    this.y = this.cy + this.radius * Math.cos(this.angle);
  }

  // Method to update rectangle's position
  update() {
    const speed = random.range(0.01, 5); // Adjust the speed of rotation

    /* ALTERNATE: Rectangles will spin as they rotate

    // Increment the angle in a clockwise direction
    this.angle += speed;

    // Update the coordinates of the rectangle based on the new angle
    this.x = this.cx + this.radius * Math.cos(this.angle);
    this.y = this.cy + this.radius * Math.sin(this.angle);
    */

    /* ALTERNATE: Rectangles oscillate up and down */
    const minHeight = -5;
    const maxHeight = 20; // 700 for clash; 20 for oscillate
    if (this.pos <= minHeight) {
      this.direction = 1; // Change direction when reaching the minimum
    } else if (this.pos >= maxHeight) {
      this.direction = -1; // Change direction when reaching the maximum
    }

    this.pos += this.direction * speed;
  }

  // Method to draw the rectangle on the canvas
  draw(context) {
    // Applying transformations to each rectangle
    context.save();
    context.translate(this.x, this.y);
    context.rotate(-this.angle);
    context.scale(this.scale1, this.scale2);

    // Drawing the rectangles
    context.fillStyle = "white";
    context.beginPath();
    context.rect(-this.w * 0.5, -this.pos, this.w, this.h);
    context.fill();
    context.restore();
  }
}

// Class that creates the arcs
class Arc {
  constructor(cx, cy, radius) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius * random.range(0.7, 1.3);
    this.num = direction();

    this.outline = random.range(5, 20);

    this.arcStart = random.range(math.degToRad(0), math.degToRad(360));
    this.arcEnd = random.range(math.degToRad(0), math.degToRad(360));

    this.rotate = 0;
    this.vel = random.range(0, 2);
  }

  // Method to update arc's direction
  update() {
    if (this.num === 1) {
      this.direction = this.rotate += math.degToRad(this.vel);
    } else if (this.num === -1) {
      this.direction = this.rotate -= math.degToRad(this.vel);
    }
  }

  // Method to draw the arc on the canvas
  draw(context) {
    context.save();
    context.translate(this.cx, this.cy);

    context.rotate(this.direction); // TODO***: Update once added direction conditionals
    // | Rotation is needed to align arcs with rectangles

    context.lineWidth = this.outline;
    context.strokeStyle = "white";

    context.beginPath();
    context.arc(0, 0, this.radius, this.arcStart, this.arcEnd); // Drawing arcs with random parameters
    context.stroke();
    context.restore();
  }
}
