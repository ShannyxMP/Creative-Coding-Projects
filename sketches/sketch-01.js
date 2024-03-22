const canvasSketch = require('canvas-sketch'); // Retrieving the canvas library

const settings = {
  dimensions: [ 1080, 1080 ], // Dimensions are in pixels ALTERNATIVELY you can say 'A4'
  // pixelsPerInch: 300, To adjust pixel density if in 'A4' dimensions
  // orientation: 'landscape' if in 'A4' dimensions
};

const sketch = () => { // A function returning a no-named function which is called by the library itself
  return ({ context, width, height }) => {    
    // Black canvas
    context.fillRect(0, 0, width, height); // Draws a big, white rectangle as a background for the canvas
    context.fillStyle = 'black';
    
    // Gradient
    const gradientOuter = context.createLinearGradient(0, 0, width, height)
    gradientOuter.addColorStop(0.25, '#57C5B6'); 
    gradientOuter.addColorStop(0.25, '#159895');
    gradientOuter.addColorStop(0.5, '#159895');
    gradientOuter.addColorStop(0.5, '#1A5F7A');
    gradientOuter.addColorStop(0.75, '#1A5F7A');
    gradientOuter.addColorStop(0.75, '#002B5B');

    // Declaring variables:
    const w   = width * 0.10;
    const h   = height * 0.10;
    const gap = width * 0.05;
    const ix  = width * 0.16;
    const iy  = height * 0.16;

    let x, y; 

    // Creating square grid
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            x = ix + (w + gap) * i;
            y = iy + (h + gap) * j;
            
            context.strokeStyle = gradientOuter;
            context.shadowBlur = 0; // To remove glow from square grid
            context.lineWidth = width * 0.01;
            context.beginPath();
            context.rect(x, y, w, h);
            context.stroke();

            // Creating even smaller squares within grid
            const off = width * (0.03 + (Math.random() * (0.03 - 0) + 0)); // Will randomise size of squares
            
            // Randomises where smaller squares appear
            if (Math.random() > 0.5) {
                context.lineWidth = width * 0.005;
                context.strokeStyle = '#F5F3C1';
                context.shadowColor = 'pink';
                context.shadowBlur = 10;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.beginPath();
                context.rect(x + (off * 1.5), y + (off * 1.5), w - (off * 3), h - (off * 3));
                context.stroke();
            }
        }
    }

  };
};

canvasSketch(sketch, settings); // Here you are calling the library and passing two things: (1) the sketch function and (2) settings as parameters
