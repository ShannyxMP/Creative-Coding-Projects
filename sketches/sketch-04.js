const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  // Default values, but can be changed by the options within the pane
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: "butt",
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    // Setting the background color of the canvas to white
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    // Defining the grid dimensions
    const cols = params.cols;
    const rows = params.rows;
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

      const f = params.animate ? frame : params.frame; // <=TERNARY OPERATOR -- Here you want the value of 'f' to be frame when parameter animate is true; 'params.frame' when parameter animate is false

      // const n = random.noise2D(x + frame * 10, y, params.freq); // Here you are incrementing the value of 'x' in the noise2D function -> this results in the movement of the panels from right to left
      const n = random.noise3D(x, y, f * 10, params.freq); // Here you are using the frame as the third dimension

      const angle = n * Math.PI * params.amp; // Will produce number from -180 to 180degrees
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax); // ALTERNATIVE: const scale = ((n + 1) / 2) * 30; OR const scale = (n * 0.5 + 0.5) * 30;

      // Save the current transformation state
      context.save();

      // Translate the context to the center of the current cell
      context.translate(x, y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      // Set the line width for drawing
      context.lineWidth = scale;
      context.lineCap = params.lineCap;

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

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Grid" });
  folder.addInput(params, "lineCap", {
    options: { butt: "butt", round: "round", square: "square" },
  });
  folder.addInput(params, "cols", { min: 2, max: 50, step: 1 });
  folder.addInput(params, "rows", { min: 2, max: 50, step: 1 });
  folder.addInput(params, "scaleMin", { min: 1, max: 100 });
  folder.addInput(params, "scaleMax", { min: 1, max: 100 });

  folder = pane.addFolder({ title: "Noise" });
  folder.addInput(params, "freq", { min: -0.01, max: 0.01 });
  folder.addInput(params, "amp", { min: 0, max: 1 });
  folder.addInput(params, "frame", { min: 0, max: 999 });
  folder.addInput(params, "animate"); // Note that you are adding no options here unlike above, Tweakpane treats this as a boolean value
};

createPane();

// Create the canvas sketch with the defined sketch and settings
canvasSketch(sketch, settings);
