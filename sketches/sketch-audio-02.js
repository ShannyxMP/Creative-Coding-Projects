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
  const radius = 200; // Base radius for the first circle

  const bins = []; // Stores frequency bins for audio data
  const lineWidths = [];
  const rotationOffsets = []; // Rotation offsets for each circle

  let lineWidth, bin, mapped, phi; // 'phi' -> a Greek letter that will represent the angle of the slice

  // Assign a random frequency bin for each arc
  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 64); // Randomly choose a frequency bin
    bins.push(bin);
  }

  // Calculate line widths for each circle using an easing function
  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1); // Normalize `i` to [0, 1]
    lineWidth = eases.quadIn(t) * 200 + 10; // Gradually increase line width
    lineWidths.push(lineWidth);
  }

  // Assign random rotation offsets to each circle
  for (let i = 0; i < numCircles; i++) {
    rotationOffsets.push(
      random.range(Math.PI * -0.25, Math.PI * 0.25) - Math.PI * 0.5
    );
  }

  return ({ context, width, height }) => {
    context.fillStyle = "#EEEAE0";
    context.fillRect(0, 0, width, height);

    if (!audioContext) return; // Exit if audio context hasn't been created

    // Update audio data
    analyserNode.getFloatFrequencyData(audioData);

    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.scale(1, -1); // Flip vertically for visual effect

    let cradius = radius; // Start with the base radius

    for (let i = 0; i < numCircles; i++) {
      context.save();
      context.rotate(rotationOffsets[i]); // Apply rotation offset to the circle

      cradius += lineWidths[i] * 0.5 + 2; // Adjust radius for the current circle

      for (let j = 0; j < numSlices; j++) {
        context.rotate(slice);
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j]; // Determine the frequency bin for this arc - 'i * numSlices' is for each circle; 'j' is for each slice within each circle

        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true); // Map audio data to a range [0, 1]

        phi = slice * mapped; // Calculate the angle for the arc based on audio data

        context.beginPath();
        context.arc(0, 0, cradius, 0, phi); // Draw from 0 to the mapped angle
        context.stroke();
      }

      cradius += lineWidths[i] * 0.5; // Adjust radius for the next circle

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
      // Create audio context on first interaction
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
  audio = document.createElement("audio"); // Create an HTML audio element
  audio.src =
    "./audio/Michael Napiza - Saturn x Slow Dancing x Pluto Projector.mp3";

  audioContext = new AudioContext();

  // Create a source node from the audio element
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  // Create an analyser node for frequency data
  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512; // Set FFT size for frequency analysis
  analyserNode.smoothingTimeConstant = 0.9; // Smooth frequency data over time
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount); // Initialize the array to hold frequency data

  console.log(audioData.length); // Same as 'FrequencyBinCount'
};

getAverage = (data) => {
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }

  return sum / data.length;
};

// Initialize the sketch and add event listeners
const start = async () => {
  addListeners(); // Set up mouse event listeners
  manager = await canvasSketch(sketch, settings);
  manager.pause();
};

start();
