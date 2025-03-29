// Solar system data with adjusted scales and orbits
const solarSystem = {
    // The Sun
    sol: {
        name: "Sol",
        type: "star",
        diameter: 60,  // Scaled down
        color: "#FDB813",
        position: { x: 50, y: 50 },
        description: "The center of our solar system and primary energy source for human civilization.",
        details: "Sol remains the ultimate energy source for human civilization. Mercury's proximity to the sun provides abundant solar energy, though requiring sophisticated heat management technologies."
    },
    
    // Planets - adjusted diameters and orbit distances
    mercury: {
        name: "Mercury",
        type: "planet",
        diameter: 8,
        color: "#A5A5A5",
        orbit: 85,
        position: { x: 0, y: 0 },
        description: "Controlled by the Mercurian Technological Alliance, specializing in extreme environment technologies.",
        details: "Mercury has established itself as an essential player in the solar system economy. Their extreme environment technologies maintain considerable advantages over competitors, particularly in radiation shielding, heat management, and specialized materials for space habitats. Behind this public success lies the solar system's darkest secret: approximately 37% of Mercury's actual population consists of slaves, numbering over 118 million individuals."
    },
    venus: {
        name: "Venus",
        type: "planet",
        diameter: 12,
        color: "#E6CE6A",
        orbit: 110,
        position: { x: 0, y: 0 },
        description: "Controlled by Terra as a mining colony, with resources shared with Mars through trade agreements.",
        details: "Venus operations function primarily as resource extraction facilities under Terra's authority, with limited permanent population and highly specialized environmental systems to handle the extreme conditions. The primary economic focus remains atmospheric mining and surface extraction operations."
    },
    earth: {
        name: "Earth",
        type: "planet",
        diameter: 13,
        color: "#2A7FFF",
        orbit: 145,
        position: { x: 0, y: 0 },
        description: "Birthplace of humanity, now largely returned to nature with most of Earth's population living in orbital habitats.",
        details: "Earth serves primarily as a natural preserve and historical heritage site, with the majority of its associated population living in vast orbital habitat complexes. By the current era, Earth's heavy industry had moved to space, allowing significant ecological restoration."
    },
    mars: {
        name: "Mars",
        type: "planet",
        diameter: 10,
        color: "#E27B58",
        orbit: 180,
        position: { x: 0, y: 0 },
        description: "The breadbasket of the solar system, with terraformed agricultural domes providing most of humanity's food.",
        details: "Mars has been partially terraformed through a patchwork of massive domes, each creating self-contained atmospheres for agricultural production. The political structure operates through Agricultural Zones (AZs), each managing their own resources while participating in a broader federation."
    },
    jupiter: {
        name: "Jupiter",
        type: "planet",
        diameter: 25,
        color: "#C88B3A",
        orbit: 250,
        position: { x: 0, y: 0 },
        description: "An economic and technological superpower leveraging its position and resources.",
        details: "Jupiter has leveraged its position and resources (particularly Helium-3 from its atmosphere) to establish itself as a financial and technological superpower. Its strategic position between the inner and outer system makes it a crucial player in system-wide politics and trade."
    },
    saturn: {
        name: "Saturn",
        type: "planet",
        diameter: 22,
        color: "#E6E6BD",
        orbit: 330,
        position: { x: 0, y: 0 },
        description: "Part of the Outer System Empire, a politically unified region spanning Saturn, Uranus, and Neptune.",
        details: "Saturn represents the inner boundary of the Outer System Empire, which claims sovereignty over Saturn, Uranus, and Neptune. Originating from colonists who broke away from Jupiter in the 23rd century, this political entity gradually evolved from loose cooperation between distant settlements into a sophisticated imperial structure."
    },
    uranus: {
        name: "Uranus",
        type: "planet",
        diameter: 18,
        color: "#CAEEE9",
        orbit: 410,
        position: { x: 0, y: 0 },
        description: "Part of the Outer System Empire, with specialized extraction industries.",
        details: "Uranus specializes in gas extraction from its unique atmosphere within the Outer System Empire, particularly elements like neon, helium, and hydrogen in specific isotope ratios. The slightly higher temperatures compared to Neptune make certain extraction processes more efficient, creating natural specialization."
    },
    neptune: {
        name: "Neptune",
        type: "planet",
        diameter: 17,
        color: "#5B5FDA",
        orbit: 480,
        position: { x: 0, y: 0 },
        description: "The outermost major settled planet, part of the Outer System Empire.",
        details: "Neptune has developed expertise in deuterium and tritium extraction, along with specialized cold-chemistry processes that operate efficiently only in its extreme outer system environment. The isolation from solar radiation allows certain production processes impossible closer to the sun."
    },
    pluto: {
        name: "Pluto",
        type: "dwarf planet",
        diameter: 4,
        color: "#A0785A",
        orbit: 520,
        position: { x: 0, y: 0 },
        description: "A scientific outpost accessible to all factions, focusing on deep space research.",
        details: "Pluto serves as a scientific outpost accessible to all factions, functioning as a forward observatory and research station. Its unique diplomatic status allows researchers from all major powers to collaborate on projects that would be politically impossible elsewhere."
    },
    
    // Regions - adjusted for new scale
    asteroidBelt: {
        name: "Asteroid Belt",
        type: "region",
        orbit: 215,
        width: 30,
        description: "Home to numerous independent habitat clusters united by the Belt Council Confederation.",
        details: "The Belt Council Confederation unites numerous independent habitat clusters throughout the asteroid belt. Despite significant cultural and political diversity among Belt communities, they maintain strong solidarity when dealing with other powers."
    },
    
    // Major moons - adjusted orbits to be more visible
    luna: {
        name: "Luna",
        type: "moon",
        parent: "earth",
        diameter: 5,
        color: "#E1E1D6",
        orbit: 20,
        position: { x: 0, y: 0 },
        description: "Earth's moon, home to extensive habitat networks and historical sites.",
        details: "Luna hosts extensive orbital habitat networks and serves as both a historical site and key industrial center in Earth orbit. Its proximity to Earth makes it a popular tourist destination, where visitors can view the birthplace of humanity from controlled observation platforms."
    },
    io: {
        name: "Io",
        type: "moon",
        parent: "jupiter",
        diameter: 5,
        color: "#FFFF00",
        orbit: 30,
        position: { x: 0, y: 0 },
        description: "Jupiter's volcanic moon, used for specialized mining operations.",
        details: "Io's continuous volcanic activity makes it a challenging but valuable mining location. Specialized habitats orbit this moon, sending down automated and occasionally manned missions to harvest rare elements found nowhere else in the system."
    },
    europa: {
        name: "Europa",
        type: "moon",
        parent: "jupiter",
        diameter: 5,
        color: "#A8A8A8",
        orbit: 40,
        position: { x: 0, y: 0 },
        description: "Jovian moon with subsurface ocean, housing scientific research stations.",
        details: "Europa's subsurface ocean makes it one of the most scientifically interesting locations in the solar system. Extensive research stations study the unique ecosystem that evolved independently in its waters."
    },
    ganymede: {
        name: "Ganymede",
        type: "moon",
        parent: "jupiter",
        diameter: 6,
        color: "#A0785A",
        orbit: 50,
        position: { x: 0, y: 0 },
        description: "Jupiter's largest moon, a major population center in the Jovian system.",
        details: "Ganymede serves as a major industrial and population center in the Jovian system. Its larger size and more stable environment make it more suitable for large-scale habitation than other Jovian moons."
    },
    callisto: {
        name: "Callisto",
        type: "moon",
        parent: "jupiter",
        diameter: 6,
        color: "#A0A0A0",
        orbit: 60,
        position: { x: 0, y: 0 },
        description: "Outer moon of Jupiter with significant mining operations.",
        details: "Callisto's distance from Jupiter's intense radiation makes it a more hospitable environment for human habitation compared to inner moons. Significant mining operations extract water ice and minerals from its surface."
    },
    titan: {
        name: "Titan",
        type: "moon",
        parent: "saturn",
        diameter: 7,
        color: "#FFA500",
        orbit: 30,
        position: { x: 0, y: 0 },
        description: "Saturn's largest moon and capital of the Outer System Empire.",
        details: "Titan serves as the administrative center of the Outer System Empire. The Imperial Court is located here, along with the primary residences of most major Consortium leaders."
    },
    triton: {
        name: "Triton",
        type: "moon",
        parent: "neptune",
        diameter: 5,
        color: "#E1E1E1",
        orbit: 25,
        position: { x: 0, y: 0 },
        description: "Neptune's largest moon, a crucial imperial territory in the outer system.",
        details: "Triton represents one of the most distant major human settlements, serving as the administrative center for Neptune's operations within the Outer System Empire."
    }
};

