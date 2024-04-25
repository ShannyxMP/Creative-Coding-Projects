const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
  // animate: true, // Enables built-in animation loop
  // fps: 10,
};

/* NO LONGER NEEDED AS YOU HAVE INTEGRATED canvas-sketch-util LIBRARY
// Function to convert degrees to radians
const degToRad = (degrees) => {
  return (degrees / 180) * Math.PI;
};
*/

const sketch = () => {
  return ({ context, width, height }) => {
    // Defining a gradient background with multiple color stops (vertically)
    const gradientBackground = context.createLinearGradient(0, 0, 0, height);
    gradientBackground.addColorStop(0.1, "#22092C");
    gradientBackground.addColorStop(0.25, "#872341");
    gradientBackground.addColorStop(0.5, "#BE3144");
    gradientBackground.addColorStop(0.75, "#F05941");

    // Filling the background with the gradient
    context.fillStyle = gradientBackground;
    context.fillRect(0, 0, width, height);

    // Adding a shadow effect to the elements drawn on the canvas
    context.shadowColor = "#B2B377";
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    // Calculating center coordinates of the canvas
    const cx = width * 0.5;
    const cy = height * 0.5;

    const radius = width * 0.3; // Radius of the circle on which rectangles are placed

    const num = 40; // Number of rectangles and arcs

    // Array to store rectangles and arcs
    const rectangles = [];
    const arcs = [];

    // Generating rectangles and arcs to be drawn on the canvas
    for (let i = 0; i < num; i++) {
      // Calculating angle for each rectangle
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      rectangles.push(new Rectangle(width, height, cx, cy, radius, angle)); // Creating new rectangle object and adding it to the rectangle array

      arcs.push(new Arc(cx, cy, radius, angle, slice)); // Creating new arc object and adding it to the arc array
    }

    rectangles.forEach((rectangle) => {
      rectangle.draw(context);
    });

    arcs.forEach((arc) => {
      arc.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

// Class representing a rectangle shape drawn on the canvas
class Rectangle {
  constructor(width, height, cx, cy, radius, angle) {
    // Width and height of rectangles
    this.w = width * 0.01;
    this.h = height * 0.1;

    this.angle = angle;
    this.radius = radius;

    // Calculating coordinates of each rectangle
    this.x = cx + this.radius * Math.sin(this.angle);
    this.y = cy + this.radius * Math.cos(this.angle);
  }

  // Method to draw the rectangle on the canvas
  draw(context) {
    // Applying transformations to each rectangle
    context.save();
    context.translate(this.x, this.y);
    context.rotate(-this.angle);
    context.scale(random.range(0.1, 2), random.range(0.2, 0.5));

    // Drawing the rectangles
    context.fillStyle = "white";
    context.beginPath();
    context.rect(-this.w * 0.5, random.range(0, this.h * 0.5), this.w, this.h);
    context.fill();
    context.restore();
  }
}

// Class representing an arc shape drawn on the canvas
class Arc {
  constructor(cx, cy, radius, angle, slice) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.angle = angle;
    this.slice = slice;

    // Calculating the start and end angles of the arc
    this.arcStart = this.slice * random.range(1, -8);
    this.arcEnd = this.slice * random.range(1, 5);
  }

  // Method to draw the arc on the canvas
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
