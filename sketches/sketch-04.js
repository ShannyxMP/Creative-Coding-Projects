const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

// Parameters for controlling the sketch
const params = {
  Columns: 10, // Number of columns in the grid
  Rows: 10, // Number of Rows in the grid
  scaleMin: 1, // Minimum scale of the lines
  scaleMax: 30, // Maximum scale of the lines
  Frequency: 0.001, // Frequency of the noise
  Amplitude: 0.2, // Amplitude of the noise
  frame: 0, // Current frame number
  animate: true, // Whether to animate or not
  lineCap: "butt", // Line cap style (butt, round, square)
  strokeStyle: "#FFFFFF",
  fillStyle: "#000000",
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    // Setting the background color of the canvas to white
    context.fillStyle = params.fillStyle;
    context.fillRect(0, 0, width, height);

    // Defining the grid dimensions
    const Columns = params.Columns;
    const Rows = params.Rows;
    const numCells = Columns * Rows;

    // Calculating the dimensions and margins of the grid cells
    const gridw = width * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / Columns;
    const cellh = gridh / Rows;
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    // Looping through each cell in the grid
    for (let i = 0; i < numCells; i++) {
      const col = i % Columns; // Calculate column index (x-axis) of the current cell
      const row = Math.floor(i / Columns); // Calculate row index (y-axis) of the current cell

      // Calculate the position and size of the current cell
      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      // Use frame as the third dimension of noise when animation is enabled, otherwise, use the fixed frame value from params
      const f = params.animate ? frame : params.frame; // <=TERNARY OPERATOR -- Here you want the value of 'f' to be frame when parameter animate is true; 'params.frame' when parameter animate is false

      // const n = random.noise2D(x + frame * 10, y, params.Frequency); // Here you are incrementing the value of 'x' in the noise2D function -> this results in the movement of the panels from right to left
      const n = random.noise3D(x, y, f * 10, params.Frequency); // Here you are using the frame as the third dimension

      const angle = n * Math.PI * params.Amplitude; // Will produce number from -180 to 180degrees
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
      context.strokeStyle = params.strokeStyle;
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
  folder.addInput(params, "Columns", { min: 2, max: 50, step: 1 });
  folder.addInput(params, "Rows", { min: 2, max: 50, step: 1 });
  folder.addInput(params, "scaleMin", { min: 1, max: 100 });
  folder.addInput(params, "scaleMax", { min: 1, max: 100 });

  folder = pane.addFolder({ title: "Noise" });
  folder.addInput(params, "Frequency", { min: -0.01, max: 0.01 });
  folder.addInput(params, "Amplitude", { min: 0, max: 1 });
  folder.addInput(params, "frame", { min: 0, max: 999 });
  folder.addInput(params, "animate"); // Note that you are adding no options here unlike above, Tweakpane treats this as a boolean value

  folder = pane.addFolder({ title: "Colour" });
  folder.addInput(params, "fillStyle");
  folder.addInput(params, "strokeStyle");
};

createPane();

// Create the canvas sketch with the defined sketch and settings
canvasSketch(sketch, settings);
