const celestialBodies = {
    "sun": {
        name: "Sol",
        shortDescription: "The central star of our system and the primary energy source for humanity.",
        position: { x: 500, y: 300, radius: 30 },  // Slightly smaller sun
        color: "#FDB813",
        detailPage: "pages/sun.html"
    },
    "mercury": {
        name: "Mercury",
        shortDescription: "A newer faction that mines the planet and has developed specialized extreme environment technologies. Secretly practices slavery.",
        position: { x: 560, y: 300, radius: 6 },  // Adjusted position and smaller
        orbit: { rx: 60, ry: 30 },  // Tighter orbit
        color: "#B2B2B2",
        detailPage: "pages/mercury.html"
    },
    "venus": {
        name: "Venus",
        shortDescription: "Mined for resources by Terra's descendants, with resources shared in a trade agreement with Mars.",
        position: { x: 610, y: 300, radius: 10 },  // Adjusted position and smaller
        orbit: { rx: 110, ry: 55 },  // Adjusted orbit
        color: "#E7CDAD",
        detailPage: "pages/venus.html"
    },
    "earth": {
        name: "Earth",
        shortDescription: "Transformed from population center to ecological preserve, with most Terra-associated humans living in orbital habitats.",
        position: { x: 670, y: 300, radius: 12 },  // Adjusted position and smaller
        orbit: { rx: 170, ry: 85 },  // Adjusted orbit
        color: "#6B93D6",
        detailPage: "pages/earth.html"
    },
    "mars": {
        name: "Mars",
        shortDescription: "The breadbasket of the solar system, terraformed in patches with domed agricultural zones producing food for much of humanity.",
        position: { x: 740, y: 300, radius: 9 },  // Adjusted position and smaller
        orbit: { rx: 240, ry: 120 },  // Adjusted orbit
        color: "#D67F5B",
        detailPage: "pages/mars.html"
    },
    "jupiter": {
        name: "Jupiter",
        shortDescription: "A superpower that controls crucial energy resources including helium-3, with significant economic and political influence.",
        position: { x: 360, y: 300, radius: 20 },  // Repositioned and smaller
        orbit: { rx: 400, ry: 200 },  // Adjusted orbit
        color: "#C88B3A",
        detailPage: "pages/jupiter.html"
    },
    "saturn": {
        name: "Saturn",
        shortDescription: "Part of the Outer System Empire, which isn't fully accepted by the inner system but not heavily disputed either.",
        position: { x: 250, y: 300, radius: 18 },  // Repositioned and smaller
        orbit: { rx: 500, ry: 250 },  // Adjusted orbit
        color: "#E0BB95",
        detailPage: "pages/saturn.html"
    },
    "uranus": {
        name: "Uranus",
        shortDescription: "Controlled by the Outer System Empire, providing unique resources formed in its extreme cold environment.",
        position: { x: 180, y: 300, radius: 14 },  // Repositioned and smaller
        orbit: { rx: 570, ry: 285 },  // Adjusted orbit
        color: "#9BB4D7",
        detailPage: "pages/uranus.html"
    },
    "neptune": {
        name: "Neptune",
        shortDescription: "The furthest major populated planet, controlled by the Outer System Empire along with Saturn and Uranus.",
        position: { x: 130, y: 300, radius: 14 },  // Repositioned and smaller
        orbit: { rx: 620, ry: 310 },  // Adjusted orbit
        color: "#3E66A3",
        detailPage: "pages/neptune.html"
    },
    "pluto": {
        name: "Pluto",
        shortDescription: "A forward scientific observatory accessible to all factions, dedicated to research beyond the solar system.",
        position: { x: 90, y: 300, radius: 4 },  // Repositioned and smaller
        orbit: { rx: 660, ry: 330 },  // Adjusted orbit
        color: "#9B8D7B",
        detailPage: "pages/pluto.html"
    }
};
