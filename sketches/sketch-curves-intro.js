const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let elCanvas; // Reference to the canvas element
let points;

const sketch = ({ canvas }) => {
  points = [
    new Point({ x: 200, y: 540 }),
    new Point({ x: 400, y: 700 }),
    new Point({ x: 880, y: 540 }),
    new Point({ x: 600, y: 700 }),
    new Point({ x: 640, y: 900 }),
  ];

  canvas.addEventListener("mousedown", onMouseDown);

  elCanvas = canvas; // Save reference to the canvas

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    // Draw straight lines connecting all points:
    context.strokeStyle = "#999";
    context.beginPath();
    context.moveTo(points[0].x, points[0].y); // Start at the first point

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y); // Draw lines between points
    }

    context.stroke();

    /*
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i += 2) {
      context.quadraticCurveTo(
        points[i + 0].x,
        points[i + 0].y,
        points[i + 1].x,
        points[i + 1].y
      );
    }
    /* ALTERNATIVE TO ABOVE: 
    context.quadraticCurveTo(
      points[1].x,
      points[1].y,
      points[2].x,
      points[2].y
    );
    context.quadraticCurveTo(
      points[3].x,
      points[3].y,
      points[4].x,
      points[4].y
      );
      
    context.stroke();
    */

    context.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i + 0];
      const next = points[i + 1];

      // Calculate mid-point for smoother curves:
      const mx = curr.x + (next.x - curr.x) * 0.5;
      const my = curr.y + (next.y - curr.y) * 0.5;

      /*
     // Drawing middle points:
      context.beginPath();
      context.arc(mx, my, 5, 0, Math.PI * 2);
      context.fillStyle = "blue";
      context.fill();
      */

      // To make points behave in the same way <-- first point was linear
      if (i == 0) context.moveTo(curr.x, curr.y);
      else if (i == points.length - 2)
        context.quadraticCurveTo(
          curr.x,
          curr.y,
          next.x,
          next.y
        ); // Draw quadratic curve to the last point
      else context.quadraticCurveTo(curr.x, curr.y, mx, my); // Draw quadratic curve to the mid-point
    }

    context.lineWidth = 4;
    context.strokeStyle = "blue";
    context.stroke();

    points.forEach((Point) => {
      Point.draw(context);
    });
  };
};

const onMouseDown = (event) => {
  // Attach event listeners for drag and release
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  // Get mouse coordinates relative to canvas size:
  const x = (event.offsetX / elCanvas.offsetWidth) * elCanvas.width; // 'offsetWidth' is the true width of the canvas regardless of where the canvas is on the screen or how big it is
  const y = (event.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  let hit = false; // Track if a point is clicked
  points.forEach((point) => {
    point.isDragging = point.hitTest(x, y); // Check if the mouse is over a point
    if (!hit && point.isDragging) hit = true; // Flag as hit if a point is found
  });

  if (!hit) points.push(new Point({ x, y })); // In case nothing was hit, you create a new point - you add more points here and keep extending the curve
};

const onMouseMove = (event) => {
  // Get mouse coordinates relative to canvas:
  const x = (event.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (event.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  // Update position of dragged points
  points.forEach((point) => {
    if (point.isDragging) {
      point.x = x;
      point.y = y;
    }
  });
};

const onMouseUp = () => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
};

canvasSketch(sketch, settings);

class Point {
  constructor({ x, y, control = false }) {
    this.x = x;
    this.y = y;
    this.control = control; // Indicates if the point is a control point
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fillStyle = this.control ? "red" : "black"; // Color based on control status
    context.fill();

    context.restore();
  }

  // Check if a point is hit by the mouse
  hitTest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx * dx + dy * dy);

    return dd < 20; // Return true if within hit radius
  }
}
