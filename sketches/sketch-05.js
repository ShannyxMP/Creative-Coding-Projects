const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

let manager;

let text = "X";
let fontSize = 1200;
let fontFamily = "serif";

// Smaller canvas that is used to only read data from
const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillRect(0, 0, cols, rows);
    typeContext.fillStyle = "black";

    fontSize = cols;

    typeContext.fillStyle = "white";
    // context.font = "1200px serif"; | *Original* but now you made it more dynamic by placing variables outside (LINE8-9)
    // context.font = fontSize + 'px ' + fontFamily; | Concactinating outside variables
    typeContext.font = `${fontSize}px ${fontFamily}`; // Better alternative
    typeContext.textBaseline = "top";
    // context.textAlign = "center";

    const metrics = typeContext.measureText(text);
    // console.log(metrics); | To view all parameters
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    typeContext.save();
    typeContext.translate(tx, ty);

    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();
    typeContext.fillText(text, 0, 0);

    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data; // Just interested in the 'data:' property of this object
    console.log(typeData); //"data: 0 - 11663" 4(rgba) * 54(width [1080 / cells(20) = 54]) * 54(height) = 11664
    // To read data values:
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      context.fillStyle = `rgb(${r}, ${g}, ${b})`;

      /*
      // To appear as square blocks:
      context.save();
      context.translate(x, y);
      context.fillRect(0, 0, cell, cell);
      context.restore();
      */

      // ALTERNATIVE | To appear as circles:
      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5); // This is to remove margin on right and bottom of canvas
      context.beginPath();
      context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    context.drawImage(typeCanvas, 0, 0);
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
