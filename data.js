const celestialBodies = {
    "sun": {
        name: "Sol",
        shortDescription: "The central star of our system and the primary energy source for humanity.",
        position: { x: 500, y: 300, radius: 40 },
        color: "#FDB813",
        detailPage: "pages/sun.html"
    },
    "mercury": {
        name: "Mercury",
        shortDescription: "A newer faction that mines the planet and has developed specialized extreme environment technologies. Secretly practices slavery.",
        position: { x: 575, y: 300, radius: 10 },
        orbit: { rx: 75, ry: 40 },
        color: "#B2B2B2",
        detailPage: "pages/mercury.html"
    },
    "venus": {
        name: "Venus",
        shortDescription: "Mined for resources by Terra's descendants, with resources shared in a trade agreement with Mars.",
        position: { x: 630, y: 310, radius: 18 },
        orbit: { rx: 130, ry: 70 },
        color: "#E7CDAD",
        detailPage: "pages/venus.html"
    },
    "earth": {
        name: "Earth",
        shortDescription: "Transformed from population center to ecological preserve, with most Terra-associated humans living in orbital habitats.",
        position: { x: 700, y: 300, radius: 20 },
        orbit: { rx: 200, ry: 100 },
        color: "#6B93D6",
        detailPage: "pages/earth.html"
    },
    "mars": {
        name: "Mars",
        shortDescription: "The breadbasket of the solar system, terraformed in patches with domed agricultural zones producing food for much of humanity.",
        position: { x: 780, y: 310, radius: 15 },
        orbit: { rx: 280, ry: 140 },
        color: "#D67F5B",
        detailPage: "pages/mars.html"
    },
    "jupiter": {
        name: "Jupiter",
        shortDescription: "A superpower that controls crucial energy resources including helium-3, with significant economic and political influence.",
        position: { x: 350, y: 380, radius: 35 },
        orbit: { rx: 480, ry: 240 },
        color: "#C88B3A",
        detailPage: "pages/jupiter.html"
    },
    "saturn": {
        name: "Saturn",
        shortDescription: "Part of the Outer System Empire, which isn't fully accepted by the inner system but not heavily disputed either.",
        position: { x: 220, y: 200, radius: 30 },
        orbit: { rx: 580, ry: 290 },
        color: "#E0BB95",
        detailPage: "pages/saturn.html"
    },
    "uranus": {
        name: "Uranus",
        shortDescription: "Controlled by the Outer System Empire, providing unique resources formed in its extreme cold environment.",
        position: { x: 150, y: 440, radius: 25 },
        orbit: { rx: 680, ry: 340 },
        color: "#9BB4D7",
        detailPage: "pages/uranus.html"
    },
    "neptune": {
        name: "Neptune",
        shortDescription: "The furthest major populated planet, controlled by the Outer System Empire along with Saturn and Uranus.",
        position: { x: 840, y: 150, radius: 25 },
        orbit: { rx: 780, ry: 390 },
        color: "#3E66A3",
        detailPage: "pages/neptune.html"
    },
    "pluto": {
        name: "Pluto",
        shortDescription: "A forward scientific observatory accessible to all factions, dedicated to research beyond the solar system.",
        position: { x: 100, y: 100, radius: 8 },
        orbit: { rx: 880, ry: 440 },
        color: "#9B8D7B",
        detailPage: "pages/pluto.html"
    }
};
