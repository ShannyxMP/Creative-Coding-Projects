const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

// Global variables:
let audio;

const sketch = () => {
  audio = document.createElement("audio");
  audio.src =
    "./audio/Michael Napiza - Saturn x Slow Dancing x Pluto Projector.mp3";

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
  };
};

const addListeners = () => {
  window.addEventListener(
    "mouseup",
    () /* NOTE: this is an inline, anonymous function */ => {
      if (audio.paused) audio.play();
      else audio.pause();
    }
  );
};
addListeners();

canvasSketch(sketch, settings);
