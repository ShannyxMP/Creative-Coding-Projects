const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let elCanvas;
let points;

const sketch = ({ canvas }) => {
  points = [
    new Point({ x: 200, y: 540 }),
    new Point({ x: 400, y: 300, control: true }),
    new Point({ x: 880, y: 540 }),
  ];

  canvas.addEventListener("mousedown", onMouseDown);

  elCanvas = canvas;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.quadraticCurveTo(
      points[1].x,
      points[1].y,
      points[2].x,
      points[2].y
    );
    context.stroke();

    points.forEach((Point) => {
      Point.draw(context);
    });
  };
};

const onMouseDown = (event) => {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  const x = (event.offsetX / elCanvas.offsetWidth) * elCanvas.width; // 'offsetWidth' is the true width of the canvas regardless of where the canvas is on the screen or how big it is
  const y = (event.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  points.forEach((point) => {
    point.isDragging = point.hitTest(x, y);
  });
};

const onMouseMove = (event) => {
  const x = (event.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (event.offsetY / elCanvas.offsetHeight) * elCanvas.height;

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
    this.control = control;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fillStyle = this.control ? "red" : "black";
    context.fill();

    context.restore();
  }

  hitTest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx * dx + dy * dy);

    return dd < 20; // return 'true' when conditions are met
  }
}
