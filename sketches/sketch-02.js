const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
};

/* NO LONGER NEEDED AS YOU HAVE INTEGRATED canvas-sketch-util LIBRARY
// Function to convert degrees to radians
const degToRad = (degrees) => {
  return (degrees / 180) * Math.PI;
};
*/

const sketch = () => {
  return ({ context, width, height }) => {
    // Creating a gradient background
    const gradientBackground = context.createLinearGradient(0, 0, 0, height);
    gradientBackground.addColorStop(0.1, "#22092C");
    gradientBackground.addColorStop(0.25, "#872341");
    gradientBackground.addColorStop(0.5, "#BE3144");
    gradientBackground.addColorStop(0.75, "#F05941");

    // Applying shadow effect
    context.shadowColor = "#B2B377";
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    // Filling the background with the gradient
    context.fillStyle = gradientBackground;
    context.fillRect(0, 0, width, height);

    // Calculating center coordinates of the canvas
    const cx = width * 0.5;
    const cy = height * 0.5;

    // Width and height of the rectangles
    const w = width * 0.01;
    const h = height * 0.1;

    let x, y; // Variables to store coordinates

    const num = 40; // Number of rectangles
    const radius = width * 0.3; // Radius of the circle on which rectangles are placed

    for (let i = 0; i < num; i++) {
      // Calculating angle for each rectangle
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      // Calculating coordinates of each rectangle
      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      // Applying transformations to each rectangle
      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0.1, 2), random.range(0.2, 0.5));

      // Drawing the rectangle
      context.fillStyle = "white";
      context.beginPath();
      context.rect(-w * 0.5, random.range(0, h * 0.5), w, h);
      context.fill();
      context.restore();
