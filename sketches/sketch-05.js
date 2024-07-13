/****************** FOR LETTER GENERATION ******************
const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

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
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 1.2;

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
    // console.log(typeData); //"data: 0 - 11663" 4(rgba) * 54(width [1080 / cells(20) = 54]) * 54(height) = 11664

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "middle";
    context.textAlign = "center";

    // context.drawImage(typeCanvas, 0, 0); // Smaller canvas that appears in the top left

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

      const glyph = getGlyph(r); // Note that because you only want white text, you don't need all channels; are only using one channel of the four here

      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

      context.fillStyle = `rgb(${r}, ${g}, ${b})`; // Can change it to "white" if you want the glyphs to only appear white

      // // To appear as square blocks:
      // context.save();
      // context.translate(x, y);
      // context.fillRect(0, 0, cell, cell);
      // context.restore();

      // // ALTERNATIVE | To appear as circles:
      // context.save();
      // context.translate(x, y);
      // context.translate(cell * 0.5, cell * 0.5); // This is to remove margin on right and bottom of canvas
      // context.beginPath();
      // context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      // context.fill();
      // context.restore();

      // To fill with glyphs:
      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      context.fillText(glyph, 0, 0);
      context.restore();
    }
  };
};

const getGlyph = (v) => {
  // 'v' is the brightness of the channel: 0 - 255
  if (v < 50) return "";
  if (v < 100) return ".";
  if (v < 150) return "-";
  if (v < 200) return "+";

  const glyphs = "_= /".split("");

  return random.pick(glyphs);
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
*/

/****************** FOR IMAGE GENERATION  ******************/
const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
};

let manager;

const imageUrl = "./images/Drawn-Shantelle-Face-signature.png";

// Smaller canvas that is used to only read data from
const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.crossOrigin = "Anonymous"; // This is important for cross-origin requests
    img.src = url;
  });
};

const sketch = ({ context, width, height }) => {
  const cell = 5;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return async ({ context, width, height }) => {
    const img = await loadImage(imageUrl);

    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    const scale = Math.max(cols / img.width, rows / img.height);
    const x = (cols - img.width * scale) / 2;
    const y = (rows - img.height * scale) / 2;

    typeContext.drawImage(img, x, y, img.width * scale, img.height * scale);

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "middle";
    context.textAlign = "center";

    context.drawImage(typeCanvas, 0, 0); // Smaller canvas that appears in the top left

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      context.font = `${cell * 2}px serif`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px serif`;

      context.fillStyle = `rgb(${r}, ${g}, ${b})`;

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      context.fillText(glyph, 0, 0);
      context.restore();
    }
  };
};

const getGlyph = (v) => {
  if (v < 25) return "";
  if (v < 50) return ".";
  if (v < 75) return ",";
  if (v < 100) return "-";
  if (v < 125) return "+";
  if (v < 150) return "S";
  if (v < 175) return "M";
  if (v < 200) return "P";

  const glyphs = "_= /".split("");

  return random.pick(glyphs);
};

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();
