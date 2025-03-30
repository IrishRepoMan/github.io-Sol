document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loading...");
    
    const solarSystem = document.getElementById('solar-system');
    const minZoom = 0.2; // Increase this from 0.1 to 0.2 to prevent zooming out too far
const maxZoom = 1.5;
let currentZoom = 0.2; // This is now the minimum zoom (fully zoomed out)
    let isDragging = false;
    let startDragX, startDragY;
    let currentX = 0, currentY = 0;
    let lastTime = 0;
    let zoomTarget = { x: 0, y: 0 };
    let bodyVisibilityThresholds = {
        planet: 0.1,
        moon: 0.3,
        asteroid: 0.4,
        installation: 0.6
};

let animationFrameId = null;
let lastFrameTime = 0;
const TARGET_FPS = 60;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

    function hexToRgb(hex) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values to get r, g, b components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
}
    
function updateTransform() {
    // Only allow panning when zoomed in beyond minimum level
    if (currentZoom <= minZoom) {
        // Reset position when at minimum zoom
        currentX = 0;
        currentY = 0;
    } else {
        // Calculate max pan based on zoom level - tighter restrictions than before
        const maxPan = 1500 * (currentZoom - minZoom) / (maxZoom - minZoom);
        currentX = Math.max(Math.min(currentX, maxPan), -maxPan);
        currentY = Math.max(Math.min(currentY, maxPan), -maxPan);
    }
    
    solarSystem.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%)) scale(${currentZoom})`;
    
    document.getElementById('solar-system').style.visibility = 'visible';
    document.getElementById('solar-system').style.opacity = '1';
    document.getElementById('universe').style.backgroundColor = '#000';

    updateZoomDisplay();
    updateBodyVisibility();
}
    window.onerror = function(message, source, lineno, colno, error) {
    console.error("Error encountered:", message);
    console.error("At:", source, "Line:", lineno, "Column:", colno);
    console.error("Stack trace:", error ? error.stack : "Not available");
    
    // Force remove loading screen if there's an error
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.display = 'none';
    }
    
    // Display an error message to the user
    alert("An error occurred while loading the solar system. Please check the console for details.");
    
    return true; // This prevents the browser's default error handling
};
    
    function updateMoonOrbits() {
        document.querySelectorAll('.celestial-body.moon').forEach(moon => {
            const parentBody = moon.dataset.parentBody;
            if (!parentBody) return;
            
            const parentElement = document.querySelector(`.${parentBody.toLowerCase()}`);
            if (!parentElement) return;
            
            const parentDiameter = parseFloat(parentElement.style.width);
            const moonDiameter = parseFloat(moon.style.width);
            
            // Calculate minimum orbit distance (outside the parent planet)
            let minOrbitRadius = parentDiameter / 2 + moonDiameter / 2 + 5; // Adding 5px padding
            
            // Get the base orbit radius
            let orbitRadius = parseFloat(moon.dataset.orbitRadius || 0);
            
            // Ensure orbit is outside the parent planet
            orbitRadius = Math.max(orbitRadius, minOrbitRadius);
            moon.dataset.adjustedRadius = orbitRadius;
            
            // Update moon orbit display
            const orbit = parentElement.querySelector(`.moon-orbit[data-moon="${moon.getAttribute('data-name')}"]`);
            if (orbit) {
                orbit.style.width = `${orbitRadius * 2}px`;
                orbit.style.height = `${orbitRadius * 2}px`;
                orbit.style.left = `${(parentDiameter - orbitRadius * 2) / 2}px`;
                orbit.style.top = `${(parentDiameter - orbitRadius * 2) / 2}px`;
            }
        });
    }
    
   function updateBodyVisibility() {
    const visiblePlanets = [];
    const visibleMoons = {};
     const visibleRadius = 1800 / currentZoom;
       
   document.querySelectorAll('.celestial-body').forEach(body => {
        const bodyType = body.getAttribute('data-body-type');
        const bodyName = body.getAttribute('data-name');

        if (bodyName === "Sol") {
            body.style.display = 'block';
            return;
        }
        
        // For other bodies, check distance from center of view
        if (bodyType === 'planet') {
            // Calculate distance from current view center
            const bodyX = parseFloat(body.style.left) + parseFloat(body.style.width) / 2;
            const bodyY = parseFloat(body.style.top) + parseFloat(body.style.height) / 2;
            const viewCenterX = systemCenter.x + currentX;
            const viewCenterY = systemCenter.y + currentY;
            
            const distance = Math.sqrt(
                Math.pow(bodyX - viewCenterX, 2) + 
                Math.pow(bodyY - viewCenterY, 2)
            );
            
            // Hide if too far from current view center and zoomed in
            if (currentZoom > 0.3 && distance > visibleRadius) {
                body.style.display = 'none';
            } else {
                body.style.display = 'block';
            }
        } else if (bodyType === 'moon') {
            // Show moons only at sufficient zoom level
            body.style.display = currentZoom >= bodyVisibilityThresholds.moon ? 'block' : 'none';
        }
       
        if (bodyType === 'planet' || bodyType === 'star') {
            visiblePlanets.push(bodyName);
        } else if (bodyType === 'moon' && currentZoom >= bodyVisibilityThresholds.moon) {
            const parentBody = body.dataset.parentBody;
            if (!visibleMoons[parentBody]) {
                visibleMoons[parentBody] = [];
            }
            visibleMoons[parentBody].push(bodyName);
        }
    });
    
    document.querySelectorAll('.celestial-body').forEach(body => {
        const bodyType = body.getAttribute('data-body-type');
        const bodyName = body.getAttribute('data-name');
        const tooltip = body.querySelector('.tooltip');
        
        // Calculate appropriate scale factor based on zoom level
        let scaleFactor = 1;
        if (bodyType === 'planet' || bodyType === 'star') {
            // Improved scaling formula to prevent ballooning
            scaleFactor = Math.max(0.5, Math.min(1, 1 / (currentZoom * 1.5)));
        } else if (bodyType === 'moon') {
            scaleFactor = Math.max(0.5, Math.min(1, 1 / (currentZoom * 1.3)));
        }
        
        const bodyContent = body.querySelector('.body-content');
        if (bodyContent) {
            bodyContent.style.transform = `scale(${scaleFactor})`;
        }
        
        if (tooltip) {
            tooltip.style.transform = `scale(${1/currentZoom})`;
            tooltip.style.display = 'none';
        }
        
        // Always make the Sun visible, regardless of zoom level
        if (bodyName === "Sol") {
            body.style.display = 'block';
        }
        // For other bodies, use normal visibility rules
        else if (bodyType === 'planet') {
            body.style.display = 'block';
        } else if (bodyType === 'moon' && currentZoom >= bodyVisibilityThresholds.moon) {
            body.style.display = 'block';
        } else {
            body.style.display = 'none';
        }
    });
    
    // Rest of the function remains the same
    document.querySelectorAll('.asteroid').forEach(asteroid => {
        if (currentZoom >= bodyVisibilityThresholds.asteroid) {
            asteroid.style.display = 'block';
        } else {
            asteroid.style.display = 'none';
        }
    });
    
    document.querySelectorAll('.orbit').forEach(orbit => {
        orbit.style.opacity = Math.min(1, currentZoom * 2);
    });
    
    document.querySelectorAll('.moon-orbit').forEach(orbit => {
        if (currentZoom >= bodyVisibilityThresholds.moon) {
            orbit.style.display = 'block';
            orbit.style.opacity = Math.min(1, currentZoom * 1.5);
        } else {
            orbit.style.display = 'none';
        }
    });
        
        updateMoonOrbits();
    }
    
    function updateZoomDisplay() {
        const zoomLevelDisplay = document.getElementById('zoom-level');
        if (zoomLevelDisplay) {
            zoomLevelDisplay.textContent = `${Math.round(currentZoom * 100)}%`;
        }
    }
    
    updateTransform();
    
    const celestialBodies = [
        {
            name: "Sol",
            diameter: 200,
            position: { x: 0, y: 0 },
            color: "#fd6801",
            description: "Our solar system's star, providing energy to all planets and supporting life on Earth.",
            orbitSpeed: 0,
            type: "star"
        },
        {
            name: "Mercury",
            diameter: 20,
            orbitRadius: 300,
            orbitSpeed: 4.1,
            color: "#a6a6a6",
            description: "The smallest and innermost planet, known for extreme environment technologies and specialized mining operations.",
            type: "planet",
            inclination: 0.03
        },
        {
            name: "Venus",
            diameter: 38,
            orbitRadius: 400,
            orbitSpeed: 1.6,
            color: "#e6e600",
            description: "Earth's toxic twin with a runaway greenhouse effect, now a major mining operation under Terra's authority.",
            type: "planet",
            inclination: 0.05
        },
        {
            name: "Earth",
            diameter: 40,
            orbitRadius: 500,
            orbitSpeed: 1,
            color: "#3399ff",
            description: "Humanity's birthplace, now partially rewilded and serving as a biological repository with most population in orbital habitats.",
            type: "planet",
            inclination: 0.02
        },
        {
            name: "Luna",
            diameter: 12,
            orbitRadius: 25,
            orbitSpeed: 1.5,
            parentBody: "Earth",
            color: "#cccccc",
            description: "Earth's moon, home to early human colonization efforts and historical sites of significance.",
            type: "moon",
            inclination: 0.08
        },
        {
            name: "Mars",
            diameter: 30,
            orbitRadius: 600,
            orbitSpeed: 0.53,
            color: "#ff6600",
            description: "The solar system's breadbasket with terraformed agricultural domes producing food for trillions of humans.",
            type: "planet",
            inclination: 0.06
        },
        {
            name: "Phobos",
            diameter: 6,
            orbitRadius: 18,
            orbitSpeed: 3,
            parentBody: "Mars",
            color: "#aaaaaa",
            description: "Mars' larger moon, now home to orbital transfer stations and habitat construction facilities.",
            type: "moon",
            inclination: 0.04
        },
        {
            name: "Deimos",
            diameter: 4,
            orbitRadius: 26,
            orbitSpeed: 2,
            parentBody: "Mars",
            color: "#999999",
            description: "Mars' smaller moon, hosting observatories and communication relay stations.",
            type: "moon",
            inclination: 0.07
        },
        {
            name: "Jupiter",
            diameter: 120,
            orbitRadius: 900,
            orbitSpeed: 0.084,
            color: "#ffcc99",
            description: "A gas giant and economic superpower controlling energy resources and advanced technologies.",
            type: "planet",
            inclination: 0.04,
            hasRings: true,
            ringWidth: 20,
            ringColor: "rgba(255, 220, 180, 0.3)"
        },
        {
            name: "Io",
            diameter: 10,
            orbitRadius: 35,
            orbitSpeed: 1.8,
            parentBody: "Jupiter",
            color: "#ffffaa",
            description: "Jupiter's volcanically active moon with specialized mining operations.",
            type: "moon",
            inclination: 0.05
        },
        {
            name: "Europa",
            diameter: 10,
            orbitRadius: 45,
            orbitSpeed: 1.4,
            parentBody: "Jupiter",
            color: "#ffffee",
            description: "Jupiter's ice-covered moon with subsurface ocean, hosting scientific outposts.",
            type: "moon",
            inclination: 0.02
        },
        {
            name: "Ganymede",
            diameter: 15,
            orbitRadius: 60,
            orbitSpeed: 1.0,
            parentBody: "Jupiter",
            color: "#cccccc",
            description: "Jupiter's largest moon and an important administrative center for Jovian operations.",
            type: "moon",
            inclination: 0.03
        },
        {
            name: "Callisto",
            diameter: 14,
            orbitRadius: 75,
            orbitSpeed: 0.8,
            parentBody: "Jupiter",
            color: "#999999",
            description: "Jupiter's outermost large moon with significant habitat development.",
            type: "moon",
            inclination: 0.04
        },
        {
            name: "Saturn",
            diameter: 100,
            orbitRadius: 1300,
            orbitSpeed: 0.034,
            color: "#ffe6b3",
            description: "Ringed gas giant under the control of the Outer System Empire, with strategic resource operations.",
            type: "planet",
            inclination: 0.08,
            hasRings: true,
            ringWidth: 40,
            ringColor: "rgba(210, 180, 140, 0.5)"
        },
        {
            name: "Titan",
            diameter: 16,
            orbitRadius: 60,
            orbitSpeed: 0.9,
            parentBody: "Saturn",
            color: "#e6b800",
            description: "Saturn's largest moon and the administrative center of the Outer System Empire.",
            type: "moon",
            inclination: 0.05
        },
        {
            name: "Enceladus",
            diameter: 7,
            orbitRadius: 35,
            orbitSpeed: 1.3,
            parentBody: "Saturn",
            color: "#ffffff",
            description: "An icy moon with subsurface ocean, known for water harvesting operations.",
            type: "moon",
            inclination: 0.03
        },
        {
            name: "Rhea",
            diameter: 9,
            orbitRadius: 45,
            orbitSpeed: 1.1,
            parentBody: "Saturn",
            color: "#dddddd",
            description: "Saturn's second-largest moon, hosting imperial military installations.",
            type: "moon",
            inclination: 0.06
        },
        {
            name: "Uranus",
            diameter: 70,
            orbitRadius: 1800,
            orbitSpeed: 0.012,
            color: "#77ccff",
            description: "Ice giant under Outer System Empire control with specialized gas extraction operations.",
            type: "planet",
            inclination: 0.12,
            hasRings: true,
            ringWidth: 20,
            ringColor: "rgba(150, 200, 255, 0.3)"
        },
        {
            name: "Miranda",
            diameter: 8,
            orbitRadius: 30,
            orbitSpeed: 1.2,
            parentBody: "Uranus",
            color: "#aabbcc",
            description: "Uranus' moon with unusual surface features, now hosting gas processing facilities.",
            type: "moon",
            inclination: 0.04
        },
        {
            name: "Titania",
            diameter: 10,
            orbitRadius: 40,
            orbitSpeed: 0.9,
            parentBody: "Uranus",
            color: "#bbccdd",
            description: "Largest moon of Uranus with significant imperial presence.",
            type: "moon",
            inclination: 0.05
        },
        {
            name: "Neptune",
            diameter: 68,
            orbitRadius: 2100,
            orbitSpeed: 0.006,
            color: "#3366ff",
            description: "The outermost gas giant controlled by the Outer System Empire, with deuterium and tritium extraction facilities.",
            type: "planet",
            inclination: 0.09,
            hasRings: true,
            ringWidth: 15,
            ringColor: "rgba(100, 150, 255, 0.3)"
        },
        {
            name: "Triton",
            diameter: 12,
            orbitRadius: 40,
            orbitSpeed: 1.1,
            parentBody: "Neptune",
            color: "#ccccff",
            description: "Neptune's largest moon with significant imperial presence and specialized manufacturing.",
            type: "moon",
            inclination: 0.08
        },
        {
            name: "Proteus",
            diameter: 6,
            orbitRadius: 25,
            orbitSpeed: 1.5,
            parentBody: "Neptune",
            color: "#aaaaee",
            description: "A dark, irregularly shaped moon hosting monitoring stations.",
            type: "moon",
            inclination: 0.03
        },
        {
            name: "Pluto",
            diameter: 16,
            orbitRadius: 2400,
            orbitSpeed: 0.004,
            color: "#ccb399",
            description: "Dwarf planet serving as humanity's forward scientific observatory, accessible to all factions for research.",
            type: "planet",
            inclination: 0.14
        },
        {
            name: "Charon",
            diameter: 8,
            orbitRadius: 12,
            orbitSpeed: 1.2,
            parentBody: "Pluto",
            color: "#bbaa99",
            description: "Pluto's largest moon, functioning as an extension of the scientific outpost.",
            type: "moon",
            inclination: 0.05
        }, 
{
    name: "Amalthea",
    diameter: 5,
    orbitRadius: 25,
    orbitSpeed: 2.2,
    parentBody: "Jupiter",
    color: "#b35900",
    description: "A small, irregularly shaped inner moon of Jupiter with a reddish appearance.",
    type: "moon",
    inclination: 0.04
},
{
    name: "Himalia",
    diameter: 6,
    orbitRadius: 85,
    orbitSpeed: 0.7,
    parentBody: "Jupiter",
    color: "#888888",
    description: "The largest member of Jupiter's irregular satellite group.",
    type: "moon",
    inclination: 0.06
},
{
    name: "Thebe",
    diameter: 4,
    orbitRadius: 28,
    orbitSpeed: 2.0,
    parentBody: "Jupiter",
    color: "#a9a9a9",
    description: "A small inner moon of Jupiter, heavily cratered from impacts.",
    type: "moon",
    inclination: 0.05
},
{
    name: "Metis",
    diameter: 3,
    orbitRadius: 22,
    orbitSpeed: 2.5,
    parentBody: "Jupiter",
    color: "#a0a0a0",
    description: "Jupiter's innermost known moon, orbiting close to the planet's cloud tops.",
    type: "moon",
    inclination: 0.03
},

// Additional moons of Saturn
{
    name: "Mimas",
    diameter: 8,
    orbitRadius: 30,
    orbitSpeed: 1.5,
    parentBody: "Saturn",
    color: "#e6e6e6",
    description: "Saturn's 'Death Star' moon with a distinctive large crater.",
    type: "moon",
    inclination: 0.04
},
{
    name: "Tethys",
    diameter: 9,
    orbitRadius: 40,
    orbitSpeed: 1.3,
    parentBody: "Saturn",
    color: "#f2f2f2",
    description: "An icy moon with a large crater and a massive canyon system.",
    type: "moon",
    inclination: 0.05
},
{
    name: "Dione",
    diameter: 9,
    orbitRadius: 50,
    orbitSpeed: 1.0,
    parentBody: "Saturn",
    color: "#e6e6e6",
    description: "An icy moon with bright cliffs and a variety of terrains.",
    type: "moon",
    inclination: 0.04
},
{
    name: "Iapetus",
    diameter: 10,
    orbitRadius: 70,
    orbitSpeed: 0.7,
    parentBody: "Saturn",
    color: "#b3b3b3",
    description: "Saturn's two-toned moon with one dark and one light hemisphere.",
    type: "moon",
    inclination: 0.08
},
{
    name: "Hyperion",
    diameter: 6,
    orbitRadius: 65,
    orbitSpeed: 0.8,
    parentBody: "Saturn",
    color: "#c2c2c2",
    description: "A chaotically tumbling moon with a sponge-like appearance.",
    type: "moon",
    inclination: 0.07
},

// Additional moons of Uranus
{
    name: "Ariel",
    diameter: 9,
    orbitRadius: 50,
    orbitSpeed: 1.0,
    parentBody: "Uranus",
    color: "#a3c2d5",
    description: "One of Uranus's five major moons, with a relatively young surface.",
    type: "moon",
    inclination: 0.04
},
{
    name: "Umbriel",
    diameter: 9,
    orbitRadius: 55,
    orbitSpeed: 0.9,
    parentBody: "Uranus",
    color: "#808c99",
    description: "One of Uranus's darkest moons with an ancient, heavily cratered surface.",
    type: "moon",
    inclination: 0.05
},
{
    name: "Oberon",
    diameter: 11,
    orbitRadius: 60,
    orbitSpeed: 0.8,
    parentBody: "Uranus",
    color: "#93a3b3",
    description: "The outermost of Uranus's major moons, with an old, cratered surface.",
    type: "moon",
    inclination: 0.06
},
{
    name: "Puck",
    diameter: 4,
    orbitRadius: 25,
    orbitSpeed: 1.4,
    parentBody: "Uranus",
    color: "#a5b5c5",
    description: "A small inner moon of Uranus discovered by Voyager 2.",
    type: "moon",
    inclination: 0.03
},

// Additional moons of Neptune
{
    name: "Nereid",
    diameter: 5,
    orbitRadius: 55,
    orbitSpeed: 0.7,
    parentBody: "Neptune",
    color: "#b3c6d9",
    description: "Neptune's third-largest moon with a highly eccentric orbit.",
    type: "moon",
    inclination: 0.07
},
{
    name: "Larissa",
    diameter: 5,
    orbitRadius: 30,
    orbitSpeed: 1.3,
    parentBody: "Neptune",
    color: "#8faabf",
    description: "An irregularly shaped inner moon of Neptune.",
    type: "moon",
    inclination: 0.04
},
{
    name: "Naiad",
    diameter: 3,
    orbitRadius: 20,
    orbitSpeed: 1.8,
    parentBody: "Neptune",
    color: "#8aa6bf",
    description: "The innermost satellite of Neptune, orbiting within the planet's ring system.",
    type: "moon",
    inclination: 0.03
},
{
    name: "Thalassa",
    diameter: 4,
    orbitRadius: 22,
    orbitSpeed: 1.6,
    parentBody: "Neptune",
    color: "#8da9c2",
    description: "A small inner moon of Neptune discovered by Voyager 2.",
    type: "moon",
    inclination: 0.03
},

// Additional moons of Pluto
{
    name: "Nix",
    diameter: 3,
    orbitRadius: 18,
    orbitSpeed: 1.0,
    parentBody: "Pluto",
    color: "#ccbdb3",
    description: "A small, irregularly shaped moon of Pluto.",
    type: "moon",
    inclination: 0.04
},
{
    name: "Hydra",
    diameter: 3,
    orbitRadius: 23,
    orbitSpeed: 0.8,
    parentBody: "Pluto",
    color: "#ccc3bb",
    description: "The outermost known moon of Pluto.",
    type: "moon",
    inclination: 0.03
},
{
    name: "Kerberos",
    diameter: 2,
    orbitRadius: 20,
    orbitSpeed: 0.9,
    parentBody: "Pluto",
    color: "#c1b6ae",
    description: "A small moon of Pluto discovered in 2011.",
    type: "moon",
    inclination: 0.04
},
{
    name: "Styx",
    diameter: 2,
    orbitRadius: 16,
    orbitSpeed: 1.1,
    parentBody: "Pluto",
    color: "#c9bfb7",
    description: "The innermost moon of Pluto, and the last to be discovered.",
    type: "moon",
    inclination: 0.03
}
    ];
    
    const systemCenter = {
        x: 2500,
        y: 2500
    };
    
    function createCelestialBodies() {
        console.log("Creating celestial bodies...");
        
        celestialBodies.forEach(body => {
            if (body.parentBody) return;

            // Improve ring appearance
if (body.hasRings) {
    const rings = document.createElement('div');
    rings.className = 'planet-rings';
    rings.style.width = `${body.diameter * 2.2}px`;
    rings.style.height = `${body.ringWidth}px`;
    rings.style.backgroundColor = body.ringColor;
    rings.style.left = `${-body.diameter * 0.6}px`;
    rings.style.top = `${(body.diameter - body.ringWidth) / 2}px`;
    rings.style.boxShadow = `0 0 10px rgba(255, 255, 255, 0.3)`;
    rings.style.border = '1px solid rgba(255, 255, 255, 0.4)';
    element.appendChild(rings);
}
            
            if (body.name === "Sol") {
                const sunElement = document.querySelector('.sun');
                sunElement.style.width = `${body.diameter}px`;
                sunElement.style.height = `${body.diameter}px`;
                sunElement.style.left = `${systemCenter.x - body.diameter/2}px`;
                sunElement.style.top = `${systemCenter.y - body.diameter/2}px`;
                sunElement.dataset.bodyType = body.type;
                console.log("Sun positioned at:", sunElement.style.left, sunElement.style.top);
                return;
            }
            
            const angle = Math.random() * Math.PI * 2;
            const x = systemCenter.x + Math.cos(angle) * body.orbitRadius;
            const y = systemCenter.y + Math.sin(angle) * body.orbitRadius;
            
            const element = document.createElement('div');
            element.className = `celestial-body ${body.name.toLowerCase()}`;
            element.setAttribute('data-name', body.name);
            element.setAttribute('data-body-type', body.type);
            element.style.width = `${body.diameter}px`;
            element.style.height = `${body.diameter}px`;
            element.style.left = `${x - body.diameter/2}px`;
            element.style.top = `${y - body.diameter/2}px`;
            element.style.zIndex = 50;
            
            const bodyContent = document.createElement('div');
            bodyContent.className = 'body-content';
            
            const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
tooltip.innerHTML = `
    <h3>${body.name}</h3>
    <p>${body.description}</p>
    ${body.type === 'planet' ? `<div class="tooltip-data">Diameter: ${body.diameter} km</div>` : ''}
