const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const Color = require("canvas-sketch-util/Color"); // To use offsetHSL method ('converts': allows RGBA -> to be further manipulated with HSL)
const risoColors = require("riso-colors"); // Provides a predefined palette of vibrant colors often used in print design

const seed = random.getRandomSeed(); // Favourable seeds: '664120', '723624', '368372', '550799', '948015', '361388', '155393', '515933'
console.log(seed);

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  name: seed, // Save images with the seed name for reproducibility
};

// Utility function for calculating movement components based on angle
const getMovementComponents = (degrees) => {
  const angle = math.degToRad(degrees);
  return {
    xFraction: Math.cos(angle),
    yFraction: Math.sin(angle),
  };
};

const sketch = ({ width, height }) => {
  random.setSeed(seed); // Can be a number or string or variable

  let x, y, w, h, fill, stroke, blend, dir, speed; // Variables for rectangle properties: position, size, fill/stroke colors, and blending mode

  const num = 40; // Number of rectangles to be drawn
  const degrees = -30; // Skew angle for the rectangles in degrees

  const rects = []; // Array to store all rectangle objects

  const rectColors = [random.pick(risoColors), random.pick(risoColors)]; // Creating array for random.pick() to choose between 2 colours from the Riso palette rather than the entire library (to keep color scheme consistent)

  const bgColor = random.pick(risoColors).hex; // Background color picked randomly from the Riso palette

  // Define a clipping mask:
  const mask = {
    radius: width * 0.4,
    sides: 6, // Number of sides (hexagon)
    x: width * 0.5,
    y: height * 0.5,
  };

  // Create rectangles with random properties
  for (let i = 1; i < num; i++) {
    x = random.range(0, width); // Random X position within canvas width
    y = random.range(0, height); // Random Y position
    w = random.range(600, width); // Random rectangle width
    h = random.range(40, 200); // Random rectangle height
    dir = random.value(); // Determinant for direction of rectangles
    speed = random.range(1, 10); // Determines speed of movement

    stroke = random.pick(rectColors).hex; // Random stroke color from the two selected Riso colors
    fill = random.pick(rectColors).hex; // Random fill color from the two selected Riso colors
    blend = random.value() > 0.5 ? "overlay" : "source-over"; // Randomly assigns one of two blending modes for visual variety

    rects.push({ x, y, w, h, fill, stroke, blend, dir, speed }); // Adds a rectangle object with its properties to the array
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    // Clipping objects within a polygon:
    context.save(); // Note: restore() is after rectangle objects are drawn

    context.translate(mask.x, mask.y);

    drawPolygon({ context, radius: mask.radius, sides: mask.sides });

    context.clip(); // Polygon becomes a clipping mask

    rects.forEach((rect) => {
      const { x, y, w, h, fill, stroke, blend, dir, speed } = rect; // Destructure the rectangle properties for easier access

      let shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5; // Sets the shadow's alpha (transparency) to 50%

      context.save();
      context.translate(-mask.x, -mask.y);
      context.translate(x, y);

      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;
      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;

      drawSkewedRect({ context, w, h, degrees });
      context.stroke();

      context.shadowColor = null;
      context.globalCompositeOperation = blend; // Set blending mode
      context.fill();
      context.globalCompositeOperation = "source-over"; // Reset blending mode

      // Adding another thin line over the rectangles:
      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.stroke();

      context.restore();

      // Update rectangle positioning:
      if (dir >= 0.1) {
        const { xFraction, yFraction } = getMovementComponents(-30);
        rect.x += xFraction * speed;
        rect.y += yFraction * speed;
      }

      // Rectangles to bounce back if out of canvas:
      if (rect.x > width || rect.x < 0) {
        rect.x = Math.max(0, Math.min(rect.x, width)); // Ensures rectangles remain within bounds
        rect.speed *= -1; // Reverse direction
      }
      if (rect.y > height || rect.y < 0) {
        rect.y = Math.max(0, Math.min(rect.y, height));
        rect.speed *= -1;
      }
    });

    context.restore(); // Ensures no clipping mask affects subsequent draws

    // Polygon outline:
    context.save();
    context.translate(mask.x, mask.y);
    context.lineWidth = 20;

    drawPolygon({
      context,
      radius: mask.radius - context.lineWidth,
      sides: mask.sides,
    });

    context.globalCompositeOperation = "color-burn";
    context.strokeStyle = rectColors[0].hex;
    context.stroke();

    context.restore();
  };
};

const drawSkewedRect = ({ context, w, h, degrees }) => {
  const { xFraction: rx, yFraction: ry } = getMovementComponents(degrees);
  context.translate(rx * -0.5, (h + ry * w) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx * w, ry * w);
  context.lineTo(rx * w, ry * w + h);
  context.lineTo(0, h);
  context.closePath();
};

const drawPolygon = ({ context, radius, sides }) => {
  const slice = (Math.PI * 2) / sides;

  context.beginPath();
  context.moveTo(0, -radius); // Start at the top

  for (let i = 1; i < sides; i++) {
    const theta = i * slice - math.degToRad(90); // Calculate angle for each vertex
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius); // Draw line to vertex
  }

  context.closePath();
};

canvasSketch(sketch, settings);
