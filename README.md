# Creative Coding using Canvas-Sketch

## Table of contents

- [Overview](#overview)
  - [Screenshots](#screenshot)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)
  - [License Information](#license-information)

## Overview

The courses, _Creative Coding: Making Visuals with JavaScript_ & _Creative Coding 2.0 in JS: Animation, Sound, & Color_, created by Bruno Imbrizi was an opportunity to develop visual compositions with programming. My final art projects, _Lava Lamp_ & _Thermal Drift_, attempts to simulate the organic motion of blobs in a lava lamp; the other, to simulate the ocean.

### Screenshots

![Screenshot of Final Project: Lava Lamp](./sketches/output/07/Lava%20Lamp%20-%20ShannyxMP.gif)
_Note: GIF image is sped up._

![Screenshot of Final Project: Thermal Drift](./sketches/output/06/Thermal%20Drift%20-%20ShannyxMP.gif)

## My process

### Built with

- JavaScript
- [Canvas-Sketch](https://github.com/mattdesl/canvas-sketch/blob/master/docs/README.md)

### What I learned

One of the major challenges of the Lava Lamp project was having the code simulate the natural behaviour of lava lamps - that is, the objects (blobs) rise and fall due to temperature changes. Perlin Noise was a concept introduced to me by Bruno which assisted me with this hurdle. I attempted to integrate this into my final project which seemed to work in my favour as the motion of the blobs generated was smooth, appearing organic in their movement.

To create a smooth organic motion effect, I used Perlin Noise to influence the vertical movement of the blobs:

```js
// Define 1D noise to move blob vertically
const n1D = random.noise1D(blob.x, params.Frequency, params.Amplitude);
blob.y += (n1D * 10) / 2; // Update blob's y-coordinates
```

A similar approach was applied to Thermal Drift. In this project, 2D noise was used to animate the orbs, allowing movement along both the vertical and horizontal planes. Wanting to push myself further, I introduced user interaction. However, a persistent challenge was that the orbs would abruptly ‘snap’ between their default positions and their movement in response to the cursor. I experimented with several methods to create a smoother transition between these two states, but none were successful—until I realized that a simpler approach could work. Instead of complex solutions, I adjusted the intensity of the cursor interaction gradually based on the 'mousedown' and 'mouseup' events, ensuring a more natural transition.

```js
  // Adjust transition state based on mouse state
  if (isMouseDown) {
    transition += rate; // To gradually uptitrate transitioning once mouse down
    if (transition >= 1) {
      transition = 1;
    }
  }
  if (isMouseDown == false) {
    transition -= rate; // To gradually downtitrate from transition once mouse up
    if (transition <= 0) {
      transition = 0;
    }
  }

  ...

  /**
   * Updates the orb's position based on cursor proximity.
   */
  update() {
    let dx = this.x - cursor.x;
    let dy = this.y - cursor.y;
    let dd = Math.sqrt(dx * dx + dy * dy); // Distance to cursor

    // If close to cursor, apply force
    if (dd < this.minDist) {
      let force = (this.minDist - dd) * 0.05; // Strength of movement
      if (isMouseDown == true) {
        // For orbs to slowly transition to cursor interaction positions
        this.x += dx * force * transition;
        this.y += dy * force * 0.1 * transition;
      } else {
        // Smoothly revert back to original positions one 'isMouseDown' is false
        this.x += dx * force * transition;
        this.y += dy * force * 0.1 * transition;
      }
    }
  }
```

### Continued development

There were many ideas involving Perlin Noise that I was eager to explore but could not fully implement in my Lava Lamp project. One attempt was to use Perlin Noise to make the blobs appear more fluid-like rather than perfectly circular, allowing them to morph as they moved—but unfortunately, I could not achieve the desired effect. I also experimented with using Perlin Noise to create a more natural color transition for the blobs, but ultimately, I settled for a radial gradient. Thanks to Bruno’s guidance, I learned that this effect could be achieved by integrating 'colormap', an npm package that maps colors based on noise values. As my understanding of visual programming deepens, I hope to revisit these ideas in future projects.

### Useful resources

- [Canvas-Sketch Documentation](https://github.com/mattdesl/canvas-sketch/blob/master/docs/README.md)
- [Course](https://www.domestika.org/en/courses/2729-creative-coding-making-visuals-with-javascript)

## Author

_This was a final project for Bruno Imbrizi's courses._

COPYRIGHT 2023-2024 ShannyxMP

## Acknowledgments

The artwork in these projects were created using [canvas-sketch](https://github.com/mattdesl/canvas-sketch), an open-source creative coding framework by [Matt DesLauriers](https://mattdesl.com/). This software provided the tools and functionality necessary for developing and rendering the generative aspects of the piece.

---

### License Information

This project includes the following third-party software:

- **canvas-sketch**:  
  The MIT License (MIT)  
  Copyright (c) 2017 Matt DesLauriers