`;
            
            const orbit = document.createElement('div');
            orbit.className = 'orbit';
            orbit.style.width = `${body.orbitRadius * 2}px`;
            orbit.style.height = `${body.orbitRadius * 2}px`;
            orbit.style.left = `${systemCenter.x - body.orbitRadius}px`;
            orbit.style.top = `${systemCenter.y - body.orbitRadius}px`;
            orbit.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            
            if (body.inclination) {
                orbit.style.transform = `rotateX(${body.inclination * 180}deg)`;
            }if (body.type === 'planet') {
    if (body.name === "Mercury") {
        bodyContent.style.background = "linear-gradient(30deg, #6e6e6e, #a6a6a6, #d4d4d4)";
    } else if (body.name === "Venus") {
        bodyContent.style.background = "linear-gradient(30deg, #a57c1b, #e6e600, #ffffcc)";
    } else if (body.name === "Earth") {
        bodyContent.style.background = "linear-gradient(30deg, #1a5599, #3399ff, #66ccff)";
    } else if (body.name === "Mars") {
        bodyContent.style.background = "linear-gradient(30deg, #992900, #ff6600, #ff9966)";
    } else if (body.name === "Jupiter") {
        bodyContent.style.background = "linear-gradient(30deg, #a67c52, #d4a876, #e6c699)";
    } else if (body.name === "Saturn") {
        bodyContent.style.background = "linear-gradient(30deg, #b39766, #d4c099, #e6d4b3)";
    } else if (body.name === "Uranus") {
        bodyContent.style.background = "linear-gradient(30deg, #5dacee, #77ccff, #aaddff)";
    } else if (body.name === "Neptune") {
        bodyContent.style.background = "linear-gradient(30deg, #3355bb, #5577dd, #7799ff)";
    } else if (body.name === "Pluto") {
        bodyContent.style.background = "linear-gradient(30deg, #9a7c5c, #b39980, #ccb399)";
    }
    
    // Add a subtle shadow glow - use hexToRgb helper function
    element.style.boxShadow = `0 0 15px rgba(${hexToRgb(body.color)}, 0.7)`;
}
            
            element.appendChild(bodyContent);
            element.appendChild(tooltip);
            solarSystem.appendChild(element);
            solarSystem.appendChild(orbit);
            
            element.addEventListener('click', function() {
                window.location.href = `detail.html?body=${body.name.toLowerCase()}`;
            });
            
            // Add hover events for tooltips
           element.addEventListener('mouseenter', function(e) {
    // Stop propagation to parent elements
    e.stopPropagation();
    
    // Hide all tooltips first
    document.querySelectorAll('.tooltip').forEach(t => {
        t.style.display = 'none';
    });
    
    // Show only this tooltip
    const tooltip = this.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.display = 'block';
        tooltip.style.transform = `scale(${1/currentZoom})`;
    }
});
            
            element.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.style.display = 'none';
                }
            });
            
            if (body.hasRings) {
                const rings = document.createElement('div');
                rings.className = 'planet-rings';
                rings.style.width = `${body.diameter * 2.2}px`;
                rings.style.height = `${body.ringWidth}px`;
                rings.style.backgroundColor = body.ringColor;
                rings.style.left = `${-body.diameter * 0.6}px`;
                rings.style.top = `${(body.diameter - body.ringWidth) / 2}px`;
                element.appendChild(rings);
            }
            
            element.dataset.angle = angle;
            element.dataset.orbitSpeed = body.orbitSpeed;
            element.dataset.orbitRadius = body.orbitRadius;
            
            console.log(`Created ${body.name} at position:`, x, y);
        });
        
        celestialBodies.forEach(body => {
            if (!body.parentBody) return;
            
            const parentElement = document.querySelector(`.${body.parentBody.toLowerCase()}`);
            if (!parentElement) {
                console.error(`Parent body ${body.parentBody} not found for moon ${body.name}`);
                return;
            }
            
            const angle = Math.random() * Math.PI * 2;
            
            const parentDiameter = parseFloat(parentElement.style.width);
            
            const element = document.createElement('div');
            element.className = `celestial-body moon ${body.name.toLowerCase()}`;
            element.setAttribute('data-name', body.name);
            element.setAttribute('data-body-type', body.type);
            element.style.width = `${body.diameter}px`;
            element.style.height = `${body.diameter}px`;
            element.style.zIndex = 60;

            let orbitRadius = body.orbitRadius;
            if (body.parentBody === "Saturn") {
                orbitRadius = Math.max(body.orbitRadius, parentDiameter * 0.8);
            } else {
                orbitRadius = Math.max(body.orbitRadius, parentDiameter * 0.7);
            }
            body.orbitRadius = orbitRadius;

            const moonX = orbitRadius * Math.cos(angle);
            const moonY = orbitRadius * Math.sin(angle);
            element.style.left = `${(parentDiameter - body.diameter) / 2 + moonX}px`;
            element.style.top = `${(parentDiameter - body.diameter) / 2 + moonY}px`;
            
            const bodyContent = document.createElement('div');
            bodyContent.className = 'body-content';
            
            const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
tooltip.innerHTML = `
    <h3>${body.name}</h3>
    <p>${body.description}</p>
    ${body.type === 'planet' ? `<div class="tooltip-data">Diameter: ${body.diameter} km</div>` : ''}
