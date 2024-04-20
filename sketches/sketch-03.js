const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
  animate: true, // Enables built-in animation loop
};

/* ALTERNATE WAY OF ANIMATING
// This alternate method is not used when 'animate: true' is set in settings
const animate = () => {
  requestAnimationFrame(animate);
  console.log("allo");
};
animate();
*/

const sketch = ({ context, width, height }) => {
  const agents = [];

  // Create agents with random positions and velocities
  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  // Return the rendering function for canvas-sketch
  return ({ context, width, height }) => {
    // Clear the canvas on each frame
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    // Update and draw each agent
    agents.forEach((agent) => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height); // Handle bouncing off canvas edges
    });
  };
};

// Initialize canvas-sketch with the sketch and settings
canvasSketch(sketch, settings);

// Define a Vector class for representing positions and velocities
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Define an Agent class representing moving entities on the canvas
class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1)); // Random initial velocity
    this.radius = random.range(4, 12); // Random radius
  }

  // Method to handle bouncing off canvas edges
  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  // Method to update agent's position
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  // Method to draw the agent on the canvas
  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}