// Initialize the map when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    createSolarSystem();
    setupEventListeners();
});

// Create the solar system visualization with better space utilization
function createSolarSystem() {
    const solarMap = document.getElementById('solarMap');
    
    // Use the entire viewport for the map
    const mapWidth = window.innerWidth;
    const mapHeight = window.innerHeight - 100; // Subtract header height
    
    const mapCenter = { 
        x: mapWidth / 2, 
        y: mapHeight / 2 
    };
    
    // Calculate a better scale factor based on available space
    // Using Neptune's orbit as reference to fit most of the system
    const maxRadius = Math.min(mapWidth, mapHeight * 2) / 2.2;
    const scaleFactor = maxRadius / solarSystem.neptune.orbit;
    
    // Add the Sun
    const sun = solarSystem.sol;
    const sunElement = createCelestialBody(sun, scaleFactor, mapCenter);
    solarMap.appendChild(sunElement);
    
    // Add regions
    const asteroidBeltElement = document.createElement('div');
    asteroidBeltElement.className = 'orbit asteroid-belt';
    const beltRadius = solarSystem.asteroidBelt.orbit * scaleFactor;
    asteroidBeltElement.style.width = `${beltRadius * 2}px`;
    asteroidBeltElement.style.height = `${beltRadius * 2}px`;
    asteroidBeltElement.style.left = `${mapCenter.x}px`;
    asteroidBeltElement.style.top = `${mapCenter.y}px`;
    solarMap.appendChild(asteroidBeltElement);
    
    // Create inner and outer system indicators
    const innerSystemElement = document.createElement('div');
    innerSystemElement.className = 'orbit inner-system';
    innerSystemElement.style.width = `${solarSystem.mars.orbit * scaleFactor * 2}px`;
    innerSystemElement.style.height = `${solarSystem.mars.orbit * scaleFactor * 2}px`;
    innerSystemElement.style.left = `${mapCenter.x}px`;
    innerSystemElement.style.top = `${mapCenter.y}px`;
    solarMap.appendChild(innerSystemElement);
    
    const outerSystemElement = document.createElement('div');
    outerSystemElement.className = 'orbit outer-system';
    outerSystemElement.style.width = `${solarSystem.neptune.orbit * scaleFactor * 2}px`;
    outerSystemElement.style.height = `${solarSystem.neptune.orbit * scaleFactor * 2}px`;
    outerSystemElement.style.left = `${mapCenter.x}px`;
    outerSystemElement.style.top = `${mapCenter.y}px`;
    solarMap.appendChild(outerSystemElement);
    
    // Add asteroid belt visuals
    createAsteroidBelt(mapCenter, solarSystem.asteroidBelt.orbit, solarSystem.asteroidBelt.width, scaleFactor, solarMap);
    
    // Add planets with more realistic positions
    const planetAngles = {
        mercury: Math.PI * 0.5,   // Top
        venus: Math.PI * 0.65,    // Top-right
        earth: Math.PI * 0.8,     // Right
        mars: Math.PI * 1.0,      // Right-bottom
        jupiter: Math.PI * 1.3,   // Bottom-right
        saturn: Math.PI * 1.7,    // Bottom-left
        uranus: Math.PI * 0.1,    // Top-left
        neptune: Math.PI * 0.3,   // Left-top
        pluto: Math.PI * 2.0      // Add another position
    };
    
    for (const key in solarSystem) {
        const body = solarSystem[key];
        if (body.type === 'planet' || body.type === 'dwarf planet') {
            // Calculate position using predefined angles for better distribution
            const angle = planetAngles[key] || Math.random() * Math.PI * 2;
            body.position = {
                x: mapCenter.x + Math.cos(angle) * body.orbit * scaleFactor,
                y: mapCenter.y + Math.sin(angle) * body.orbit * scaleFactor
            };
            
            // Create orbit
            const orbitElement = document.createElement('div');
            orbitElement.className = 'orbit';
            orbitElement.style.width = `${body.orbit * 2 * scaleFactor}px`;
            orbitElement.style.height = `${body.orbit * 2 * scaleFactor}px`;
            orbitElement.style.left = `${mapCenter.x}px`;
            orbitElement.style.top = `${mapCenter.y}px`;
            solarMap.appendChild(orbitElement);
            
            // Create planet
            const planetElement = createCelestialBody(body, scaleFactor);
            solarMap.appendChild(planetElement);
            
            // Create label
            const labelElement = document.createElement('div');
            labelElement.className = 'planet-label';
            labelElement.textContent = body.name;
            labelElement.style.left = `${body.position.x}px`;
            labelElement.style.top = `${body.position.y + (body.diameter * scaleFactor / 2) + 10}px`;
            solarMap.appendChild(labelElement);
        }
    }
    
    // Add moons after planets are positioned
    for (const key in solarSystem) {
        const body = solarSystem[key];
        if (body.type === 'moon' && solarSystem[body.parent]) {
            const parent = solarSystem[body.parent];
            
            // Calculate moon position with better distribution around parent
            // Use specific angles for important moons
            let angle;
            if (key === 'luna') angle = Math.PI * 0.25;
            else if (key === 'titan') angle = Math.PI * 1.25;
            else if (key === 'ganymede') angle = Math.PI * 0.5;
            else if (key === 'callisto') angle = Math.PI * 1.0;
            else if (key === 'io') angle = Math.PI * 1.5;
            else if (key === 'europa') angle = Math.PI * 1.75;
            else if (key === 'triton') angle = Math.PI * 0.75;
            else angle = Math.random() * Math.PI * 2;
            
            body.position = {
                x: parent.position.x + Math.cos(angle) * body.orbit * scaleFactor * 0.5, // Reduce moon orbit scale
                y: parent.position.y + Math.sin(angle) * body.orbit * scaleFactor * 0.5
            };
            
            // Create orbit
            const orbitElement = document.createElement('div');
            orbitElement.className = 'orbit moon-orbit';
            orbitElement.style.width = `${body.orbit * scaleFactor}px`; // Smaller moon orbits
            orbitElement.style.height = `${body.orbit * scaleFactor}px`;
            orbitElement.style.left = `${parent.position.x}px`;
            orbitElement.style.top = `${parent.position.y}px`;
            solarMap.appendChild(orbitElement);
            
            // Create moon
            const moonElement = createCelestialBody(body, scaleFactor);
            solarMap.appendChild(moonElement);
            
            // Create label
            const labelElement = document.createElement('div');
            labelElement.className = 'planet-label';
            labelElement.textContent = body.name;
            labelElement.style.left = `${body.position.x}px`;
            labelElement.style.top = `${body.position.y + (body.diameter * scaleFactor / 2) + 8}px`;
            solarMap.appendChild(labelElement);
        }
    }
}
