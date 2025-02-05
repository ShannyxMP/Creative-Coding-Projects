const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const eases = require("eases");
const colormap = require("colormap");
const interpolate = require("color-interpolate");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const particles = [];
const cursor = { x: 9999, y: 9999 }; // Store the position of the cursor in an object that is visible on the sketch// Cursor position (initially out of view)

const colors = colormap({
  colormap: "viridis",
  nshades: 20,
});

let elCanvas;
let imgA, imgB;

const sketch = ({ width, height, canvas }) => {
  let x, y, particle, radius;
  // let pos = [];

  // Create offscreen canvases for image data processing:
  const imgACanvas = document.createElement("canvas");
  const imgAContext = imgACanvas.getContext("2d");

  const imgBCanvas = document.createElement("canvas");
  const imgBContext = imgBCanvas.getContext("2d");

  // Set canvas sizes to match the input images
  imgACanvas.width = imgA.width;
  imgACanvas.height = imgA.height;

  imgBCanvas.width = imgB.width;
  imgBCanvas.height = imgB.height;

  // Draw images onto the offscreen canvases
  imgAContext.drawImage(imgA, 0, 0);
  imgBContext.drawImage(imgB, 0, 0);

  // Extract image data (pixel color information)
  const imgAData = imgAContext.getImageData(0, 0, imgA.width, imgA.height).data;
  const imgBData = imgBContext.getImageData(0, 0, imgB.width, imgB.height).data;

  // Parameters for particle circles:
  const numCircles = 30;
  const gapCircle = 2;
  const gapDot = 2;
  let dotRadius = 12;
  let cirRadius = 0;
  const fitRadius = dotRadius;

  elCanvas = canvas; // Reference the canvas element
  canvas.addEventListener("mousedown", onMouseDown); // Add interaction listener

  /* Creates randomised particles:
  for (let i = 0; i < 200; i++) {
    x = width * 0.5;
    y = height * 0.5;

    random.insideCircle(400, pos); // Populates a random x & y value - ie. a 2D point
    x += pos[0];
    y += pos[1];

    particle = new Particle({ x, y });

    particles.push(particle);
  }
 */

  // Generate particles distributed along concentric circles
  for (let i = 0; i < numCircles; i++) {
    const circumference = Math.PI * 2 * cirRadius; // Circumference of the current circle
    const numFit = i ? Math.floor(circumference / (fitRadius * 2 + gapDot)) : 1; // Number of dots that fit on this circle
    const fitSlice = (Math.PI * 2) / numFit; // Angle between each dot

    let ix, iy, idx, r, g, b, colA, colB, colMap;

    for (let j = 0; j < numFit; j++) {
      const theta = fitSlice * j; // Angle for the current dot

      // Calculate x and y positions of the dot:
      x = Math.cos(theta) * cirRadius;
      y = Math.sin(theta) * cirRadius;

      x += width * 0.5; // Center x on the canvas
      y += height * 0.5; // Center y on the canvas

      // Get the color from imgA at the dot's position
      ix = Math.floor((x / width) * imgA.width);
      iy = Math.floor((y / height) * imgA.height);
      idx = (iy * imgA.width + ix) * 4; // Index in the image data array

      r = imgAData[idx + 0];
      g = imgAData[idx + 1];
      b = imgAData[idx + 2];
      colA = `rgb(${r}, ${g}, ${b})`;

      // radius = dotRadius;
      radius = math.mapRange(r, 0, 255, 1, 12); // Map the radius to the brightness of imgA

      // Get the color from imgB at the same position:
      r = imgBData[idx + 0];
      g = imgBData[idx + 1];
      b = imgBData[idx + 2];
      colB = `rgb(${r}, ${g}, ${b})`;

      colMap = interpolate([colA, colB]); // Create an interpolated color map between colA and colB

      particle = new Particle({ x, y, radius, colMap });
      particles.push(particle);
    }

    // Update circle radius and reduce dot size for the next circle:
    cirRadius += fitRadius * 2 + gapCircle;
    dotRadius = (1 - eases.quadOut(i / numCircles)) * fitRadius; // WITHOUT 'eases.quadOut()' it changes the size of the particle outwards, *linearly*
  }

  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.drawImage(imgACanvas, 0, 0);

    particles.sort((a, b) => a.scale - b.scale); // Removing this line with layer particles based on when they're drawn in the loop
    // ^ Sorts larger particles to be at the top layer of the canvas

    particles.forEach((particle) => {
      particle.update();
      particle.draw(context);
    });
  };
};

// Handle mouse interaction
const onMouseDown = (e) => {
  window.addEventListener("mousemove", onMouseMove); // Track mouse movement
  window.addEventListener("mouseup", onMouseUp);

  onMouseMove(e); // Trigger movement handler immediately
};

const onMouseMove = (e) => {
  // Calculate the position of the cursor proportional to the scale of the sketch (refer to sketch-curves-intro.js)
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  cursor.x = x;
  cursor.y = y;

  console.log(cursor);
};

const onMouseUp = () => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);

  // To reset values so that they are not near the particles when not dragging the cursor:
  cursor.x = 9999;
  cursor.y = 9999;
};

const loadImage = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

const start = async () => {
  imgA = await loadImage("images/image-02.png");
  imgB = await loadImage("images/image-01.png");

  canvasSketch(sketch, settings);
};

start();

class Particle {
  constructor({ x, y, radius = 10, colMap }) {
    // Initial Position:
    this.ix = x;
    this.iy = y;

    // Position
    this.x = x;
    this.y = y;

    // Acceleration:
    this.ax = 0;
    this.ay = 0;

    // Velocity:
    this.vx = 0;
    this.vy = 0;

    this.radius = radius;
    this.scale = 1;
    this.colMap = colMap; // Color interpolation function
    this.color = colMap(0); // Initial color

    this.minDist = random.range(100, 200);
    this.pushFactor = random.range(0.01, 0.02);
    this.pullFactor = random.range(0.002, 0.006);
    this.dampFactor = random.range(0.9, 0.95); // To have particle eventually revert to original position as opposed to building momentum
  }

  update() {
    //? Is the update() supposed to precede the draw() in this class? And why?

    let dx, dy, dd, distDelta;
    let idxColor;

    // Pull force to the particle (declared before push as it acts constantly):
    dx = this.ix - this.x;
    dy = this.iy - this.y;
    dd = Math.sqrt(dx * dx + dy * dy); // Distance to the initial position

    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    // Update scale and color based on distance from the initial position
    this.scale = math.mapRange(dd, 0, 200, 1, 5);
    this.color = this.colMap(math.mapRange(dd, 0, 200, 0, 1, true));

    // idxColor = Math.floor(math.mapRange(dd, 0, 200, 0, colors.length - 1, true));
    // this.color = colors[idxColor];

    // Push force when the cursor is near
    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * distDelta * this.pushFactor;
      this.ay += (dy / dd) * distDelta * this.pushFactor;
    }

    // Increment the velocity by the acceleration:
    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.dampFactor;
    this.vy *= this.dampFactor;

    // Increment the position by the velocity:
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.color;

    context.beginPath();
    context.arc(0, 0, this.radius * this.scale, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
