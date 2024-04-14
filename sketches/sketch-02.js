const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
};

/* NO LONGER NEEDED AS YOU HAVE INTEGRATED canvas-sketch-util LIBRARY
const degToRad = (degrees) => {
  // Converting number - representing *degrees* - into *radians*
  return (degrees / 180) * Math.PI;
};
*/

const sketch = () => {
  return ({ context, width, height }) => {
    const gradientBackground = context.createLinearGradient(0, 0, 0, height);
    gradientBackground.addColorStop(0.1, "#22092C");
    gradientBackground.addColorStop(0.25, "#872341");
    gradientBackground.addColorStop(0.5, "#BE3144");
    gradientBackground.addColorStop(0.75, "#F05941");

    context.shadowColor = "#B2B377";
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.fillStyle = gradientBackground;
    context.fillRect(0, 0, width, height);

    const cx = width * 0.5; // Represent the center of the canvas
    const cy = height * 0.5;

    const w = width * 0.01;
    const h = height * 0.1;
    let x, y; // These variables will be modified in the loop

    const num = 40;
    const radius = width * 0.3; // Radius of the circle on which the rectangles will be placed

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num); // Calculates angle of each slice, then converts to radians
      const angle = slice * i; // = Incrementing each slice to appear at 30, 60, 90, etc.

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);
      /* Alternatively you can remove cx and cy from lines directly above, and add an additional 
      context.translate(cx, cy) below */

      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0.1, 2), random.range(0.2, 0.5)); // Modifiable

      context.fillStyle = "white";
      context.beginPath();
      context.rect(-w * 0.5, random.range(0, h * 0.5), w, h); // Modifiable
      context.fill();
      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-angle); // Why do we need another rotate transformation here?

      context.lineWidth = random.range(5, 20); // Modifiable arcs

      context.strokeStyle = "white";
      context.beginPath();
      context.arc(
        0,
        0,
        radius * random.range(0.7, 1.3), // ALTERNATIVELY: random.range(radius * 0.7, radius * 1.3)
        slice * random.range(1, -8),
        slice * random.range(1, 5)
      ); // Modifiable
      context.stroke();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