`;
            
            const orbit = document.createElement('div');
            orbit.className = 'moon-orbit';
            orbit.setAttribute('data-moon', body.name);
            orbit.style.width = `${orbitRadius * 2}px`;
            orbit.style.height = `${orbitRadius * 2}px`;
            orbit.style.left = `${(parentDiameter - orbitRadius * 2) / 2}px`;
            orbit.style.top = `${(parentDiameter - orbitRadius * 2) / 2}px`;
            orbit.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            
            if (body.inclination) {
                orbit.style.transform = `rotateX(${body.inclination * 180}deg)`;
            }
            
            element.appendChild(bodyContent);
            element.appendChild(tooltip);
            parentElement.appendChild(element);
            parentElement.appendChild(orbit);
            
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                window.location.href = `detail.html?body=${body.name.toLowerCase()}`;
            });
            
            // Add hover events for tooltips
            element.addEventListener('mouseenter', function(e) {
                // Hide all other tooltips
                document.querySelectorAll('.tooltip').forEach(t => {
                    t.style.display = 'none';
                });
                
                // Show only this tooltip
                const tooltip = this.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.style.display = 'block';
                    tooltip.style.transform = `scale(${1/currentZoom})`;
                }
                e.stopPropagation();
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.style.display = 'none';
                }
            });
            
            element.dataset.angle = angle;
            element.dataset.orbitSpeed = body.orbitSpeed;
            element.dataset.orbitRadius = orbitRadius;
            element.dataset.adjustedRadius = orbitRadius;
            element.dataset.parentBody = body.parentBody;
            
            console.log(`Created moon ${body.name} orbiting ${body.parentBody} at relative position:`, moonX, moonY);
        });
        
        createAsteroidBelt();
    }
    
    function createAsteroidBelt() {
    console.log("Creating asteroid belt...");
    
    const beltContainer = document.createElement('div');
    beltContainer.className = 'asteroid-belt';
    
    const asteroidCount = 300;
    const minRadius = 750;
    const maxRadius = 850;
     const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < asteroidCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        const size = 1.5 + Math.random() * 3.5;
        
        const x = systemCenter.x + Math.cos(angle) * radius;
        const y = systemCenter.y + Math.sin(angle) * radius;
        
        const asteroid = document.createElement('div');
        asteroid.className = 'asteroid';
        asteroid.style.width = `${size}px`;
        asteroid.style.height = `${size}px`;
        asteroid.style.left = `${x - size/2}px`;
        asteroid.style.top = `${y - size/2}px`;
        
        const brightness = 150 + Math.floor(Math.random() * 105);
        asteroid.style.backgroundColor = `rgba(${brightness}, ${brightness}, ${brightness}, 0.9)`;
        asteroid.style.boxShadow = `0 0 2px rgba(255, 255, 255, 0.7)`;
        
        asteroid.dataset.angle = angle;
        asteroid.dataset.radius = radius;
        asteroid.dataset.orbitSpeed = 0.04 + Math.random() * 0.08;
        
        fragment.appendChild(asteroid);
    }
    
    beltContainer.appendChild(fragment);
    solarSystem.appendChild(beltContainer);
    console.log("Asteroid belt created with", asteroidCount, "asteroids");
}
    
    function animateCelestialBodies(timestamp) {
    animationFrameId = requestAnimationFrame(animateCelestialBodies);
    
    // Throttle updates based on target frame rate
    if (timestamp - lastFrameTime < FRAME_INTERVAL) {
        return;
    }
    lastFrameTime = timestamp;
        
        document.querySelectorAll('.celestial-body:not(.moon)').forEach(element => {
            if (element.getAttribute('data-name') === 'Sol') return;
            
            let angle = parseFloat(element.dataset.angle || 0);
            const speed = parseFloat(element.dataset.orbitSpeed || 0);
            const radius = parseFloat(element.dataset.orbitRadius || 0);
            
            const deltaTime = (timestamp - lastTime) / 16.67; // Calculate deltaTime here
lastTime = timestamp;

angle += (0.0002 * speed * deltaTime);
            if (angle > Math.PI * 2) angle -= Math.PI * 2;
            element.dataset.angle = angle;
            
            const diameter = parseFloat(element.style.width);
            const x = systemCenter.x + Math.cos(angle) * radius;
            const y = systemCenter.y + Math.sin(angle) * radius;
            
            element.style.left = `${x - diameter/2}px`;
            element.style.top = `${y - diameter/2}px`;
        });
        
        document.querySelectorAll('.celestial-body.moon').forEach(moon => {
            let angle = parseFloat(moon.dataset.angle || 0);
            const speed = parseFloat(moon.dataset.orbitSpeed || 0);
            const radius = parseFloat(moon.dataset.adjustedRadius || moon.dataset.orbitRadius || 0);
            
            angle += (0.0005 * speed * deltaTime);
            if (angle > Math.PI * 2) angle -= Math.PI * 2;
            moon.dataset.angle = angle;
            
            const parentElement = moon.parentElement;
            if (!parentElement) return;
            
            const diameter = parseFloat(moon.style.width);
            const parentDiameter = parseFloat(parentElement.style.width);
            
            // Calculate position based on orbit radius and angle
            const moonX = radius * Math.cos(angle);
            const moonY = radius * Math.sin(angle);
            
            // Position centered on parent and offset by orbit
            moon.style.left = `${(parentDiameter - diameter) / 2 + moonX}px`;
            moon.style.top = `${(parentDiameter - diameter) / 2 + moonY}px`;
        });
        
        document.querySelectorAll('.asteroid').forEach(asteroid => {
            let angle = parseFloat(asteroid.dataset.angle || 0);
            const speed = parseFloat(asteroid.dataset.orbitSpeed || 0);
            const radius = parseFloat(asteroid.dataset.radius || 0);
            
            angle += (0.0002 * speed * deltaTime);
            if (angle > Math.PI * 2) angle -= Math.PI * 2;
            asteroid.dataset.angle = angle;
            
            const size = parseFloat(asteroid.style.width);
            const x = systemCenter.x + Math.cos(angle) * radius;
            const y = systemCenter.y + Math.sin(angle) * radius;
            
            asteroid.style.left = `${x - size/2}px`;
            asteroid.style.top = `${y - size/2}px`;
        });
        
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            if (tooltip.style.display === 'block') {
                tooltip.style.transform = `scale(${1/currentZoom})`;
            }
        });
        
        requestAnimationFrame(animateCelestialBodies);
    }
    
    document.getElementById('zoom-in').addEventListener('click', function() {
        currentZoom = Math.min(currentZoom * 1.2, maxZoom);
        updateTransform();
    });
    
    document.getElementById('zoom-out').addEventListener('click', function() {
        currentZoom = Math.max(currentZoom * 0.8, minZoom);
        updateTransform();
    });
    
document.getElementById('reset').addEventListener('click', function() {
    currentZoom = minZoom; // Set to minimum zoom (max zoomed out)
    currentX = 0;
    currentY = 0;
    updateTransform();
});
    
    // Replace the mousedown event listener around line 304-309
solarSystem.addEventListener('mousedown', function(e) {
    // Only allow dragging when zoomed in
    if (currentZoom > minZoom) {
        isDragging = true;
        startDragX = e.clientX - currentX;
        startDragY = e.clientY - currentY;
    }
    e.preventDefault();
});
    
    document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    currentX = e.clientX - startDragX;
    currentY = e.clientY - startDragY;
    
    updateTransform();
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// Replace the wheel event listener around line 323-352
document.addEventListener('wheel', function(e) {
    e.preventDefault();
    
    const oldZoom = currentZoom;
    
    // Get mouse position relative to the universe element
    const rect = document.getElementById('universe').getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (e.deltaY < 0) {
        // Zooming in
        currentZoom = Math.min(currentZoom * 1.1, maxZoom);
    } else {
        // Zooming out
        currentZoom = Math.max(currentZoom * 0.9, minZoom);
    }
    
    // Only calculate zoom target if we're zoomed in
    if (currentZoom > minZoom) {
        // Adjust position to zoom toward cursor
        const zoomRatio = currentZoom / oldZoom;
        const targetX = (mouseX - rect.width/2);
        const targetY = (mouseY - rect.height/2);
        
        currentX = currentX - (targetX * (zoomRatio - 1));
        currentY = currentY - (targetY * (zoomRatio - 1));
    } else {
        // Reset position when at minimum zoom
        currentX = 0;
        currentY = 0;
    }
    
    updateTransform();
}, { passive: false });

let touchStartX, touchStartY, touchStartDist;

solarSystem.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
        isDragging = true;
        startDragX = e.touches[0].clientX - currentX;
        startDragY = e.touches[0].clientY - currentY;
    } else if (e.touches.length === 2) {
        isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.sqrt(dx * dx + dy * dy);
    }
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1 && isDragging) {
        currentX = e.touches[0].clientX - startDragX;
        currentY = e.touches[0].clientY - startDragY;
        
        updateTransform();
    } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDist = Math.sqrt(dx * dx + dy * dy);
        
        if (touchStartDist) {
            const zoomFactor = newDist / touchStartDist;
            currentZoom = Math.min(Math.max(currentZoom * zoomFactor, minZoom), maxZoom);
            touchStartDist = newDist;
            updateTransform();
        }
    }
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', function(e) {
    if (e.touches.length < 1) {
        isDragging = false;
    }
    if (e.touches.length !== 2) {
        touchStartDist = null;
    }
});

createCelestialBodies();
requestAnimationFrame(animateCelestialBodies);

const infoPanel = document.getElementById('info-panel');
if (infoPanel && infoPanel.querySelector('h2')) {
    infoPanel.querySelector('h2').textContent = 'Sol';
}

const loadingScreen = document.getElementById('loading');
if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

console.log("Initialization complete");
});

window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.display = 'none';
        }
    }, 3000); // Force removal after 3 seconds

    function cleanup() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Remove event listeners
    document.querySelectorAll('.celestial-body').forEach(body => {
        body.removeEventListener('mouseenter');
        body.removeEventListener('mouseleave');
        body.removeEventListener('click');
    });
    
    document.removeEventListener('mousemove');
    document.removeEventListener('mouseup');
    document.removeEventListener('wheel');
    document.removeEventListener('touchmove');
    document.removeEventListener('touchend');
}
});
