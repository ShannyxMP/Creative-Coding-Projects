const canvasSketch = require("canvas-sketch"); // Importing the canvas-sketch library
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080], // Setting canvas dimensions to 1080x1080 pixels
};

const params = {
  theme: {
    active: "sea", // Default active theme
    sea: {
      gradient25A: "#57C5B6",
      gradient25B: "#159895",
      gradient50A: "#159895",
      gradient50B: "#1A5F7A",
      gradient75A: "#1A5F7A",
      gradient75B: "#002B5B",
    },
    sunset: {
      gradient25A: "#FF5733",
      gradient25B: "#FF8D1A",
      gradient50A: "#FFC300",
      gradient50B: "#FF5733",
      gradient75A: "#C70039",
      gradient75B: "#900C3F",
    },
  },
};

let manager;

const sketch = () => {
  return ({ context, width, height }) => {
    // Determine the active theme
    const activeTheme = params.theme[params.theme.active];

    // Creating outer gradient
    const gradientOuter = context.createLinearGradient(0, 0, width, height);
    gradientOuter.addColorStop(0.25, activeTheme.gradient25A);
    gradientOuter.addColorStop(0.25, activeTheme.gradient25B);
    gradientOuter.addColorStop(0.5, activeTheme.gradient50A);
    gradientOuter.addColorStop(0.5, activeTheme.gradient50B);
    gradientOuter.addColorStop(0.75, activeTheme.gradient75A);
    gradientOuter.addColorStop(0.75, activeTheme.gradient75B);

    context.fillStyle = "black"; // Setting fill color to black
    context.fillRect(0, 0, width, height); // Drawing a black background for the canvas

    // Declaring variables for grid dimensions and spacing
    const w = width * 0.1; // Width of each square
    const h = height * 0.1; // Height of each square
    const gap = width * 0.05; // Gap between squares
    const ix = width * 0.16; // Initial x position of the grid
    const iy = height * 0.16; // Initial y position of the grid

    let x, y; // Variables to store current position within the grid

    // Creating square grid
    for (let i = 0; i < 5; i++) {
      // Loop for rows
      for (let j = 0; j < 5; j++) {
        // Loop for columns
        x = ix + (w + gap) * i; // Calculating x position of current square
        y = iy + (h + gap) * j; // Calculating y position of current square

        // Drawing main squares
        context.strokeStyle = gradientOuter; // Setting stroke color to the outer gradient
        context.shadowBlur = 0; // Disabling shadow effect for main squares
        context.lineWidth = width * 0.01; // Setting line width for main squares

        context.beginPath(); // Begin drawing path for main square
        context.rect(x, y, w, h); // Drawing main square
        context.stroke(); // Stroke the path

        // Creating smaller squares within grid
        const off = width * (0.03 + Math.random() * (0.03 - 0)); // Randomizing size of smaller squares

        // Randomly drawing smaller squares
        if (Math.random() > 0.5) {
          // Characteristics for smaller squares
          context.lineWidth = width * 0.005; // Setting line width for smaller squares
          context.strokeStyle = "#F5F3C1"; // Setting stroke color for smaller squares
          context.shadowColor = "pink"; // Setting shadow color for smaller squares
          context.shadowBlur = 10; // Setting shadow blur for smaller squares
          context.shadowOffsetX = 0; // Setting shadow offset for smaller squares
          context.shadowOffsetY = 0;

          context.beginPath(); // Begin drawing path for smaller square
          context.rect(x + off * 1.5, y + off * 1.5, w - off * 3, h - off * 3); // Drawing smaller square
          context.stroke(); // Stroke the path
        }
      }
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Palette" });

  // Dropdown to select the active theme
  folder.addInput(params.theme, "active", {
    options: {
      Sea: "sea",
      Sunset: "sunset",
    },
    label: "Theme",
  });

  // Create folders for each theme
  const seaFolder = folder.addFolder({ title: "Sea Theme" });
  seaFolder.addInput(params.theme.sea, "gradient25A", {
    label: "Gradient 25A",
  });
  seaFolder.addInput(params.theme.sea, "gradient25B", {
    label: "Gradient 25B",
  });
  seaFolder.addInput(params.theme.sea, "gradient50A", {
    label: "Gradient 50A",
  });
  seaFolder.addInput(params.theme.sea, "gradient50B", {
    label: "Gradient 50B",
  });
  seaFolder.addInput(params.theme.sea, "gradient75A", {
    label: "Gradient 75A",
  });
  seaFolder.addInput(params.theme.sea, "gradient75B", {
    label: "Gradient 75B",
  });

  const sunsetFolder = folder.addFolder({ title: "Sunset Theme" });
  sunsetFolder.addInput(params.theme.sunset, "gradient25A", {
    label: "Gradient 25A",
  });
  sunsetFolder.addInput(params.theme.sunset, "gradient25B", {
    label: "Gradient 25B",
  });
  sunsetFolder.addInput(params.theme.sunset, "gradient50A", {
    label: "Gradient 50A",
  });
  sunsetFolder.addInput(params.theme.sunset, "gradient50B", {
    label: "Gradient 50B",
  });
  sunsetFolder.addInput(params.theme.sunset, "gradient75A", {
    label: "Gradient 75A",
  });
  sunsetFolder.addInput(params.theme.sunset, "gradient75B", {
    label: "Gradient 75B",
  });

  // Function to update visibility based on selected theme
  const updateThemeVisibility = () => {
    const activeTheme = params.theme.active;
    seaFolder.hidden = activeTheme !== "sea";
    sunsetFolder.hidden = activeTheme !== "sunset";
    // Re-render the sketch with the updated theme
    if (manager) manager.render();
  };

  // Update visibility initially and on change
  updateThemeVisibility();
  pane.on("change", updateThemeVisibility);
};

createPane();

canvasSketch(sketch, settings).then((sketchManager) => {
  manager = sketchManager;
}); // Initializing canvas-sketch with the sketch function and settings
