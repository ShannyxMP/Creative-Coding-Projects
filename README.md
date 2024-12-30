# Creative Coding using Canvas-Sketch

## Table of contents

- [Overview](#overview)
  - [Screenshot](#screenshot)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)
  - [License Information](#license-information)

## Overview

The course, _Creative Coding: Making Visuals with JavaScript_, created by Bruno Imbrizi was an opportunity to develop visual compositions with programming. My final art project, _Lava Lamp_, attempts to simulate the organic motion of blobs in a lava lamp.

### Screenshot

![Screenshot of Final Project: Lava Lamp](./sketches/output/07/Lava%20Lamp.gif)

## My process

### Built with

- JavaScript
- [Canvas-Sketch](https://github.com/mattdesl/canvas-sketch/blob/master/docs/README.md)

### What I learned

One of the major challenges of this project was having the code simulate the natural behaviour of lava lamps - that is, the objects (blobs) to rise and fall due to temperature changes. Perlin Noise was a concept introduced by Bruno which assisted me with this hurdle. I attempted to integrate this into my final project which seemed to work in my favor as the speed of the blobs generated were randomised, appearing natural in their movement:

```js
// Define 1D noise to move blob vertically
const n1D = random.noise1D(blob.x, params.Frequency, params.Amplitude);
blob.y += (n1D * 10) / 2; // Update blob's y-coordinates
```

### Continued development

There were a lot of ideas regarding the use of Perlin Noise that I am keen to explore that were not achievable in my final project. For example, I attempted to use Perlin Noise to create natural movement of the colours of the blobs to give it more definition, but settled for a radial gradient. I also attempted to use Perlin Noise to have the blobs appear more fluid-like rather than circular, so it may morph as it moves - unfortuantely, to no success. As my knowledge of mathematics improves, hopefully, it is something that comes to fruition in future projects.

### Useful resources

- [Canvas-Sketch Documentation](https://github.com/mattdesl/canvas-sketch/blob/master/docs/README.md)
- [Course](https://www.domestika.org/en/courses/2729-creative-coding-making-visuals-with-javascript)

## Author

_This was a final project for Bruno Imbrizi's course._

COPYRIGHT 2023-2024 ShannyxMP

## Acknowledgments

The artwork in this project was created using [canvas-sketch](https://github.com/mattdesl/canvas-sketch), an open-source creative coding framework by [Matt DesLauriers](https://mattdesl.com/). This software provided the tools and functionality necessary for developing and rendering the generative aspects of the piece.

---

### License Information

This project includes the following third-party software:

- **canvas-sketch**:  
  The MIT License (MIT)  
  Copyright (c) 2017 Matt DesLauriers
