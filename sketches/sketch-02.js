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

const sketch = ({ context, width, height }) => {
  const num = 40; // Number of rectangles and arcs

  // Array to store rectangles and arcs
  const rectangles = [];
  const arcs = [];

  for (let i = 0; i < num; i++) {
    // Calculating center coordinates of the canvas
    const cx = width * 0.5;
    const cy = height * 0.5;

    const radius = width * 0.3; // Radius of the circle on which rectangles are placed

    // Calculating angle for each rectangle
    const slice = math.degToRad(360 / num);
    const angle = slice * i;

    rectangles.push(new Rectangle(width, height, cx, cy, radius, angle, i)); // Creating new agent object and adding it to the rectangle array
    arcs.push(new Arc(cx, cy, radius, angle, slice));
  }

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

    /* TODO: Update arcs
    arcs.forEach((arc) => {
      // console.log("arcs");
      arc.draw(context);
    });
    */
  };
};

canvasSketch(sketch, settings);

// Class that creates the rectangles
class Rectangle {
  constructor(width, height, cx, cy, radius, angle, i) {
    // Width and height of rectangles
    this.w = width * 0.01;
    this.h = height * 0.1;

    this.angle = angle;
    this.radius = radius;
    this.i = i;

    // Initialise starting value
    if (this.i % 2 === 0) {
      this.moveR = 5;
    } else if (this.i % 2 !== 0) {
      this.moveR = 0;
    }

    // Calculating coordinates of each rectangle
    this.x = cx + this.radius * Math.sin(this.angle);
    this.y = cy + this.radius * Math.cos(this.angle);
  }

  // TODO: Method to update rectangle's position
  update() {
    // Move the rectangles up and down
    const speed = 0.01; // Adjust the speed of oscillation if needed
    const maxMove = 5;

    if (this.moveR >= maxMove) {
      this.direction = -1; // Change direction when reaching the maximum
    } else if (this.moveR <= 0) {
      this.direction = 1; // Change direction when reaching 0
    }

    this.moveR += this.direction * speed;
  }

  // Method to draw the rectangle on the canvas
  draw(context) {
    // Applying transformations to each rectangle
    context.save();
    context.translate(this.x, this.y);
    context.rotate(-this.angle);
    context.scale(0.5, 0.25);

    // Drawing the rectangles
    context.fillStyle = "white";
    context.beginPath();
    context.rect(-this.w * 0.5, this.h * this.moveR, this.w, this.h);
    context.fill();
    context.restore();
  }
}
// Class that creates the arcs
class Arc {
  constructor(cx, cy, radius, angle, slice) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.angle = angle;
    this.slice = slice;
    this.arcStart = this.slice * random.range(1, -8);
    this.arcEnd = this.slice * random.range(1, 5);
  }

  // Drawing the rectangles
  draw(context) {
    context.save();
    context.translate(this.cx, this.cy);
    context.rotate(-this.angle); // Rotation is needed to align arcs with rectangles
    context.lineWidth = random.range(5, 20);
    context.strokeStyle = "white";
    context.beginPath();
    context.arc(
      0,
      0,
      this.radius * random.range(0.7, 1.3),
      this.slice * random.range(1, -8),
      this.slice * random.range(1, 5)
    ); // Drawing arcs with random parameters
    context.stroke();
    context.restore();
  }
}
