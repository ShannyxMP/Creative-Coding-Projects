const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const Color = require("canvas-sketch-util/Color"); // To use offsetHSL method ('converts': allows RGBA -> to be further manipulated with HSL)
const risoColors = require("riso-colors"); // Provides a predefined palette of vibrant colors often used in print design
const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = ({ width, height }) => {
  let x, y, w, h, fill, stroke, blend; // Variables for rectangle properties: position, size, fill/stroke colors, and blending mode

  const num = 40; // Number of rectangles to be drawn
  const degrees = -30; // Skew angle for the rectangles in degrees

  const rects = []; // Array to store all rectangle objects

  const rectColors = [random.pick(risoColors), random.pick(risoColors)]; // Creating array for random.pick() to choose between 2 colours from the Riso palette rather than the entire library (to keep color scheme consistent)

  const bgColor = random.pick(risoColors).hex; // Background color picked randomly from the Riso palette

  for (let i = 1; i < num; i++) {
    x = random.range(0, width); // Random X position within canvas width
    y = random.range(0, height); // Random Y position
    w = random.range(600, width); // Random rectangle width
    h = random.range(40, 200); // Random rectangle height

    stroke = random.pick(rectColors).hex; // Random stroke color from the two selected Riso colors
    fill = random.pick(rectColors).hex; // Random fill color from the two selected Riso colors
    /*ALTERNATIVELY: fill = `rgba(${random.range(0, 255)}, ${random.range(0, 255)}, ${random.range(0, 255)}, 1)`; 
    // Note: Back ticks (``) are used here so you can add variables within */
    blend = random.value() > 0.5 ? "overlay" : "source-over"; // Randomly assigns one of two blending modes for visual variety

    rects.push({ x, y, w, h, fill, stroke, blend }); // Adds a rectangle object with its properties to the array
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      const { x, y, w, h, fill, stroke, blend } = rect; // Destructure the rectangle properties for easier access
      let shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5; // Sets the shadow's alpha (transparency) to 50%

      context.save();

      context.translate(x, y); // Move the origin to the rectangle's position

      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;
      // Drop shadow settings:
      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;

      drawSkewedRect({ context, w, h, degrees });

      context.stroke();
      context.shadowColor = null; // To remove double-shadows generated for both stroke() and fill() - this is deliberately beetween to avoid applying it to subsequent fill()
      context.globalCompositeOperation = blend; // Deliberately placed before the fill() function
      context.fill();
      context.globalCompositeOperation = "source-over"; // Resets the blending mode back to 'source-over'

      // Adding another thin line over the rectangles
      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.stroke();

      context.restore(); // Restore the canvas state to avoid affecting other rectangles
    });
  };
};

const drawSkewedRect = ({ context, w, h, degrees }) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w; // Horizontal offset based on the skew angle and width
  const ry = Math.sin(angle) * w; // Vertical offset based on the sine of the skew angle. This creates a proportional skew effect rather than a binary flip (as with Math.sign()), resulting in a smoother and more dynamic skew

  context.translate(rx * -0.5, (h + ry) * -0.5); // Centers the skewed rectangle at the current origin

  // Draw the rectangle one line at a time:
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.lineTo(0, 0);
  context.closePath();
};

canvasSketch(sketch, settings);
