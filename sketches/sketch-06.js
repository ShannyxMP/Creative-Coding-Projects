const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    // 1. Import No-Face mask
    // 2. Create dots to mimic ocean (from top view):
    // i. Set dots spaced apart
    // ii. Alter colour
    // iii. Have dots behave to Perlin Noise by concentrating together -> 2D or 3D?
    // a. The closer the dots are, the higher the water
    // 3. No-face mask to move in response to Perlin Noise
  };
};

canvasSketch(sketch, settings);
