document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loading...");
    
    const solarSystem = document.getElementById('solar-system');
    const minZoom = 0.2;
    const maxZoom = 1.5;
    let currentZoom = 0.2;
    let isDragging = false;
    let startDragX, startDragY;
    let currentX = 0, currentY = 0;
    let lastTime = 0;
    let bodyVisibilityThresholds = {
        planet: 0.1,
        moon: 0.3,
        asteroid: 0.5,
        smallmoon: 0.6
    };
    
    let animationFrameId = null;
    const asteroidCount = 100;
    const systemSize = 5000;
    
    function updateTransform() {
        const maxPan = systemSize / 2 * currentZoom;
        currentX = Math.max(Math.min(currentX, maxPan), -maxPan);
        currentY = Math.max(Math.min(currentY, maxPan), -maxPan);
        
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
        
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.display = 'none';
        }
        
        alert("An error occurred while loading the solar system. Please check the console for details.");
        
        return true;
    };
    
    let moonOrbitsNeedUpdate = true;
    
    function updateMoonOrbits() {
        if (!moonOrbitsNeedUpdate) return;
        
        document.querySelectorAll('.celestial-body.moon').forEach(moon => {
            const parentBody = moon.dataset.parentBody;
            if (!parentBody) return;
            
            const parentElement = document.querySelector(`.${parentBody.toLowerCase()}`);
            if (!parentElement) return;
            
            const parentDiameter = parseFloat(parentElement.style.width);
            const moonDiameter = parseFloat(moon.style.width);
            
            let minOrbitRadius = parentDiameter / 2 + moonDiameter / 2 + 5;
            let orbitRadius = parseFloat(moon.dataset.orbitRadius || 0);
            orbitRadius = Math.max(orbitRadius, minOrbitRadius);
            moon.dataset.adjustedRadius = orbitRadius;
            
            if (!moon.dataset.orbitGroup) {
                const orbit = parentElement.querySelector(`.moon-orbit[data-moon="${moon.getAttribute('data-name')}"]`);
                if (orbit) {
                    orbit.style.width = `${orbitRadius * 2}px`;
                    orbit.style.height = `${orbitRadius * 2}px`;
                    orbit.style.left = `${(parentDiameter - orbitRadius * 2) / 2}px`;
                    orbit.style.top = `${(parentDiameter - orbitRadius * 2) / 2}px`;
                }
            }
        });
        
        // Update orbit group paths
        document.querySelectorAll('.moon-orbit[data-orbit-group]').forEach(orbit => {
            const parentName = orbit.dataset.parent;
            const groupId = orbit.dataset.orbitGroup;
            if (!parentName) return;
            
            const parentElement = document.querySelector(`.${parentName.toLowerCase()}`);
            if (!parentElement) return;
            
            const parentDiameter = parseFloat(parentElement.style.width);
            
            // Find the moons in this group
            const moonsInGroup = Array.from(document.querySelectorAll(`.celestial-body.moon[data-parent-body="${parentName}"][data-orbit-group="${groupId}"]`));
            if (moonsInGroup.length === 0) return;
            
            // Use the largest orbit radius in the group
            let largestRadius = 0;
            moonsInGroup.forEach(moon => {
                const radius = parseFloat(moon.dataset.orbitRadius || 0);
                if (radius > largestRadius) largestRadius = radius;
            });
            
            // Update the orbit path
            orbit.style.width = `${largestRadius * 2}px`;
            orbit.style.height = `${largestRadius * 2}px`;
            orbit.style.left = `${(parentDiameter - largestRadius * 2) / 2}px`;
            orbit.style.top = `${(parentDiameter - largestRadius * 2) / 2}px`;
            
            // Update all moons in this group to use the same radius
            moonsInGroup.forEach(moon => {
                moon.dataset.adjustedRadius = largestRadius;
            });
        });
        
        moonOrbitsNeedUpdate = false;
    }
    
    function updateBodyVisibility() {
        const planetItems = document.querySelectorAll('.celestial-body[data-body-type="planet"], .celestial-body[data-body-type="star"]');
        const moonItems = document.querySelectorAll('.celestial-body[data-body-type="moon"]');
        const smallMoonItems = document.querySelectorAll('.celestial-body[data-body-type="smallmoon"]');
        const asteroidItems = document.querySelectorAll('.asteroid');
        const orbitItems = document.querySelectorAll('.orbit');
        const moonOrbitItems = document.querySelectorAll('.moon-orbit');
        
        planetItems.forEach(body => {
            const bodyName = body.getAttribute('data-name');
            const tooltip = body.querySelector('.tooltip');
            const bodyContent = body.querySelector('.body-content');
            
            if (bodyName === "Sol") {
                body.style.display = 'block';
            } else {
                body.style.display = 'block';
            }
            
            let scaleFactor = Math.max(0.5, Math.min(1, 1 / (currentZoom * 1.5)));
            
            if (bodyContent) {
                bodyContent.style.transform = `scale(${scaleFactor})`;
            }
            
            if (tooltip) {
                tooltip.style.transform = `scale(${1/currentZoom})`;
                tooltip.style.display = 'none';
            }
        });
        
        moonItems.forEach(moon => {
            const tooltip = moon.querySelector('.tooltip');
            const bodyContent = moon.querySelector('.body-content');
            
            if (currentZoom >= bodyVisibilityThresholds.moon) {
                moon.style.display = 'block';
            } else {
                moon.style.display = 'none';
            }
            
            let scaleFactor = Math.max(0.5, Math.min(1, 1 / (currentZoom * 1.3)));
            
            if (bodyContent) {
                bodyContent.style.transform = `scale(${scaleFactor})`;
            }
            
            if (tooltip) {
                tooltip.style.transform = `scale(${1/currentZoom})`;
                tooltip.style.display = 'none';
            }
        });
        
        smallMoonItems.forEach(moon => {
            if (currentZoom >= bodyVisibilityThresholds.smallmoon) {
                moon.style.display = 'block';
            } else {
                moon.style.display = 'none';
            }
            
            let scaleFactor = Math.max(0.5, Math.min(1, 1 / (currentZoom * 1.3)));
            const bodyContent = moon.querySelector('.body-content');
            if (bodyContent) {
                bodyContent.style.transform = `scale(${scaleFactor})`;
            }
        });
        
        asteroidItems.forEach(asteroid => {
            if (currentZoom >= bodyVisibilityThresholds.asteroid) {
                asteroid.style.display = 'block';
            } else {
                asteroid.style.display = 'none';
            }
        });
        
        orbitItems.forEach(orbit => {
            orbit.style.opacity = Math.min(1, currentZoom * 2);
        });
        
        moonOrbitItems.forEach(orbit => {
            const moonType = orbit.dataset.moonType || "moon";
            const threshold = bodyVisibilityThresholds[moonType] || bodyVisibilityThresholds.moon;
            
            if (currentZoom >= threshold) {
                orbit.style.display = 'block';
                orbit.style.opacity = Math.min(1, currentZoom * 1.5);
            } else {
                orbit.style.display = 'none';
            }
        });
            
        if (currentZoom >= bodyVisibilityThresholds.moon) {
            moonOrbitsNeedUpdate = true;
            updateMoonOrbits();
        }
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
            inclination: 0.05,
            orbitGroup: 1
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
            inclination: 0.02,
            orbitGroup: 1
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
            inclination: 0.03,
            orbitGroup: 1
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
            inclination: 0.04,
            orbitGroup: 1
        },
        {
            name: "Amalthea",
            diameter: 4,
            orbitRadius: 25,
            orbitSpeed: 2.2,
            parentBody: "Jupiter",
            color: "#cc6644",
            type: "smallmoon",
            inclination: 0.05,
            orbitGroup: 2
        },
        {
            name: "Himalia",
            diameter: 3,
            orbitRadius: 90,
            orbitSpeed: 0.4,
            parentBody: "Jupiter",
            color: "#aaaaaa",
            type: "smallmoon",
            inclination: 0.10,
            orbitGroup: 3
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
            inclination: 0.05,
            orbitGroup: 1
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
            inclination: 0.06,
            orbitGroup: 1
        },
        {
            name: "Iapetus",
            diameter: 8,
            orbitRadius: 85,
            orbitSpeed: 0.6,
            parentBody: "Saturn",
            color: "#bbbbbb",
            description: "Distinctive two-toned moon with important surveillance outposts.",
            type: "moon",
            inclination: 0.09,
            orbitGroup: 1
        },
        {
            name: "Dione",
            diameter: 7,
            orbitRadius: 40,
            orbitSpeed: 1.3,
            parentBody: "Saturn",
            color: "#cccccc",
            type: "smallmoon",
            inclination: 0.04,
            orbitGroup: 2
        },
        {
            name: "Tethys",
            diameter: 7,
            orbitRadius: 35,
            orbitSpeed: 1.4,
            parentBody: "Saturn",
            color: "#dddddd",
            type: "smallmoon",
            inclination: 0.03,
            orbitGroup: 2
        },
        {
            name: "Enceladus",
            diameter: 5,
            orbitRadius: 30,
            orbitSpeed: 1.5,
            parentBody: "Saturn",
            color: "#ffffff",
            description: "An icy moon with subsurface ocean, known for water harvesting operations.",
            type: "smallmoon",
            inclination: 0.03,
            orbitGroup: 2
        },
        {
            name: "Mimas",
            diameter: 4,
            orbitRadius: 25,
            orbitSpeed: 1.7,
            parentBody: "Saturn",
            color: "#bbbbbb",
            type: "smallmoon",
            inclination: 0.04,
            orbitGroup: 2
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
            name: "Titania",
            diameter: 8,
            orbitRadius: 40,
            orbitSpeed: 1.0,
            parentBody: "Uranus",
            color: "#aaaaaa",
            description: "Uranus' largest moon with major gas processing facilities.",
            type: "moon",
            inclination: 0.05,
            orbitGroup: 1
        },
        {
            name: "Oberon",
            diameter: 8,
            orbitRadius: 45,
            orbitSpeed: 0.9,
            parentBody: "Uranus",
            color: "#999999",
            description: "Site of the historic Treaty of Oberon that ended the Uranus Conflict.",
            type: "moon",
            inclination: 0.06,
            orbitGroup: 1
        },
        {
            name: "Umbriel",
            diameter: 6,
            orbitRadius: 35,
            orbitSpeed: 1.2,
            parentBody: "Uranus",
            color: "#777777",
            type: "smallmoon",
            inclination: 0.04,
            orbitGroup: 2
        },
        {
            name: "Ariel",
            diameter: 6,
            orbitRadius: 30,
            orbitSpeed: 1.3,
            parentBody: "Uranus",
            color: "#bbbbbb",
            type: "smallmoon",
            inclination: 0.03,
            orbitGroup: 2
        },
        {
            name: "Miranda",
            diameter: 4,
            orbitRadius: 25,
            orbitSpeed: 1.5,
            parentBody: "Uranus",
            color: "#aaaaaa",
            type: "smallmoon",
            inclination: 0.07,
            orbitGroup: 2
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
            inclination: 0.08,
            orbitGroup: 1
        },
        {
            name: "Proteus",
            diameter: 5,
            orbitRadius: 30,
            orbitSpeed: 1.3,
            parentBody: "Neptune",
            color: "#aaaacc",
            type: "smallmoon",
            inclination: 0.04,
            orbitGroup: 2
        },
        {
            name: "Nereid",
            diameter: 4,
            orbitRadius: 55,
            orbitSpeed: 0.8,
            parentBody: "Neptune",
            color: "#9999bb",
            type: "smallmoon",
            inclination: 0.12,
            orbitGroup: 3
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
            orbitRadius: 20,
            orbitSpeed: 1.0,
            parentBody: "Pluto",
            color: "#bbaa99",
            description: "Pluto's largest moon, housing additional research facilities and living quarters.",
            type: "moon",
            inclination: 0.06
        }
    ];
    
    const systemCenter = {
        x: systemSize / 2,
        y: systemSize / 2
    };
    
    function createCelestialBodies() {
        console.log("Creating celestial bodies...");
        
        // Create planets and sun
        celestialBodies.forEach(body => {
            if (body.parentBody) return;
            
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
            tooltip.innerHTML = `<h3>${body.name}</h3><p>${body.description}</p>`;
            
            const orbit = document.createElement('div');
            orbit.className = 'orbit';
            orbit.style.width = `${body.orbitRadius * 2}px`;
            orbit.style.height = `${body.orbitRadius * 2}px`;
            orbit.style.left = `${systemCenter.x - body.orbitRadius}px`;
            orbit.style.top = `${systemCenter.y - body.orbitRadius}px`;
            orbit.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            
            if (body.inclination) {
                orbit.style.transform = `rotateX(${body.inclination * 180}deg)`;
            }
            
            element.appendChild(bodyContent);
            element.appendChild(tooltip);
            solarSystem.appendChild(element);
            solarSystem.appendChild(orbit);
            
            element.addEventListener('click', function() {
                window.location.href = `detail.html?body=${body.name.toLowerCase()}`;
            });
            
            element.addEventListener('mouseenter', function(e) {
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
        
        // First, group moons by parent body and orbit group
        const moonsByParent = {};
        
        celestialBodies.forEach(body => {
            if (!body.parentBody) return;
            
            if (!moonsByParent[body.parentBody]) {
                moonsByParent[body.parentBody] = {};
            }
            
            const groupId = body.orbitGroup || 'individual';
            
            if (!moonsByParent[body.parentBody][groupId]) {
                moonsByParent[body.parentBody][groupId] = [];
            }
            
            moonsByParent[body.parentBody][groupId].push(body);
        });
        
        // Create orbit paths for each group
        Object.keys(moonsByParent).forEach(parentName => {
            const parentElement = document.querySelector(`.${parentName.toLowerCase()}`);
            if (!parentElement) return;
            
            const parentDiameter = parseFloat(parentElement.style.width);
            
            Object.keys(moonsByParent[parentName]).forEach(groupId => {
                if (groupId === 'individual') return;
                
                const moonsInGroup = moonsByParent[parentName][groupId];
                if (moonsInGroup.length === 0) return;
                
                // Find largest orbit radius in group
                let largestRadius = 0;
                moonsInGroup.forEach(moon => {
                    let scaledRadius = moon.orbitRadius;
                    if (parentName === "Saturn") {
                        scaledRadius = Math.max(scaledRadius, parentDiameter * 0.7);
                    } else {
                        scaledRadius = Math.max(scaledRadius, parentDiameter * 0.6);
                    }
                    
                    if (scaledRadius > largestRadius) largestRadius = scaledRadius;
                });
                
                // Create the group orbit
                const orbit = document.createElement('div');
                orbit.className = 'moon-orbit';
                orbit.setAttribute('data-orbit-group', groupId);
                orbit.setAttribute('data-parent', parentName);
                orbit.setAttribute('data-moon-type', moonsInGroup[0].type || 'moon');
                
                orbit.style.width = `${largestRadius * 2}px`;
                orbit.style.height = `${largestRadius * 2}px`;
                orbit.style.left = `${(parentDiameter - largestRadius * 2) / 2}px`;
                orbit.style.top = `${(parentDiameter - largestRadius * 2) / 2}px`;
                orbit.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                
                const inclination = moonsInGroup[0].inclination || 0;
                if (inclination) {
                    orbit.style.transform = `rotateX(${inclination * 180}deg)`;
                }
                
                parentElement.appendChild(orbit);
                
                // Update all moons to use the same radius
                moonsInGroup.forEach(moon => {
                    moon.adjustedRadius = largestRadius;
                });
            });
        });
        
        // Now create the moons
        Object.keys(moonsByParent).forEach(parentName => {
            const parentElement = document.querySelector(`.${parentName.toLowerCase()}`);
            if (!parentElement) return;
            
            const parentDiameter = parseFloat(parentElement.style.width);
            
            // First create individual moons
            if (moonsByParent[parentName]['individual']) {
                moonsByParent[parentName]['individual'].forEach(moon => {
                    const angle = Math.random() * Math.PI * 2;
                    let orbitRadius = moon.orbitRadius;
                    
                    if (parentName === "Saturn") {
                        orbitRadius = Math.max(orbitRadius,
                                       parentDiameter * 0.8);
                    } else {
                        orbitRadius = Math.max(orbitRadius, parentDiameter * 0.7);
                    }
                    
                    const element = document.createElement('div');
                    element.className = `celestial-body moon ${moon.name.toLowerCase()}`;
                    element.setAttribute('data-name', moon.name);
                    element.setAttribute('data-body-type', moon.type || "moon");
                    element.style.width = `${moon.diameter}px`;
                    element.style.height = `${moon.diameter}px`;
                    element.style.zIndex = 60;
                    
                    const moonX = orbitRadius * Math.cos(angle);
                    const moonY = orbitRadius * Math.sin(angle);
                    element.style.left = `${(parentDiameter - moon.diameter) / 2 + moonX}px`;
                    element.style.top = `${(parentDiameter - moon.diameter) / 2 + moonY}px`;
                    
                    const bodyContent = document.createElement('div');
                    bodyContent.className = 'body-content';
                    
                    if (moon.description) {
                        const tooltip = document.createElement('div');
                        tooltip.className = 'tooltip';
                        tooltip.innerHTML = `<h3>${moon.name}</h3><p>${moon.description}</p>`;
                        element.appendChild(tooltip);
                    }
                    
                    element.appendChild(bodyContent);
                    parentElement.appendChild(element);
                    
                    const orbit = document.createElement('div');
                    orbit.className = 'moon-orbit';
                    orbit.setAttribute('data-moon', moon.name);
                    orbit.setAttribute('data-moon-type', moon.type || "moon");
                    orbit.style.width = `${orbitRadius * 2}px`;
                    orbit.style.height = `${orbitRadius * 2}px`;
                    orbit.style.left = `${(parentDiameter - orbitRadius * 2) / 2}px`;
                    orbit.style.top = `${(parentDiameter - orbitRadius * 2) / 2}px`;
                    orbit.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                    
                    if (moon.inclination) {
                        orbit.style.transform = `rotateX(${moon.inclination * 180}deg)`;
                    }
                    
                    parentElement.appendChild(orbit);
                    
                    element.addEventListener('click', function(e) {
                        e.stopPropagation();
                        window.location.href = `detail.html?body=${moon.name.toLowerCase()}`;
                    });
                    
                    element.addEventListener('mouseenter', function(e) {
                        if (this.querySelector('.tooltip')) {
                            this.querySelector('.tooltip').style.display = 'block';
                            this.querySelector('.tooltip').style.transform = `scale(${1/currentZoom})`;
                        }
                        e.stopPropagation();
                    });
                    
                    element.addEventListener('mouseleave', function() {
                        if (this.querySelector('.tooltip')) {
                            this.querySelector('.tooltip').style.display = 'none';
                        }
                    });
                    
                    element.dataset.angle = angle;
                    element.dataset.orbitSpeed = moon.orbitSpeed;
                    element.dataset.orbitRadius = orbitRadius;
                    element.dataset.adjustedRadius = orbitRadius;
                    element.dataset.parentBody = moon.parentBody;
                });
            }
            
            Object.keys(moonsByParent[parentName]).forEach(groupId => {
                if (groupId === 'individual') return;
                
                const moonsInGroup = moonsByParent[parentName][groupId];
                if (moonsInGroup.length === 0) return;
                
                let largestRadius = 0;
                moonsInGroup.forEach(moon => {
                    let scaledRadius = moon.orbitRadius;
                    if (parentName === "Saturn") {
                        scaledRadius = Math.max(scaledRadius, parentDiameter * 0.8);
                    } else {
                        scaledRadius = Math.max(scaledRadius, parentDiameter * 0.7);
                    }
                    
                    if (scaledRadius > largestRadius) largestRadius = scaledRadius;
                });
                
                moonsInGroup.forEach((moon, index) => {
                    const angle = (index / moonsInGroup.length) * Math.PI * 2;
                    
                    const element = document.createElement('div');
                    element.className = `celestial-body moon ${moon.name.toLowerCase()}`;
                    element.setAttribute('data-name', moon.name);
                    element.setAttribute('data-body-type', moon.type || "moon");
                    element.style.width = `${moon.diameter}px`;
                    element.style.height = `${moon.diameter}px`;
                    element.style.zIndex = 60;
                    
                    const moonX = largestRadius * Math.cos(angle);
                    const moonY = largestRadius * Math.sin(angle);
                    element.style.left = `${(parentDiameter - moon.diameter) / 2 + moonX}px`;
                    element.style.top = `${(parentDiameter - moon.diameter) / 2 + moonY}px`;
                    
                    const bodyContent = document.createElement('div');
                    bodyContent.className = 'body-content';
                    
                    if (moon.description) {
                        const tooltip = document.createElement('div');
                        tooltip.className = 'tooltip';
                        tooltip.innerHTML = `<h3>${moon.name}</h3><p>${moon.description}</p>`;
                        element.appendChild(tooltip);
                    }
                    
                    element.appendChild(bodyContent);
                    parentElement.appendChild(element);
                    
                    element.addEventListener('click', function(e) {
                        e.stopPropagation();
                        window.location.href = `detail.html?body=${moon.name.toLowerCase()}`;
                    });
                    
                    element.addEventListener('mouseenter', function(e) {
                        if (this.querySelector('.tooltip')) {
                            this.querySelector('.tooltip').style.display = 'block';
                            this.querySelector('.tooltip').style.transform = `scale(${1/currentZoom})`;
                        }
                        e.stopPropagation();
                    });
                    
                    element.addEventListener('mouseleave', function() {
                        if (this.querySelector('.tooltip')) {
                            this.querySelector('.tooltip').style.display = 'none';
                        }
                    });
                    
                    element.dataset.angle = angle;
                    element.dataset.orbitSpeed = moon.orbitSpeed;
                    element.dataset.orbitRadius = largestRadius;
                    element.dataset.adjustedRadius = largestRadius;
                    element.dataset.parentBody = moon.parentBody;
                    element.dataset.orbitGroup = groupId;
                });
            });
        });
        
        createAsteroidBelt();
    }
    
    function createAsteroidBelt() {
        console.log("Creating asteroid belt...");
        
        const beltContainer = document.createElement('div');
        beltContainer.className = 'asteroid-belt';
        
        const fragment = document.createDocumentFragment();
        
        const minRadius = 750;
        const maxRadius = 850;
        
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
    
    const throttledUpdate = (function() {
        let lastExecution = 0;
        
        return function(timestamp) {
            if (timestamp - lastExecution > 50) {
                moonOrbitsNeedUpdate = true;
                lastExecution = timestamp;
            }
        };
    })();
    
    function animateCelestialBodies(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = (timestamp - lastTime) / 16.67;
        lastTime = timestamp;
        
        throttledUpdate(timestamp);
        
        document.querySelectorAll('.celestial-body:not(.moon)').forEach(element => {
            if (element.getAttribute('data-name') === 'Sol') return;
            
            let angle = parseFloat(element.dataset.angle || 0);
            const speed = parseFloat(element.dataset.orbitSpeed || 0);
            const radius = parseFloat(element.dataset.orbitRadius || 0);
            
            angle += (0.0002 * speed * deltaTime);
            if (angle > Math.PI * 2) angle -= Math.PI * 2;
            element.dataset.angle = angle;
            
            const diameter = parseFloat(element.style.width);
            const x = systemCenter.x + Math.cos(angle) * radius;
            const y = systemCenter.y + Math.sin(angle) * radius;
            
            element.style.left = `${x - diameter/2}px`;
            element.style.top = `${y - diameter/2}px`;
        });
        
        if (currentZoom >= bodyVisibilityThresholds.moon) {
            const moonsByGroup = {};
            
            document.querySelectorAll('.celestial-body.moon[data-orbit-group]').forEach(moon => {
                const parentBody = moon.dataset.parentBody;
                const orbitGroup = moon.dataset.orbitGroup;
                const key = `${parentBody}-${orbitGroup}`;
                
                if (!moonsByGroup[key]) {
                    moonsByGroup[key] = {
                        moons: [],
                        speed: parseFloat(moon.dataset.orbitSpeed || 0),
                        angle: parseFloat(moon.dataset.groupAngle || 0)
                    };
                }
                
                moonsByGroup[key].moons.push(moon);
            });
            
            Object.keys(moonsByGroup).forEach(key => {
                const group = moonsByGroup[key];
                let angle = group.angle || 0;
                
                angle += (0.0005 * group.speed * deltaTime);
                if (angle > Math.PI * 2) angle -= Math.PI * 2;
                group.angle = angle;
                
                group.moons.forEach((moon, index) => {
                    const moonCount = group.moons.length;
                    const moonAngle = angle + (index / moonCount) * Math.PI * 2;
                    moon.dataset.groupAngle = angle;
                    
                    const radius = parseFloat(moon.dataset.adjustedRadius || 0);
                    const diameter = parseFloat(moon.style.width);
                    const parentElement = moon.parentElement;
                    const parentDiameter = parseFloat(parentElement.style.width);
                    
                    const moonX = radius * Math.cos(moonAngle);
                    const moonY = radius * Math.sin(moonAngle);
                    
                    moon.style.left = `${(parentDiameter - diameter) / 2 + moonX}px`;
                    moon.style.top = `${(parentDiameter - diameter) / 2 + moonY}px`;
                });
            });
            
            document.querySelectorAll('.celestial-body.moon:not([data-orbit-group])').forEach(moon => {
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
                
                const moonX = radius * Math.cos(angle);
                const moonY = radius * Math.sin(angle);
                
                moon.style.left = `${(parentDiameter - diameter) / 2 + moonX}px`;
                moon.style.top = `${(parentDiameter - diameter) / 2 + moonY}px`;
            });
        }
        
        if (currentZoom >= bodyVisibilityThresholds.asteroid) {
            const updates = [];
            
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
                
                updates.push({
                    element: asteroid,
                    left: `${x - size/2}px`,
                    top: `${y - size/2}px`
                });
            });
            
            updates.forEach(update => {
                update.element.style.left = update.left;
                update.element.style.top = update.top;
            });
        }
        
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            if (tooltip.style.display === 'block') {
                tooltip.style.transform = `scale(${1/currentZoom})`;
            }
        });
        
        animationFrameId = requestAnimationFrame(animateCelestialBodies);
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
        currentZoom = minZoom;
        currentX = 0;
        currentY = 0;
        updateTransform();
    });
    
    solarSystem.addEventListener('mousedown', function(e) {
        isDragging = true;
        startDragX = e.clientX - currentX;
        startDragY = e.clientY - currentY;
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
    
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const oldZoom = currentZoom;
        
        const rect = document.getElementById('universe').getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        if (e.deltaY < 0) {
            currentZoom = Math.min(currentZoom * 1.1, maxZoom);
        } else {
            currentZoom = Math.max(currentZoom * 0.9, minZoom);
        }
        
        const zoomRatio = currentZoom / oldZoom;
        const targetX = (mouseX - rect.width/2);
        const targetY = (mouseY - rect.height/2);
        
        currentX = currentX - (targetX * (zoomRatio - 1));
        currentY = currentY - (targetY * (zoomRatio - 1));
        
        updateTransform();
    }, { passive: false });
    
    let touchStartX, touchStartY, touchStartDist;
    let lastTouchEnd = 0;
    
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
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            currentZoom = minZoom;
            currentX = 0;
            currentY = 0;
            updateTransform();
        }
        lastTouchEnd = now;
        
        if (e.touches.length < 1) {
            isDragging = false;
        }
        if (e.touches.length !== 2) {
            touchStartDist = null;
        }
    });
    
    createCelestialBodies();
    animationFrameId = requestAnimationFrame(animateCelestialBodies);
    
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
    
    window.addEventListener('beforeunload', function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
});

window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.display = 'none';
        }
    }, 3000);
});        
