const canvasSketch = require("canvas-sketch"); // Importing the canvas-sketch library

const settings = {
  dimensions: [1080, 1080], // Setting canvas dimensions to 1080x1080 pixels
  // pixelsPerInch: 300, // Optionally, adjust pixel density for printing
  // orientation: 'landscape' // Optionally, set orientation for printing
};

const sketch = () => {
  // Defining the main sketch function
  return ({ context, width, height }) => {
    // Returning a function that will be called by the canvas-sketch library
    // Black canvas background
    context.fillRect(0, 0, width, height); // Drawing a black background for the canvas
    context.fillStyle = "black"; // Setting fill color to black

    // Creating outer gradient
    const gradientOuter = context.createLinearGradient(0, 0, width, height);
    gradientOuter.addColorStop(0.25, "#57C5B6");
    gradientOuter.addColorStop(0.25, "#159895"); // Duplicated color stops create distinct color transitions
    gradientOuter.addColorStop(0.5, "#159895");
    gradientOuter.addColorStop(0.5, "#1A5F7A");
    gradientOuter.addColorStop(0.75, "#1A5F7A");
    gradientOuter.addColorStop(0.75, "#002B5B");

    // Declaring variables for grid dimensions and spacing
    const w = width * 0.1; // Width of each square
    const h = height * 0.1; // Height of each square
    const gap = width * 0.05; // Gap between squares
    const ix = width * 0.16; // Initial x position of the grid
    const iy = height * 0.16; // Initial y position of the grid

    let x, y; // Variables to store current position within the grid

    // Creating square grid
    for (let i = 0; i < 5; i++) {
      // Loop for rows
      for (let j = 0; j < 5; j++) {
        // Loop for columns
        x = ix + (w + gap) * i; // Calculating x position of current square
        y = iy + (h + gap) * j; // Calculating y position of current square

        // Drawing main squares
        context.strokeStyle = gradientOuter; // Setting stroke color to the outer gradient
        context.shadowBlur = 0; // Disabling shadow effect for main squares
        context.lineWidth = width * 0.01; // Setting line width for main squares

        context.beginPath(); // Begin drawing path for main square
        context.rect(x, y, w, h); // Drawing main square
        context.stroke(); // Stroke the path

        // Creating smaller squares within grid
        const off = width * (0.03 + (Math.random() * (0.03 - 0) + 0)); // Randomizing size of smaller squares

        // Randomly drawing smaller squares
        if (Math.random() > 0.5) {
          // Characteristics for smaller squares
          context.lineWidth = width * 0.005; // Setting line width for smaller squares
          context.strokeStyle = "#F5F3C1"; // Setting stroke color for smaller squares
          context.shadowColor = "pink"; // Setting shadow color for smaller squares
          context.shadowBlur = 10; // Setting shadow blur for smaller squares
          context.shadowOffsetX = 0; // Setting shadow offset for smaller squares
          context.shadowOffsetY = 0;

          context.beginPath(); // Begin drawing path for smaller square
          context.rect(x + off * 1.5, y + off * 1.5, w - off * 3, h - off * 3); // Drawing smaller square
          context.stroke(); // Stroke the path
        }
      }
    }
  };
};

canvasSketch(sketch, settings); // Initializing canvas-sketch with the sketch function and settings
