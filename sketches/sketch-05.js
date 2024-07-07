const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

let manager;

let text = "X";
let fontSize = 1200;
let fontFamily = "serif";

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "black";
    // context.font = "1200px serif"; | *Original* but now you made it more dynamic by placing variables outside (LINE8-9)
    // context.font = fontSize + 'px ' + fontFamily; | Concactinating outside variables
    context.font = `${fontSize}px ${fontFamily}`; // Better alternative
    context.textBaseline = "top";
    // context.textAlign = "center";

    const metrics = context.measureText(text);
    // console.log(metrics); | To view all parameters
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const x = (width - mw) * 0.5 - mx;
    const y = (height - mh) * 0.5 - my;

    context.save();
    context.translate(x, y);

    context.beginPath();
    context.rect(mx, my, mw, mh);
    context.stroke();
    context.fillText(text, 0, 0);

    context.restore();
  };
};

const onKeyUp = (eventObject) => {
  // console.log(eventObject); | To view all parameters
  text = eventObject.key.toUpperCase(); // You can add .toUpperCase()
  manager.render();
};

document.addEventListener("keyup", onKeyUp);

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};
start();
