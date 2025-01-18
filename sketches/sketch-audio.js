const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

// Global variables:
let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager; // To control the sketch once audio finishes/pauses

const sketch = () => {
  const bins = [1, 2, 28, 30]; // 4, 12, 36, 72, 216

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);

    for (let i = 0; i < bins.length; i++) {
      const bin = bins[i];
      const mapped = math.mapRange(
        audioData[bin],
        analyserNode.minDecibels,
        analyserNode.maxDecibels,
        0,
        1,
        true
      );
      radius = mapped * 300;

      // console.log(audioData);

      context.save();
      context.translate(width * 0.5, height * 0.5);
      context.lineWidth = 10;

      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.stroke();

      context.restore();
    }
  };
};

const addListeners = () => {
  window.addEventListener(
    "mouseup",
    () /* NOTE: this is an inline, anonymous function */ => {
      if (!audioContext) createAudio();

      if (audio.paused) {
        audio.play();
        manager.play();
      } else {
        audio.pause();
        manager.pause();
      }
    }
  );
};

// To create an audio context and connect an analyser node to read frequency data from an audio source
const createAudio = () => {
  audio = document.createElement("audio");
  audio.src =
    "./audio/Michael Napiza - Saturn x Slow Dancing x Pluto Projector.mp3";

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  audioData = new Float32Array(analyserNode.frequencyBinCount);

  console.log(audioData.length); // Same as 'FrequencyBinCount'
};

getAverage = (data) => {
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }

  return sum / data.length;
};

const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
};

start();
