const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const colourmap = require("colormap");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = ({ width, height }) => {
  // Define grid:
  const cols = 72;
  const rows = 8;
  const numCells = cols * rows;

  // Grid
  const gw = width * 0.8;
  const gh = height * 0.8;

  // Cell
  const cw = gw / cols;
  const ch = gh / rows;

  // Margin
  const mx = (width - gw) * 0.5;
  const my = (height - gh) * 0.5;

  const points = [];

  let x, y, n, lineWidth, color;
  let frequency = 0.002;
  let amplitude = 90;

  const colors = colourmap({
    colormap: "magma", // ALTERNATIVE: 'salinity'
    nshade: amplitude, // Number of shades in the colormap (mapped to amplitude)
  });

  for (let i = 0; i < numCells; i++) {
    // Calculate initial position of the point:
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;

    n = random.noise2D(x, y, frequency, amplitude, color);
    // x += n;
    // y += n;

    // Determine the line width and color based on noise
    lineWidth = math.mapRange(n, -amplitude, amplitude, 0, 5);
    color =
      colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];

    points.push(new Point({ x, y, lineWidth, color }));
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my); // Translate to apply margins
    context.translate(cw * 0.5, ch * 0.5); // Center each cell's origin
    context.strokeStyle = "red"; // Note: you have set strokeStyle() further down
    context.lineWidth = 4;

    // Update positions:
    points.forEach((point) => {
      n = random.noise2D(
        point.ix + frame * 3, // Adds dynamic movement over time
        point.iy,
        frequency,
        amplitude,
        color
      );
      point.x = point.ix + n;
      point.y = point.iy + n;
    });

    let lastx, lasty; // Variables to store the last point's position

    // Draw lines for each row:
    for (let r = 0; r < rows; r++) {
      // context.beginPath();

      for (let c = 0; c < cols - 1; c++) {
        // Get the current and next points
        const curr = points[r * cols + c + 0];
        const next = points[r * cols + c + 1];

        /*
        if (!c) context.moveTo(point.x, point.y); // '!c' OR 'c == 0'
        else context.lineTo(point.x, point.y);
        */

        // Calculate a midpoint between the current and next points
        const mx = curr.x + (next.x - curr.x) * 0.8;
        const my = curr.y + (next.y - curr.y) * 5.5;

        /*
        // To make points behave in the same way <-- first point was linear
        if (c == 0) context.moveTo(curr.x, curr.y);
        else if (c == cols - 2)
          context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
        else context.quadraticCurveTo(curr.x, curr.y, mx, my);
        */

        // On the first point of each row, initialize `lastx` and `lasty`
        if (!c) {
          lastx = curr.x;
          lasty = curr.y;
        }

        // Start a new path for each line segment
        context.beginPath();
        context.lineWidth = curr.lineWidth;
        context.strokeStyle = curr.color;

        // Draw a quadratic curve from the last point to the midpoint
        context.moveTo(lastx, lasty);
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
        context.stroke();

        // Update `lastx` and `lasty` for the next iteration
        lastx = mx - (c / cols) * 250;
        lasty = my - (r / rows) * 250;
      }
    }

    // points.forEach((point) => {
    //   point.draw(context);
    // });

    context.restore();
  };
};

canvasSketch(sketch, settings);

class Point {
  constructor({ x, y, lineWidth, color }) {
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;

    // Inital positions ( for resetting or noise calculations):
    this.ix = x;
    this.iy = y;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();

    context.restore();
  }
}
