const canvasSketch = require('canvas-sketch'); // Retrieving the canvas library

const settings = {
  dimensions: [ 1080, 1080 ], // Dimensions are in pixels ALTERNATIVELY you can say 'A4'
  // pixelsPerInch: 300, To adjust pixel density if in 'A4' dimensions
  // orientation: 'landscape' if in 'A4' dimensions
};

const sketch = () => { // A function returning a no-named function which is called by the library itself
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.fillRect(0, 0, width, height); // Lines 9-10 draws a big, white rectangle as a background for the canvas
    context.lineWidth = width * 0.01;

    // Creating smaller square grid
    // Declaring variables:
    const w   = width * 0.10;
    const h   = height * 0.10;
    const gap = width * 0.05;
    const ix  = width * 0.16;
    const iy  = height * 0.16;

    const off = width * 0.02;

    let x, y; 
    
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            x = ix + (w + gap) * i;
            y = iy + (h + gap) * j;

            context.beginPath();
            context.rect(x, y, w, h);
            context.stroke();

            if (Math.random() > 0.5) {
                context.beginPath();
                context.rect(x + (off / 2), y + (off / 2), w - off, h - off);
                context.stroke();
            }
        }
    }

  };
};

canvasSketch(sketch, settings); // Here you are calling the library and passing (1) the sketch function and settings as parameters