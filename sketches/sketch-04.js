const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    // Setting the background color of the canvas to white
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    // Defining the grid dimensions
    const cols = 10;
    const rows = 10;
    const numCells = cols * rows;

    // Calculating the dimensions and margins of the grid cells
    const gridw = width * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    // Looping through each cell in the grid
    for (let i = 0; i < numCells; i++) {
      const col = i % cols; // Calculate column index (x-axis) of the current cell
      const row = Math.floor(i / cols); // Calculate row index (y-axis) of the current cell

      // Calculate the position and size of the current cell
      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      const n = random.noise2D(x + frame * 10, y, 0.001);
      const angle = n * Math.PI * 0.2; // Will produce number from -180 to 180degrees
      const scale = math.mapRange(n, -1, 1, 1, 30); // ALTERNATIVE: const scale = ((n + 1) / 2) * 30; OR const scale = (n * 0.5 + 0.5) * 30;

      // Save the current transformation state
      context.save();

      // Translate the context to the center of the current cell
      context.translate(x, y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      // Set the line width for drawing
      context.lineWidth = scale;

      // Draw a horizontal line in the center of the cell
      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.stroke();

      // Restore the previous transformation state
      context.restore();
    }
  };
};

// Create the canvas sketch with the defined sketch and settings
canvasSketch(sketch, settings);
