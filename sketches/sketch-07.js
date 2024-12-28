// CHANGES NEED TO BE MADE, SEARCH '**'
const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

// Parameters for controlling the sketch
const params = {
  radiusMin: 50,
  radiusMax: 200,
  blobAmount: 9,
  xPosMin: 0,
  Frequency: 0.002,
  Amplitude: 0.3,
};

const sketch = ({ width, height }) => {
  const blobs = []; // Array to store blob objects

  // Generate randomly sized and x-positioned 'blobs' that will appear from the bottom
  for (let i = 0; i < params.blobAmount; i++) {
    // Define parameters of blob
    const r = random.range(params.radiusMin, params.radiusMax);
    const x = random.range(params.xPosMin, width);
    const y = height + r;
    const u = -r * 2; // Define upper limit of canvas for the blob to then disappear
    const l = height + r * 2; // Define lower limit of canvas for the blob to then disappear

    blobs.push(new Blob(x, y, r, u, l)); // Creating new agent object and adding it to the array
  }

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

    blobs.forEach((blob, index) => {
      // Log the blob's properties for debugging
      console.log(
        `Blob: x=${blob.x}, y=${blob.y}, u=${blob.upperLimit}, l=${blob.lowerLimit}`
      );

      // Define the gradient for each blob at its position //** TO CHANGE: add ?perlean noise to differentiate color, like a blob
      const gradientBlob = context.createLinearGradient(
        width * 0.5, // x-axis start point
        0, // y-axis start point
        width * 0.5, // x-axis end point
        height // y-axis end point
      );
      gradientBlob.addColorStop(0.025, "#FFF");
      gradientBlob.addColorStop(0.5, "#F4A261");
      gradientBlob.addColorStop(0.75, "#E9C46A");
      context.shadowColor = "#E9C46A"; //"#4F1787"; // Setting shadow color
      context.shadowBlur = 20; // Setting shadow blur
      context.shadowOffsetX = 0; // Setting x-axis shadow offset
      context.shadowOffsetY = 0; // Setting y-axis shadow offset

      context.save();
      context.beginPath();
      context.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
      context.fillStyle = gradientBlob;
      context.fill();
      context.restore();

      // Define 1D noise to move blob vertically
      const n1D = random.noise1D(blob.x, params.Frequency, params.Amplitude);
      blob.y += n1D * 10; // Update blob's y-coordinates

      // To replace blob if reaches a certain height
      if (blob.y <= blob.upperLimit || blob.y >= blob.lowerLimit) {
        const newBlob = new Blob(
          random.range(params.xPosMin, width),
          random.boolean()
            ? random.range(-params.radiusMax * 2, -params.radiusMax)
            : random.range(
                height + params.radiusMax,
                height + params.radiusMax * 2
              ),
          random.range(params.radiusMin, params.radiusMax),
          blob.upperLimit,
          blob.lowerLimit
        );
        blobs.splice(index, 1, newBlob); // Replaces one blob from position(index) in array with new
      }
    });
  };
};

canvasSketch(sketch, settings);

class Blob {
  constructor(x, y, radius, upperLimit, lowerLimit) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.upperLimit = upperLimit;
    this.lowerLimit = lowerLimit;
  }
}
