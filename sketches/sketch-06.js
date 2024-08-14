const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    // Define the linear gradient for background
    const gradientLinear = context.createLinearGradient(
      width * 0.5, // x-axis start point
      0, // y-axis start point
      width * 0.5, // x-axis end point
      height // y-axis end point
    );
    gradientLinear.addColorStop(0.025, "#57C5B6");
    gradientLinear.addColorStop(0.1, "#159895");
    gradientLinear.addColorStop(0.25, "#1A5F7A");
    gradientLinear.addColorStop(0.5, "#002B5B");
    gradientLinear.addColorStop(0.75, "#17153B");

    context.fillStyle = gradientLinear;
    context.fillRect(0, 0, width, height);

    // *** IDEA ONE ***
    // 1. Create dots to mimic ocean (from top view):
    // Declaring variables for spacing and number of circles
    const gap = width * 0.025;
    const yGap = gap * 0.4; // Adjust y-gap to be smaller
    let num = 25;

    // Calculate the total width and height of the grid
    const gridWidth = gap * (num - 1) + (num - 1) * 0.5 * gap; // Additional offset (i * gap * 0.5) to account for the shifting of circles in each row to create the diamond shape.
    const gridHeight = yGap * (num - 1);

    // Calculate the top-left corner of the grid to center it
    let ix = (width - gridWidth) * 0.5;
    let iy = (height - gridHeight) * 0.5;

    // Draw circles in a diamond shape
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        // Reduce the number of circles in each row
        let x = ix + gap * j + i * gap * 0.5; // Offset each row to create the diamond shape
        let y = iy + yGap * i;

        context.save();

        context.translate(x, y);

        // Define the radial gradient for each circle at its position
        const gradientRadial = context.createRadialGradient(
          -2, // x-axis of start circle
          -2, // y-axis of the start circle
          0, // radius of start circle
          0, // x-axis of end circle
          0, // y-axis of end circle
          10 // radius of end circle
        );
        gradientRadial.addColorStop(0, "#E9C46A");
        gradientRadial.addColorStop(0.9, "#F4A261");

        context.shadowColor = "#E9C46A"; //"#4F1787"; // Setting shadow color
        context.shadowBlur = 5; // Setting shadow blur
        context.shadowOffsetX = 0; // Setting x-axis shadow offset
        context.shadowOffsetY = 0; // Setting y-axis shadow offset

        context.beginPath();
        context.arc(0, 0, 5, 0, Math.PI * 2);
        context.fillStyle = gradientRadial;
        context.strokeStyle = "#E76F51";
        context.fill();
        context.stroke();

        context.restore();
      }
    }
    // iii. Have dots behave to Perlin Noise by concentrating together -> 2D or 3D?
    // a. The closer the dots are, the higher the water
    // 2. Add No-face mask
    // i. No-face mask to move in response to Perlin Noise

    // *** IDEA TWO ***
    // 1. Create a "invisible" marker with circular movement
    // 2. At a new position, have a circle be generated
    // i. Make the circle fade after a 2seconds
    //
  };
};

canvasSketch(sketch, settings);
