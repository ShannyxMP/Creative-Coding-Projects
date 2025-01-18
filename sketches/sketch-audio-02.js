const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
random;
const eases = require("eases");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

// Global variables:
let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager; // To control the sketch once audio finishes/pauses
let minDb, maxDb;

const sketch = () => {
  const numCircles = 5;
  const numSlices = 1;
  const slice = (Math.PI * 2) / numSlices;
  const radius = 200; // Base radius

  const bins = []; // 1, 2, 28, 30
  const lineWidths = [];
  const rotationOffsets = [];

  let lineWidth, bin, mapped, phi; // 'phi' -> a Greek letter that will represent the angle of the slice

  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 64);
    bins.push(bin);
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidth = eases.quadIn(t) * 200 + 10;
    lineWidths.push(lineWidth);
  }

  // To control rotations:
  for (let i = 0; i < numCircles; i++) {
    rotationOffsets.push(
      random.range(Math.PI * -0.25, Math.PI * 0.25) - Math.PI * 0.5
    );
  }

  return ({ context, width, height }) => {
    context.fillStyle = "#EEEAE0";
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);

    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.scale(1, -1);

    let cradius = radius;

    for (let i = 0; i < numCircles; i++) {
      context.save();
      context.rotate(rotationOffsets[i]);

      cradius += lineWidths[i] * 0.5 + 2;

      for (let j = 0; j < numSlices; j++) {
        context.rotate(slice);
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j]; // 'i * numSlices' is for each circle; 'j' is for each slice within each circle

        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

        phi = slice * mapped;

        context.beginPath();
        context.arc(0, 0, cradius, 0, phi);
        context.stroke();
      }

      cradius += lineWidths[i] * 0.5;

      context.restore();
    }

    context.restore();

    // console.log(audioData);
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

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

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
