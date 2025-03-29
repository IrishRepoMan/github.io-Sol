// Solar system data
const solarSystem = {
    // The Sun
    sol: {
        name: "Sol",
        type: "star",
        diameter: 100,
        color: "#FDB813",
        position: { x: 50, y: 50 },
        description: "The center of our solar system and primary energy source for human civilization.",
        details: "Sol remains the ultimate energy source for human civilization. Mercury's proximity to the sun provides abundant solar energy, though requiring sophisticated heat management technologies."
    },
    
    // Planets
    mercury: {
        name: "Mercury",
        type: "planet",
        diameter: 10,
        color: "#A5A5A5",
        orbit: 15,
        position: { x: 0, y: 0 }, // Will be calculated
        description: "Controlled by the Mercurian Technological Alliance, specializing in extreme environment technologies.",
        details: "Mercury has established itself as an essential player in the solar system economy. Their extreme environment technologies maintain considerable advantages over competitors, particularly in radiation shielding, heat management, and specialized materials for space habitats. Behind this public success lies the solar system's darkest secret: approximately 37% of Mercury's actual population consists of slaves, numbering over 118 million individuals. This vast exploitation remains invisible to the broader solar system through a combination of physical isolation, sophisticated concealment technologies, and masterful information management."
    },
    venus: {
        name: "Venus",
        type: "planet",
        diameter: 18,
        color: "#E6CE6A",
        orbit: 22,
        position: { x: 0, y: 0 },
        description: "Controlled by Terra as a mining colony, with resources shared with Mars through trade agreements.",
        details: "Venus operations function primarily as resource extraction facilities under Terra's authority, with limited permanent population and highly specialized environmental systems to handle the extreme conditions. The primary economic focus remains atmospheric mining and surface extraction operations."
    },
    earth: {
        name: "Earth",
        type: "planet",
        diameter: 19,
        color: "#2A7FFF",
        orbit: 30,
        position: { x: 0, y: 0 },
        description: "Birthplace of humanity, now largely returned to nature with most of Earth's population living in orbital habitats.",
        details: "Earth serves primarily as a natural preserve and historical heritage site, with the majority of its associated population living in vast orbital habitat complexes. By the current era, Earth's heavy industry had moved to space, allowing significant ecological restoration. In the current era, Earth serves primarily as a biological preserve and historical heritage site."
    },
    mars: {
        name: "Mars",
        type: "planet",
        diameter: 15,
        color: "#E27B58",
        orbit: 46,
        position: { x: 0, y: 0 },
        description: "The breadbasket of the solar system, with terraformed agricultural domes providing most of humanity's food.",
        details: "Mars has been partially terraformed through a patchwork of massive domes, each creating self-contained atmospheres for agricultural production. The political structure operates through Agricultural Zones (AZs), each managing their own resources while participating in a broader federation. Water rights and atmospheric processing capabilities are major sources of political leverage and internal competition."
    },
    jupiter: {
        name: "Jupiter",
        type: "planet",
        diameter: 40,
        color: "#C88B3A",
        orbit: 80,
        position: { x: 0, y: 0 },
        description: "An economic and technological superpower leveraging its position and resources.",
        details: "Jupiter has leveraged its position and resources (particularly Helium-3 from its atmosphere) to establish itself as a financial and technological superpower. Its strategic position between the inner and outer system makes it a crucial player in system-wide politics and trade."
    },
    saturn: {
        name: "Saturn",
        type: "planet",
        diameter: 35,
        color: "#E6E6BD",
        orbit: 110,
        position: { x: 0, y: 0 },
        description: "Part of the Outer System Empire, a politically unified region spanning Saturn, Uranus, and Neptune.",
        details: "Saturn represents the inner boundary of the Outer System Empire, which claims sovereignty over Saturn, Uranus, and Neptune. Originating from colonists who broke away from Jupiter in the 23rd century, this political entity gradually evolved from loose cooperation between distant settlements into a sophisticated imperial structure. The empire operates through a system of Great Families (Consortiums) who control specific industries or resources across all three planetary systems, owing allegiance to the imperial throne on Titan."
    },
    uranus: {
        name: "Uranus",
        type: "planet",
        diameter: 28,
        color: "#CAEEE9",
        orbit: 140,
        position: { x: 0, y: 0 },
        description: "Part of the Outer System Empire, with specialized extraction industries.",
        details: "Uranus specializes in gas extraction from its unique atmosphere within the Outer System Empire, particularly elements like neon, helium, and hydrogen in specific isotope ratios. The slightly higher temperatures compared to Neptune make certain extraction processes more efficient, creating natural specialization."
    },
    neptune: {
        name: "Neptune",
        type: "planet",
        diameter: 27,
        color: "#5B5FDA",
        orbit: 170,
        position: { x: 0, y: 0 },
        description: "The outermost major settled planet, part of the Outer System Empire.",
        details: "Neptune has developed expertise in deuterium and tritium extraction, along with specialized cold-chemistry processes that operate efficiently only in its extreme outer system environment. The isolation from solar radiation allows certain production processes impossible closer to the sun."
    },
    pluto: {
        name: "Pluto",
        type: "dwarf planet",
        diameter: 5,
        color: "#A0785A",
        orbit: 190,
        position: { x: 0, y: 0 },
        description: "A scientific outpost accessible to all factions, focusing on deep space research.",
        details: "Pluto serves as a scientific outpost accessible to all factions, functioning as a forward observatory and research station. Its unique diplomatic status allows researchers from all major powers to collaborate on projects that would be politically impossible elsewhere."
    },
    
    // Regions
    asteroidBelt: {
        name: "Asteroid Belt",
        type: "region",
        orbit: 63,
        width: 15,
        description: "Home to numerous independent habitat clusters united by the Belt Council Confederation.",
        details: "The Belt Council Confederation unites numerous independent habitat clusters throughout the asteroid belt. Despite significant cultural and political diversity among Belt communities, they maintain strong solidarity when dealing with other powers. Each community has representation on the council, with voting weight determined by population and resource contribution. The Belt's control over significant mineral resources and strategic positioning gives them substantial influence in system-wide politics."
    },
    
    // Major moons
    luna: {
        name: "Luna",
        type: "moon",
        parent: "earth",
        diameter: 7,
        color: "#E1E1D6",
        orbit: 5,
        position: { x: 0, y: 0 },
        description: "Earth's moon, home to extensive habitat networks and historical sites.",
        details: "Luna hosts extensive orbital habitat networks and serves as both a historical site and key industrial center in Earth orbit. Its proximity to Earth makes it a popular tourist destination, where visitors can view the birthplace of humanity from controlled observation platforms."
    },
    io: {
        name: "Io",
        type: "moon",
        parent: "jupiter",
        diameter: 6,
        color: "#FFFF00",
        orbit: 8,
        position: { x: 0, y: 0 },
        description: "Jupiter's volcanic moon, used for specialized mining operations.",
        details: "Io's continuous volcanic activity makes it a challenging but valuable mining location. Specialized habitats orbit this moon, sending down automated and occasionally manned missions to harvest rare elements found nowhere else in the system."
    },
    europa: {
        name: "Europa",
        type: "moon",
        parent: "jupiter",
        diameter: 6,
        color: "#A8A8A8",
        orbit: 12,
        position: { x: 0, y: 0 },
        description: "Jovian moon with subsurface ocean, housing scientific research stations.",
        details: "Europa's subsurface ocean makes it one of the most scientifically interesting locations in the solar system. Extensive research stations study the unique ecosystem that evolved independently in its waters, while strict protocols prevent contamination between terrestrial and Europan life forms."
    },
    ganymede: {
        name: "Ganymede",
        type: "moon",
        parent: "jupiter",
        diameter: 8,
        color: "#A0785A",
        orbit: 16,
        position: { x: 0, y: 0 },
        description: "Jupiter's largest moon, a major population center in the Jovian system.",
        details: "Ganymede serves as a major industrial and population center in the Jovian system. Its larger size and more stable environment make it more suitable for large-scale habitation than other Jovian moons."
    },
    callisto: {
        name: "Callisto",
        type: "moon",
        parent: "jupiter",
        diameter: 7,
        color: "#A0A0A0",
        orbit: 20,
        position: { x: 0, y: 0 },
        description: "Outer moon of Jupiter with significant mining operations.",
        details: "Callisto's distance from Jupiter's intense radiation makes it a more hospitable environment for human habitation compared to inner moons. Significant mining operations extract water ice and minerals from its surface."
    },
    titan: {
        name: "Titan",
        type: "moon",
        parent: "saturn",
        diameter: 8,
        color: "#FFA500",
        orbit: 10,
        position: { x: 0, y: 0 },
        description: "Saturn's largest moon and capital of the Outer System Empire.",
        details: "Titan serves as the administrative center of the Outer System Empire. The Imperial Court is located here, along with the primary residences of most major Consortium leaders. Its unique atmosphere and surface lakes of liquid hydrocarbons make it a strategic resource as well as political center."
    },
    triton: {
        name: "Triton",
        type: "moon",
        parent: "neptune",
        diameter: 6,
        color: "#E1E1E1",
        orbit: 8,
        position: { x: 0, y: 0 },
        description: "Neptune's largest moon, a crucial imperial territory in the outer system.",
        details: "Triton represents one of the most distant major human settlements, serving as the administrative center for Neptune's operations within the Outer System Empire. Its retrograde orbit and active geology make it scientifically interesting while its resources make it economically valuable."
    }
    
    // Add more moons as needed
};

