const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

// Parameters for controlling the sketch
const params = {
  radiusMin: 40,
  radiusMax: 200,
  blobAmount: 20,
  xPosMin: 0,
  Frequency: 0.001,
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
    const o = random.range(0, 1000); // Noise offset to allow blobs to move independently rather than in unison

    blobs.push(new Blob(x, y, r, u, l, o)); // Creating new agent object and adding it to the array
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
      /* //Log the blob's properties for debugging
      console.log(
        `Blob: x=${blob.x}, y=${blob.y}, u=${blob.upperLimit}, l=${blob.lowerLimit}`
      );
      */

      // Define the gradient for each blob at its position: LINEAR OR RADIAL

      /* LINEAR GRADIENT DESIGN
          const gradientBlob = context.createLinearGradient(
            width * 0.5, // x-axis start point
            0, // y-axis start point
            width * 0.5, // x-axis end point
            height // y-axis end point
          );
          gradientBlob.addColorStop(0.025, "rgba(255, 255, 255, 1)");
          gradientBlob.addColorStop(0.5, "rgba(255, 204, 102, 1)");
          gradientBlob.addColorStop(0.75, "rgba(255, 153, 51, 1)");
          context.shadowColor = "#E9C46A"; // Setting shadow color
          context.shadowBlur = 75; // Setting shadow blur
          context.shadowOffsetX = 0; // Setting x-axis shadow offset
          context.shadowOffsetY = 0; // Setting y-axis shadow offset
      */

      /* RADIAL GRADIENT DESIGN */
      const gradientBlob = context.createRadialGradient(
        blob.x, // x-coordinate for inner circle
        blob.y, // y-coordinate for inner circle
        blob.radius * 0.1, // inner circle radius
        blob.x, // x-coordinate for outer circle
        blob.y, // y-coordinate for outer circle
        blob.radius // outer circle radius
      );
      gradientBlob.addColorStop(0, "rgb(250, 213, 140)"); // Light highlight
      gradientBlob.addColorStop(0.25, "rgba(255, 204, 102, 1)"); // Midtone
      gradientBlob.addColorStop(0.85, "rgba(255, 153, 51, 1)"); // Dark shadow
      gradientBlob.addColorStop(1, "rgba(255, 128, 0, 0.75)"); // Dark shadow
      context.shadowColor = "#E9C46A"; // Setting shadow color
      context.shadowBlur = 75; // Setting shadow blur
      context.shadowOffsetX = 0; // Setting x-axis shadow offset
      context.shadowOffsetY = 0; // Setting y-axis shadow offset

      context.save();
      context.beginPath();
      context.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
      context.fillStyle = gradientBlob;
      context.fill();
      context.restore();

      // Define 1D noise to move blob vertically
      const n1D = random.noise1D(
        blob.noiseOffset,
        params.Frequency,
        params.Amplitude
      );
      blob.y += (n1D * 10) / 4; // Update blob's y-coordinates
      blob.noiseOffset += 0.01;

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
          blob.lowerLimit,
          random.range(0, 1000)
        );
        blobs.splice(index, 1, newBlob); // Replaces one blob from position(index) in array with new
      }
    });
  };
};

canvasSketch(sketch, settings);

class Blob {
  constructor(x, y, radius, upperLimit, lowerLimit, noiseOffset) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.upperLimit = upperLimit;
    this.lowerLimit = lowerLimit;
    this.noiseOffset = noiseOffset;
  }
}
