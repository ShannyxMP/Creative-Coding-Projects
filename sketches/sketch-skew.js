const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = ({ width, height }) => {
  let x, y, w, h;

  const num = 20; // Number of rectangles to be drawn
  const degrees = -30; // Slant of rectangle

  const rects = [];

  for (let i = 1; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);

    rects.push({ x, y, w, h });
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      const { x, y, w, h } = rect; // Destructure the 'rect' object

      context.save();

      context.translate(x, y);

      context.strokeStyle = "blue";
      drawSkewedRect({ context, w, h, degrees });

      context.restore();
    });
  };
};

const drawSkewedRect = ({ context, w, h, degrees }) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sign(angle) * w;

  context.translate(rx * -0.5, (h + ry) * -0.5);

  // Creating rectangle a stroke at a time
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.lineTo(0, 0);
  context.closePath();
  context.stroke();
};

canvasSketch(sketch, settings);
