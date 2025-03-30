document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loading...");
    
    // Configuration
    const solarSystem = document.getElementById('solar-system');
    const minZoom = 0.1;
    const maxZoom = 1.5;
    let currentZoom = 0.2; // Start zoomed out to see more
    let isDragging = false;
    let startDragX, startDragY;
    let currentX = 0, currentY = 0;
    let lastTime = 0;
    
    // Apply initial zoom
    function updateTransform() {
        solarSystem.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentZoom})`;
    }
    
    updateTransform();
    
    // Enhanced celestial bodies data with more moons and details
    const celestialBodies = [
        {
            name: "Sol",
            diameter: 200,
            position: { x: 2500, y: 2500 },
            color: "#fd6801",
            description: "Our solar system's star, providing energy to all planets and supporting life on Earth.",
            orbitSpeed: 0,
            type: "star"
        },
        // Inner planets
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
        // Gas giants
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
        }
    ];
    
    // Create celestial bodies
    function createCelestialBodies() {
        console.log("Creating celestial bodies...");
        
        // First pass - create all primary bodies (sun and planets)
        celestialBodies.forEach(body => {
            if (body.parentBody) return; // Skip moons for now
            
            if (body.name === "Sol") {
                // The sun is already in our HTML, just need to adjust its size
                const sunElement = document.querySelector('.sun');
                sunElement.style.width = `${body.diameter}px`;
                sunElement.style.height = `${body.diameter}px`;
                sunElement.style.left = `${body.position.x - body.diameter/2}px`;
                sunElement.style.top = `${body.position.y - body.diameter/2}px`;
                sunElement.dataset.bodyType = body.type;
                console.log("Sun positioned at:", sunElement.style.left, sunElement.style.top);
                return;
            }
            
            // Calculate initial position based on orbit
            const angle = Math.random() * Math.PI * 2; // Random starting position
            const x = 2500 + Math.cos(angle) * body.orbitRadius - body.diameter/2;
            const y = 2500 + Math.sin(angle) * body.orbitRadius - body.diameter/2;
            
            // Create the HTML element
            const element = document.createElement('div');
            element.className = `celestial-body ${body.name.toLowerCase()}`;
            element.setAttribute('data-name', body.name);
            element.setAttribute('data-body-type', body.type);
            element.style.width = `${body.diameter}px`;
            element.style.height = `${body.diameter}px`;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.zIndex = 50; // Higher than orbit lines but lower than tooltips
            
            // Create body content (the visible planet)
            const bodyContent = document.createElement('div');
            bodyContent.className = 'body-content';
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = `<h3>${body.name}</h3><p>${body.description}</p>`;
            
            // Add orbit path with improved visibility
            const orbit = document.createElement('div');
            orbit.className = 'orbit';
            orbit.style.width = `${body.orbitRadius * 2}px`;
            orbit.style.height = `${body.orbitRadius * 2}px`;
            orbit.style.left = `${2500 - body.orbitRadius}px`;
            orbit.style.top = `${2500 - body.orbitRadius}px`;
            orbit.style.borderColor = 'rgba(255, 255, 255, 0.3)'; // More visible orbit line
            
            // Apply orbit inclination
            if (body.inclination) {
                orbit.style.transform = `rotateX(${body.inclination * 180}deg)`;
            }
            
            // Add to DOM
            element.appendChild(bodyContent);
            element.appendChild(tooltip);
            solarSystem.appendChild(element);
            solarSystem.appendChild(orbit);
            
            // Handle rings for gas giants
            if (body.hasRings) {
                const rings = document.createElement('div');
                rings.className = 'planet-rings';
                rings.style.width = `${body.diameter * 2.2}px`; // 220% of planet diameter
                rings.style.height = `${body.ringWidth}px`;
                rings.style.backgroundColor = body.ringColor;
                rings.style.left = `${-body.diameter * 0.6}px`;
                rings.style.top = `${(body.diameter - body.ringWidth) / 2}px`;
                element.appendChild(rings);
            }
            
            // Add click event
            element.addEventListener('click', function() {
                window.location.href = `detail.html?body=${body.name.toLowerCase()}`;
            });
            
            // Store additional data for animation
            element.dataset.angle = angle;
            element.dataset.orbitSpeed = body.orbitSpeed;
            element.dataset.orbitRadius = body.orbitRadius;
            element.dataset.parentBody = body.parentBody || null;
            element.dataset.inclination = body.inclination || 0;
            
            console.log(`Created ${body.name} at position:`, x, y);
        });
        
        // Second pass - create moons and orbit them around their parent planets
        celestialBodies.forEach(body => {
            if (!body.parentBody) return; // Skip non-moons
            
            // Find the parent body element
            const parentElement = document.querySelector(`.${body.parentBody.toLowerCase()}`);
            if (!parentElement) {
                console.error(`Parent body ${body.parentBody} not found for moon ${body.name}`);
                return;
            }
            
            // Calculate initial position based on orbit around parent
            const angle = Math.random() * Math.PI * 2; // Random starting position
            
            // Create the HTML element
            const element = document.createElement('div');
            element.className = `celestial-body ${body.name.toLowerCase()}`;
            element.setAttribute('data-name', body.name);
            element.setAttribute('data-body-type', body.type);
            element.style.width = `${body.diameter}px`;
            element.style.height = `${body.diameter}px`;
            element.style.zIndex = 60; // Higher than planets
            
            // Create body content (the visible moon)
            const bodyContent = document.createElement('div');
            bodyContent.className = 'body-content';
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = `<h3>${body.name}</h3><p>${body.description}</p>`;
            
            // Add orbit path for moon with improved visibility
            const orbit = document.createElement('div');
            orbit.className = 'moon-orbit';
            orbit.style.width = `${body.orbitRadius * 2}px`;
            orbit.style.height = `${body.orbitRadius * 2}px`;
            orbit.style.left = `${(parentElement.offsetWidth - body.orbitRadius * 2) / 2}px`;
            orbit.style.top = `${(parentElement.offsetHeight - body.orbitRadius * 2) / 2}px`;
            orbit.style.borderColor = 'rgba(255, 255, 255, 0.25)'; // Slightly visible orbit line
            
            // Apply orbit inclination
            if (body.inclination) {
                orbit.style.transform = `rotateX(${body.inclination * 180}deg)`;
            }
            
            // Add to DOM - append to parent planet
            element.appendChild(bodyContent);
            element.appendChild(tooltip);
            parentElement.appendChild(element);
            parentElement.appendChild(orbit);
            
            // Add click event
            element.addEventListener('click', function(e) {
                e.stopPropagation(); // Stop event from triggering parent's click
                window.location.href = `detail.html?body=${body.name.toLowerCase()}`;
            });
            
            // Store additional data for animation
            element.dataset.angle = angle;
            element.dataset.orbitSpeed = body.orbitSpeed;
            element.dataset.orbitRadius = body.orbitRadius;
            element.dataset.parentBody = body.parentBody;
            element.dataset.inclination = body.inclination || 0;
            
            console.log(`Created moon ${body.name} orbiting ${body.parentBody}`);
        });
        
        // Create asteroid belt
        createAsteroidBelt();
    }
    
    // Create asteroid belt
    function createAsteroidBelt() {
        console.log("Creating asteroid belt...");
        
        const beltContainer = document.createElement('div');
        beltContainer.className = 'asteroid-belt';
        
        // Create individual asteroids
        const asteroidCount = 300; // Reduced for better performance
        const minRadius = 750;
        const maxRadius = 850;
        
        for (let i = 0; i < asteroidCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = minRadius + Math.random() * (maxRadius - minRadius);
            const size = 1.5 + Math.random() * 3.5;
            
            const x = 2500 + Math.cos(angle) * radius - size/2;
            const y = 2500 + Math.sin(angle) * radius - size/2;
            
            const asteroid = document.createElement('div');
            asteroid.className = 'asteroid';
            asteroid.style.width = `${size}px`;
            asteroid.style.height = `${size}px`;
            asteroid.style.left = `${x}px`;
            asteroid.style.top = `${y}px`;
            
            // Brighter, more visible asteroids
            const brightness = 150 + Math.floor(Math.random() * 105);
            asteroid.style.backgroundColor = `rgba(${brightness}, ${brightness}, ${brightness}, 0.9)`;
            asteroid.style.boxShadow = `0 0 2px rgba(255, 255, 255, 0.7)`;
            
            // Store orbital data for animation
            asteroid.dataset.angle = angle;
            asteroid.dataset.radius = radius;
            asteroid.dataset.orbitSpeed = 0.04 + Math.random() * 0.08; // Slower speed
            
            beltContainer.appendChild(asteroid);
        }
        
        solarSystem.appendChild(beltContainer);
        console.log("Asteroid belt created with", asteroidCount, "asteroids");
    }
    
    // Update positions for animation with improved smoothness using time delta
    function animateCelestialBodies(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = (timestamp - lastTime) / 16.67; // Normalize to ~60fps
        lastTime = timestamp;
        
        // Animate planets
        document.querySelectorAll('.celestial-body').forEach(element => {
            // Skip moons as they'll be positioned relative to their planets
            if (element.dataset.parentBody && element.dataset.bodyType === 'moon') return;
            if (element.getAttribute('data-name') === 'Sol') return; // Sun doesn't move
            
            let angle = parseFloat(element.dataset.angle || 0);
            const speed = parseFloat(element.dataset.orbitSpeed || 0);
            const radius = parseFloat(element.dataset.orbitRadius || 0);
            
            // Update angle - using deltaTime for smooth motion
            angle += (0.0002 * speed * deltaTime);
            if (angle > Math.PI * 2) angle -= Math.PI * 2;
            element.dataset.angle = angle;
            
            // Calculate new position
            const diameter = parseInt(element.style.width);
            const x = 2500 + Math.cos(angle) * radius - diameter/2;
            const y = 2500 + Math.sin(angle) * radius - diameter/2;
            
            // Update element position
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        });
        
        // Second pass - animate moons around their planets
        document.querySelectorAll('.celestial-body[data-body-type="moon"]').forEach(moon => {
            const parentName = moon.dataset.parentBody;
            if (!parentName) return;
            
            const parentElement = document.querySelector(`.${parentName.toLowerCase()}`);
            if (!parentElement) return;
            
            let angle = parseFloat(moon.dataset.angle || 0);
            const speed = parseFloat(moon.dataset.orbitSpeed || 0);
            const radius = parseFloat(moon.dataset.orbitRadius || 0);
            
            // Update angle - using deltaTime for smooth motion
            angle += (0.0005 * speed * deltaTime);
            if (angle > Math.PI * 2) angle -= Math.PI * 2;
            moon.dataset.angle = angle;
            
            // Calculate new position relative to parent planet
            const diameter = parseInt(moon.style.width);
            const parentDiameter = parseInt(parentElement.style.width);
            
            const x = parentDiameter/2 + Math.cos(angle) * radius - diameter/2;
            const y = parentDiameter/2 + Math.sin(angle) * radius - diameter/2;
            
            // Update element position
            moon.style.left = `${x}px`;
            moon.style.top = `${y}px`;
        });
        
        // Animate asteroids
        document.querySelectorAll('.asteroid').forEach(asteroid => {
            let angle = parseFloat(asteroid.dataset.angle || 0);
            const speed = parseFloat(asteroid.dataset.orbitSpeed || 0);
            const radius = parseFloat(asteroid.dataset.radius || 0);
            
            // Update angle
            angle += (0.0002 * speed * deltaTime);
            if (angle > Math.PI * 2) angle -= Math.PI * 2;
            asteroid.dataset.angle = angle;
            
            // Calculate new position
            const size = parseInt(asteroid.style.width);
            const x = 2500 + Math.cos(angle) * radius - size/2;
            const y = 2500 + Math.sin(angle) * radius - size/2;
            
            // Update element position
            asteroid.style.left = `${x}px`;
            asteroid.style.top = `${y}px`;
        });
        
        // Handle tooltip scaling based on zoom
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            tooltip.style.transform = `scale(${1/currentZoom})`;
        });
        
        requestAnimationFrame(animateCelestialBodies);
    }
    
    // Function to update zoom level display
    function updateZoomDisplay() {
        const zoomLevelDisplay = document.getElementById('zoom-level');
        if (zoomLevelDisplay) {
            zoomLevelDisplay.textContent = `${Math.round(currentZoom * 100)}%`;
        }
    }
    
    // Zoom control buttons
    document.getElementById('zoom-in').addEventListener('click', function() {
        currentZoom = Math.min(currentZoom * 1.2, maxZoom);
        updateTransform();
        updateZoomDisplay();
    });
    
    document.getElementById('zoom-out').addEventListener('click', function() {
        currentZoom = Math.max(currentZoom * 0.8, minZoom);
        updateTransform();
        updateZoomDisplay();
    });
    
    document.getElementById('reset').addEventListener('click', function() {
        currentZoom = 0.2;
        currentX = 0;
        currentY = 0;
        updateTransform();
        updateZoomDisplay();
    });
    
    // Mouse events for dragging
    solarSystem.addEventListener('mousedown', function(e) {
        isDragging = true;
        startDragX = e.clientX - currentX;
        startDragY = e.clientY - currentY;
        e.preventDefault(); // Prevent text selection during drag
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        currentX = e.clientX - startDragX;
        currentY = e.clientY - startDragY;
        
        // Limit panning
        const maxPan = 1500;
        currentX = Math.max(Math.min(currentX, maxPan), -maxPan);
        currentY = Math.max(Math.min(currentY, maxPan), -maxPan);
        
        updateTransform();
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // Mouse wheel for zooming
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (e.deltaY < 0) {
            // Zoom in
            currentZoom = Math.min(currentZoom * 1.1, maxZoom);
        } else {
            // Zoom out
            currentZoom = Math.max(currentZoom * 0.9, minZoom);
        }
        
        updateTransform();
        updateZoomDisplay();
    }, { passive: false });
    
    // Add touch controls for mobile devices
    let touchStartX, touchStartY, touchStartDist;
    
    solarSystem.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            // Single touch - drag
            isDragging = true;
            startDragX = e.touches[0].clientX - currentX;
            startDragY = e.touches[0].clientY - currentY;
        } else if (e.touches.length === 2) {
            // Two finger touch - pinch to zoom
            isDragging = false;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            touchStartDist = Math.sqrt(dx * dx + dy * dy);
        }
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1 && isDragging) {
            // Single touch - drag
            currentX = e.touches[0].clientX - startDragX;
            currentY = e.touches[0].clientY - startDragY;
            
            // Limit panning
            const maxPan = 1500;
            currentX = Math.max(Math.min(currentX, maxPan), -maxPan);
            currentY = Math.max(Math.min(currentY, maxPan), -maxPan);
            
            updateTransform();
        } else if (e.touches.length === 2) {
            // Two finger touch - pinch to zoom
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const newDist = Math.sqrt(dx * dx + dy * dy);
            
            if (touchStartDist) {
                const zoomFactor = newDist / touchStartDist;
                currentZoom = Math.min(Math.max(currentZoom * zoomFactor, minZoom), maxZoom);
                touchStartDist = newDist;
                updateTransform();
                updateZoomDisplay();
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
    
    // Initialize the solar system
    createCelestialBodies();
    requestAnimationFrame(animateCelestialBodies);
    
    // Update the info panel title
    const infoPanel = document.getElementById('info-panel');
    if (infoPanel && infoPanel.querySelector('h2')) {
        infoPanel.querySelector('h2').textContent = 'Sol';
    }
    
    // Update zoom level display
    updateZoomDisplay();
    
    // Hide loading screen once initialization is complete
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    console.log("Initialization complete");
});
