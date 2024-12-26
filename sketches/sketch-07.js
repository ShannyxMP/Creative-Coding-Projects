const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
  // animate: true,
};

const sketch = () => {
  return ({ context, width, height }) => {
    // Array of blobs
    // Create random 'blobs' that will appear from the bottom
    // *Generate the blob + randomise size (don't forget to create a class)
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
  };
};

canvasSketch(sketch, settings);
