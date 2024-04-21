const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1080, 1080],
  animate: true, // Enables built-in animation loop
};

/* ALTERNATE WAY OF ANIMATING
// This alternate method is not used when 'animate: true' is set in settings
// Function to animate the sketch using requestAnimationFrame
const animate = () => {
  requestAnimationFrame(animate);
  console.log("allo"); // Logging 'allo' to console
};
animate(); // Invoking the animate function
*/

const sketch = ({ context, width, height }) => {
  const agents = []; // Array to store agent objects

  // Create agents with random positions and velocities
  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width); // Random x-coordinate within canvas width
    const y = random.range(0, height); // Random y-coordinate within canvas height

    agents.push(new Agent(x, y)); // Creating new agent object and adding it to the array
  }

  // Return the rendering function for canvas-sketch
  return ({ context, width, height }) => {
    // Clear the canvas on each frame
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    // Loop through agents array and draw connections between close agents
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        // Calculate distance between agents
        const dist = agent.pos.getDistance(other.pos);

        // Skip drawing connection if distance is too far
        if (dist > 200) continue;

        // Adjust line width based on distance
        context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);

        // Draw connection line between agents
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

    // Update and draw each agent
    agents.forEach((agent) => {
      agent.update(); // Update agent position
      agent.draw(context); // Draw agent on canvas
      agent.wrap(width, height); // Handle agent bouncing off canvas edges
    });
  };
};

// Initialize canvas-sketch with the sketch and settings
canvasSketch(sketch, settings);

// Define a Vector class for representing positions and velocities
class Vector {
  constructor(x, y) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
  }

  // Method to calculate distance between two vectors
  getDistance(v) {
    const dx = this.x - v.x; // Difference in x-coordinates
    const dy = this.y - v.y; // Difference in y-coordinates
    return Math.sqrt(dx * dx + dy * dy); // Euclidean distance formula
  }
}

// Define an Agent class representing moving entities on the canvas
class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y); // Position vector
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1)); // Random initial velocity vector
    this.radius = random.range(4, 12); // Random radius
  }

  // Method to handle wrap canvas edges
  wrap(width, height) {
    if (this.pos.x > width) this.pos.x = 0; // Wrap if it goes past right edge
    if (this.pos.y > height) this.pos.y = 0; // Wrap if it goes past bottom edge
    if (this.pos.x < 0) this.pos.x = width; // Wrap if it goes past left edge
    if (this.pos.y < 0) this.pos.y = height; // Wrap if it goes past top edge
  }

  // Method to update agent's position
  update() {
    this.pos.x += this.vel.x; // Update x-coordinate based on velocity
    this.pos.y += this.vel.y; // Update y-coordinate based on velocity
  }

  // Method to draw the agent on the canvas
  draw(context) {
    context.save(); // Save current drawing state
    context.translate(this.pos.x, this.pos.y); // Translate origin to agent position

    context.lineWidth = 4; // Set line width for agent outline

    // Draw circular agent
    context.beginPath(); // Begin drawing path
    context.arc(0, 0, this.radius, 0, Math.PI * 2); // Draw circle
    context.fill(); // Fill circle
    context.stroke(); // Stroke circle outline

    context.restore(); // Restore original drawing state
  }
}
