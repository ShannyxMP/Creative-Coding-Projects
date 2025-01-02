const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  let x, y, w, h;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    x = width * 0.5;
    y = height * 0.5;
    w = width * 0.6;
    h = height * 0.1;
    degrees = -45;

    context.save();
    context.translate(x, y);

    context.strokeStyle = "blue";

    drawSkewedRect({ context, w, h, degrees });

    context.restore();
  };
};

const drawSkewedRect = ({ context, w, h, degrees }) => {
  const angle = math.degToRad(degrees);

  const rx = Math.cos(angle) * w; //? Why do we need to '*w', why not '+w'?
  const ry = Math.sign(angle) * w;

  // context.save(); //? Is calling the 'context.save()' & 'context.restore()' necessary if you're already calling it within the sketch function, before and after you call 'drawSkewedRect()'?
  context.translate(rx * -0.5, (h + ry) * -0.5);

  // Creating rectangle a stroke at a time
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.lineTo(0, 0);
  context.closePath();
  context.stroke();

  // context.restore();
};

canvasSketch(sketch, settings);