// Initialize the map when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    createSolarSystem();
    setupEventListeners();
});

// Create the solar system visualization
function createSolarSystem() {
    const solarMap = document.getElementById('solarMap');
    const mapCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    // Scale factor to adjust the sizes based on window size
    const scaleFactor = Math.min(window.innerWidth, window.innerHeight) / 450;
    
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
    innerSystemElement.style.width = `${solarSystem.mars.orbit * scaleFactor * 2.2}px`;
    innerSystemElement.style.height = `${solarSystem.mars.orbit * scaleFactor * 2.2}px`;
    innerSystemElement.style.left = `${mapCenter.x}px`;
    innerSystemElement.style.top = `${mapCenter.y}px`;
    solarMap.appendChild(innerSystemElement);
    
    const outerSystemElement = document.createElement('div');
    outerSystemElement.className = 'orbit outer-system';
    outerSystemElement.style.width = `${solarSystem.neptune.orbit * scaleFactor * 1.1}px`;
    outerSystemElement.style.height = `${solarSystem.neptune.orbit * scaleFactor * 1.1}px`;
    outerSystemElement.style.left = `${mapCenter.x}px`;
    outerSystemElement.style.top = `${mapCenter.y}px`;
    solarMap.appendChild(outerSystemElement);
    
    // Add asteroid belt visuals
    createAsteroidBelt(mapCenter, solarSystem.asteroidBelt.orbit, solarSystem.asteroidBelt.width, scaleFactor, solarMap);
    
    // Add planets
    for (const key in solarSystem) {
        const body = solarSystem[key];
        if (body.type === 'planet' || body.type === 'dwarf planet') {
            // Calculate position
            const angle = Math.random() * Math.PI * 2; // Random position along orbit
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
            
            // Calculate position
            const angle = Math.random() * Math.PI * 2; // Random position along orbit
            body.position = {
                x: parent.position.x + Math.cos(angle) * body.orbit * scaleFactor,
                y: parent.position.y + Math.sin(angle) * body.orbit * scaleFactor
            };
            
            // Create orbit
            const orbitElement = document.createElement('div');
            orbitElement.className = 'orbit moon-orbit';
            orbitElement.style.width = `${body.orbit * 2 * scaleFactor}px`;
            orbitElement.style.height = `${body.orbit * 2 * scaleFactor}px`;
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

// Create a celestial body element
function createCelestialBody(body, scaleFactor, mapCenter = null) {
    const element = document.createElement('div');
    element.className = 'celestial-body';
    element.setAttribute('data-name', body.name.toLowerCase());
    
    // Set size
    const diameter = body.diameter * scaleFactor;
    element.style.width = `${diameter}px`;
    element.style.height = `${diameter}px`;
    
    // Set color
    element.style.backgroundColor = body.color;
    
    // Set position
    if (mapCenter) {
        // For the sun, which is at the center
        element.style.left = `${mapCenter.x}px`;
        element.style.top = `${mapCenter.y}px`;
    } else {
        // For planets and moons, which are positioned on their orbits
        element.style.left = `${body.position.x}px`;
        element.style.top = `${body.position.y}px`;
    }
    
    return element;
}

// Create asteroid belt
function createAsteroidBelt(center, radius, width, scaleFactor, container) {
    const beltRadius = radius * scaleFactor;
    const beltWidth = width * scaleFactor;
    const innerRadius = beltRadius - beltWidth / 2;
    const outerRadius = beltRadius + beltWidth / 2;
    
    // Create asteroids
    const asteroidCount = 300;
    
    for (let i = 0; i < asteroidCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = innerRadius + Math.random() * (outerRadius - innerRadius);
        const x = center.x + Math.cos(angle) * distance;
        const y = center.y + Math.sin(angle) * distance;
        
        const asteroid = document.createElement('div');
        asteroid.className = 'celestial-body';
        asteroid.setAttribute('data-name', 'asteroid');
        
        // Random small size
        const size = 0.5 + Math.random() * 1.5;
        asteroid.style.width = `${size}px`;
        asteroid.style.height = `${size}px`;
        
        // Gray color with random variation
        const grayTone = 150 + Math.floor(Math.random() * 100);
        asteroid.style.backgroundColor = `rgb(${grayTone}, ${grayTone}, ${grayTone})`;
        
        asteroid.style.left = `${x}px`;
        asteroid.style.top = `${y}px`;
        
        container.appendChild(asteroid);
    }
}

// Set up event listeners for interactivity
function setupEventListeners() {
    const solarMap = document.getElementById('solarMap');
    const tooltip = document.getElementById('tooltip');
    const infoPanel = document.getElementById('infoPanel');
    const closeInfo = document.getElementById('closeInfo');
    const celestialBodyTitle = document.getElementById('celestialBodyTitle');
    const celestialBodyContent = document.getElementById('celestialBodyContent');
    
    // Hover effect for tooltips
    solarMap.addEventListener('mousemove', function(e) {
        const target = e.target;
        if (target.classList.contains('celestial-body')) {
            const bodyName = target.getAttribute('data-name');
            if (bodyName && bodyName !== 'asteroid') {
                const body = solarSystem[bodyName] || Object.values(solarSystem).find(body => body.name.toLowerCase() === bodyName);
                
                if (body) {
                    tooltip.innerHTML = `<h3>${body.name}</h3><p>${body.description}</p>`;
                    tooltip.style.left = `${e.pageX + 15}px`;
                    tooltip.style.top = `${e.pageY + 15}px`;
                    tooltip.classList.remove('hidden');
                }
            }
        } else {
            tooltip.classList.add('hidden');
        }
    });
    
    // Click effect for detailed information
    solarMap.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('celestial-body')) {
            const bodyName = target.getAttribute('data-name');
            if (bodyName && bodyName !== 'asteroid') {
                const body = solarSystem[bodyName] || Object.values(solarSystem).find(body => body.name.toLowerCase() === bodyName);
                
                if (body) {
                    celestialBodyTitle.textContent = body.name;
                    celestialBodyContent.innerHTML = `
                        <p><strong>Type:</strong> ${body.type.charAt(0).toUpperCase() + body.type.slice(1)}</p>
                        ${body.parent ? `<p><strong>Parent:</strong> ${solarSystem[body.parent].name}</p>` : ''}
                        <p>${body.details}</p>
                    `;
                    infoPanel.classList.remove('hidden');
                }
            }
        }
    });
    
    // Close info panel
    closeInfo.addEventListener('click', function() {
        infoPanel.classList.add('hidden');
    });
    
    // Make the map responsive
    window.addEventListener('resize', function() {
        // Remove current system
        document.getElementById('solarMap').innerHTML = '';
        // Create new one with updated dimensions
        createSolarSystem();
    });
}
