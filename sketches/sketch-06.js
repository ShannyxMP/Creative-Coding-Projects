const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const colormap = require("colormap");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

// Global variables for interaction and animation:
let elCanvas;
let mx, my;
let isMouseDown = false;
let transition = 0;
const rate = 0.001; // Speed of transition
const cursor = { x: 9999, y: 9999 }; // Store the position of the cursor in an object that is visible on the sketch - initial cursor position (out of view)

/**
 * Main sketch function that sets up the canvas and initializes objects.
 */
const sketch = ({ context, width, height, canvas }) => {
  // Define grid dimensions:
  const cols = 50;
  const rows = 50;
  const numCells = cols * rows;
  // Define grid scale:
  const gw = width;
  const gh = height * 0.9; // Smaller to compress orbs closer together
  // Cells:
  const cw = gw / cols;
  const ch = gh / rows;

  const orbs = [];

  let offset = 25; // To shift each row horizontally to create a diamond shape
  let x, y, color;
  let fox, foy, lox, loy; // First orb and last orb's: x and y positions (to create an even margin that centres the drawing regardless of size)
  let frequency = 0.002;
  let amplitude = 90;

  // Generate color palette
  const colors = colormap({
    colormap: "phase",
    nshade: amplitude,
  });

  elCanvas = canvas; // Store reference to the canvas element
  canvas.addEventListener("mousedown", onMouseDown); // Add interaction listener

  // Populate the grid with orbs
  for (i = 0; i < cols; i++) {
    for (j = 0; j < rows; j++) {
      x = cw * i + j * offset;
      y = ch * j;

      let n = random.noise2D(x, y, frequency, amplitude, color);

      color =
        colors[
          Math.floor(
            math.mapRange(n, -amplitude, amplitude, 0, amplitude * 0.8)
          )
        ];

      orbs.push(new Orb({ x, y, radius: 5, color }));
    }
  }

  // Capture first and last orb positions for centering
  fox = orbs[0].x; // First orb's x pos
  foy = orbs[0].y;
  lox = orbs[numCells - 1].x; // Last orb's x pos
  loy = orbs[numCells - 1].y;
  // console.log(fox, foy, lox, loy);

  // Calculate margin offsets for centering the orbs in the canvas
  const ta = foy - loy; // Total height
  const tb = fox - lox; // Total width
  // console.log(ta, tb);

  // Margin:
  mx = (width - -tb) * 0.5;
  my = (height - -ta) * 0.5;

  /**
   * Animation loop that updates and draws the scene.
   */
  return ({ context, width, height, frame }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);

    // Adjust transition state based on mouse state
    if (isMouseDown) {
      transition += rate; // To slowly uptitrate transitioning once mouse down
      if (transition >= 1) {
        transition = 1;
      }
    }
    if (isMouseDown == false) {
      transition -= rate; // To slowly downtitrate from transion once mouse up
      if (transition <= 0) {
        transition = 0;
      }
    }
    // console.log(transition);

    // Update and draw orbs
    orbs.forEach((orb) => {
      n = random.noise2D(
        orb.ix + frame * 3,
        orb.iy,
        frequency,
        amplitude,
        color
      );
      orb.x = orb.ix + n;
      orb.y = orb.iy + n;

      orb.update();
      orb.draw(context);
    });

    context.restore();
  };
};

/**
 * Handles mouse down event, enabling interaction.
 */
const onMouseDown = (event) => {
  window.addEventListener("mousemove", onMouseMove); // Track mouse movement
  window.addEventListener("mouseup", onMouseUp);

  onMouseMove(event); // Update cursor position immediately

  isMouseDown = true; // Mouse is pressed, start uptitrating transition rate
};

/**
 * Handles mouse movement, updating the cursor's position relative to the sketch.
 */
const onMouseMove = (event) => {
  // Calculate the position of the cursor proportional to the scale of the sketch (refer to sketch-curves-intro.js)
  const x = (event.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (event.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  cursor.x = x - mx;
  cursor.y = y - my;
  // console.log(cursor);
};

/**
 * Handles mouse up event, disabling interaction.
 */
const onMouseUp = () => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);

  isMouseDown = false; // Mouse released, start downtitrating transition
};

canvasSketch(sketch, settings);

/**
 * Orb class representing each individual moving orb.
 */
class Orb {
  constructor({ x, y, radius, color }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colors = color;

    // Initial positions and radius (for resetting/noise calculations):
    this.ix = x;
    this.iy = y;
    this.iradius = radius;

    // Interaction properties
    this.minDist = 100; // Distance threshold for interaction
  }

  /**
   * Updates the orb's position based on cursor proximity.
   */
  update() {
    let dx = this.x - cursor.x;
    let dy = this.y - cursor.y;
    let dd = Math.sqrt(dx * dx + dy * dy); // Distance to cursor

    // If close to cursor, apply force
    if (dd < this.minDist) {
      let force = (this.minDist - dd) * 0.05; // Strength of movement
      if (isMouseDown == true) {
        // For orbs to slowly transition to cursor interaction positions
        this.x += dx * force * transition;
        this.y += dy * force * 0.1 * transition;
      } else {
        // Smoothly revert back to original positions one 'isMouseDown' is false
        this.x += dx * force * transition;
        this.y += dy * force * 0.1 * transition;
      }
    }
  }

  /**
   * Draws the orb on the canvas.
   */
  draw(context) {
    context.save();
    context.translate(this.x, this.y);

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.colors;
    context.fill();

    context.restore();
  }
}
