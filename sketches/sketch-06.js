const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    // *** IDEA ONE ***
    // 1. Create dots to mimic ocean (from top view):
    // i. Set dots spaced apart
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

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        // Reduce the number of circles in each row
        let x = ix + gap * j + i * gap * 0.5; // Offset each row to create the diamond shape
        let y = iy + yGap * i;

        context.save();
        context.translate(x, y);

        context.beginPath();
        context.arc(0, 0, 5, 0, Math.PI * 2);
        context.fillStyle = "grey";
        context.strokeStyle = "grey";
        context.fill();
        context.stroke();

        context.restore();
      }
    }
    // ii. Alter colour - change gradient to spherical
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
