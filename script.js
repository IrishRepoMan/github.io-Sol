document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const solarSystem = document.getElementById('solar-system');
    const minZoom = 0.2;
    const maxZoom = 1.5;
    let currentZoom = 0.8;
    let isDragging = false;
    let startDragX, startDragY;
    let currentX = 0, currentY = 0;
    
    // Apply initial zoom
    updateTransform();
    
    const celestialBodies = [
        {
            name: "Sol",
            diameter: 200,
            position: { x: 2500, y: 2500 },
            color: "#fd6801",
            description: "Our solar system's star, providing energy to all planets and supporting life on Earth.",
            orbitSpeed: 0,
        },
        {
            name: "Mercury",
            diameter: 20,
            orbitRadius: 300,
            orbitSpeed: 4.1,
            color: "#a6a6a6",
            description: "The smallest and innermost planet, known for extreme environment technologies and specialized mining operations."
        },
        {
            name: "Venus",
            diameter: 38,
            orbitRadius: 400,
            orbitSpeed: 1.6,
            color: "#e6e600",
            description: "Earth's toxic twin with a runaway greenhouse effect, now a major mining operation under Terra's authority."
        },
        {
            name: "Earth",
            diameter: 40,
            orbitRadius: 500,
            orbitSpeed: 1,
            color: "#3399ff",
            description: "Humanity's birthplace, now partially rewilded and serving as a biological repository with most population in orbital habitats."
        },
        {
            name: "Luna",
            diameter: 12,
            orbitRadius: 530,
            orbitSpeed: 1,
            parentOrbit: "Earth",
            color: "#cccccc",
            description: "Earth's moon, home to early human colonization efforts and historical sites of significance."
        },
        {
            name: "Mars",
            diameter: 30,
            orbitRadius: 600,
            orbitSpeed: 0.53,
            color: "#ff6600",
            description: "The solar system's breadbasket with terraformed agricultural domes producing food for trillions of humans."
        },
        {
            name: "Jupiter",
            diameter: 120,
            orbitRadius: 1000,
            orbitSpeed: 0.084,
            color: "#ffcc99",
            description: "A gas giant and economic superpower controlling energy resources and advanced technologies."
        },
        {
            name: "Io",
            diameter: 10,
            orbitRadius: 1070,
            orbitSpeed: 0.084,
            parentOrbit: "Jupiter",
            color: "#ffff00",
            description: "Jupiter's volcanically active moon with specialized mining operations."
        },
        {
            name: "Europa",
            diameter: 10,
            orbitRadius: 1090,
            orbitSpeed: 0.084,
            parentOrbit: "Jupiter",
            color: "#ffffff",
            description: "Jupiter's ice-covered moon with subsurface ocean, hosting scientific outposts."
        },
        {
            name: "Ganymede",
            diameter: 15,
            orbitRadius: 1120,
            orbitSpeed: 0.084,
            parentOrbit: "Jupiter",
            color: "#cccccc",
            description: "Jupiter's largest moon and an important administrative center for Jovian operations."
        },
        {
            name: "Callisto",
            diameter: 14,
            orbitRadius: 1150,
            orbitSpeed: 0.084,
            parentOrbit: "Jupiter",
            color: "#999999",
            description: "Jupiter's outermost large moon with significant habitat development."
        },
        {
            name: "Saturn",
            diameter: 100,
            orbitRadius: 1400,
            orbitSpeed: 0.034,
            color: "#ffe6b3",
            description: "Ringed gas giant under the control of the Outer System Empire, with strategic resource operations."
        },
        {
            name: "Titan",
            diameter: 16,
            orbitRadius: 1460,
            orbitSpeed: 0.034,
            parentOrbit: "Saturn",
            color: "#e6b800",
            description: "Saturn's largest moon and the administrative center of the Outer System Empire."
        },
        {
            name: "Uranus",
            diameter: 70,
            orbitRadius: 1800,
            orbitSpeed: 0.012,
            color: "#77ccff",
            description: "Ice giant under Outer System Empire control with specialized gas extraction operations."
        },
        {
            name: "Neptune",
            diameter: 68,
            orbitRadius: 2100,
            orbitSpeed: 0.006,
            color: "#3366ff",
            description: "The outermost gas giant controlled by the Outer System Empire, with deuterium and tritium extraction facilities."
        },
        {
            name: "Triton",
            diameter: 12,
            orbitRadius: 2140,
            orbitSpeed: 0.006,
            parentOrbit: "Neptune",
            color: "#ccccff",
            description: "Neptune's largest moon with significant imperial presence and specialized manufacturing."
        },
        {
            name: "Pluto",
            diameter: 16,
            orbitRadius: 2300,
            orbitSpeed: 0.004,
            color: "#ccb399",
            description: "Dwarf planet serving as humanity's forward scientific observatory, accessible to all factions for research."
        }
    ];
    
    // Create celestial bodies
    function createCelestialBodies() {
        celestialBodies.forEach(body => {
            if (body.name === "Sol") {
                // The sun is already in our HTML, just need to adjust its size
                const sunElement = document.querySelector('.sun');
                sunElement.style.width = `${body.diameter}px`;
                sunElement.style.height = `${body.diameter}px`;
                sunElement.style.left = `${body.position.x - body.diameter/2}px`;
                sunElement.style.top = `${body.position.y - body.diameter/2}px`;
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
            element.style.width = `${body.diameter}px`;
            element.style.height = `${body.diameter}px`;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            
            // Create body content (the visible planet)
            const bodyContent = document.createElement('div');
            bodyContent.className = 'body-content';
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = `<h3>${body.name}</h3><p>${body.description}</p>`;
            
            // Add orbit path (will be visible as a faint line)
            const orbit = document.createElement('div');
            orbit.className = 'orbit';
            orbit.style.width = `${body.orbitRadius * 2}px`;
            orbit.style.height = `${body.orbitRadius * 2}px`;
            orbit.style.left = `${2500 - body.orbitRadius}px`;
            orbit.style.top = `${2500 - body.orbitRadius}px`;
            
            // Add to DOM
            element.appendChild(bodyContent);
            element.appendChild(tooltip);
            solarSystem.appendChild(element);
            solarSystem.appendChild(orbit);
            
            // Add click event
            element.addEventListener('click', function() {
                window.location.href = `detail.html?body=${body.name.toLowerCase()}`;
            });
            
            // Store additional data for animation
            element.dataset.angle = angle;
            element.dataset.orbitSpeed = body.orbitSpeed;
            element.dataset.orbitRadius = body.orbitRadius;
        });

        // Create asteroid belt
        createAsteroidBelt();
    }

    // Create asteroid belt
    function createAsteroidBelt() {
        const beltContainer = document.createElement('div');
        beltContainer.className = 'asteroid-belt';
        
        // Create individual asteroids
        const asteroidCount = 500;
        const minRadius = 700;
        const maxRadius = 850;
        
        for (let i = 0; i < asteroidCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = minRadius + Math.random() * (maxRadius - minRadius);
            const size = 2 + Math.random() * 4;
            
            const x = 2500 + Math.cos(angle) * radius - size/2;
            const y = 2500 + Math.sin(angle) * radius - size/2;
            
            const asteroid = document.createElement('div');
            asteroid.className = 'asteroid';
            asteroid.style.width = `${size}px`;
            asteroid.style.height = `${size}px`;
            asteroid.style.left = `${x}px`;
            asteroid.style.top = `${y}px`;
            asteroid.style.backgroundColor = `rgba(${100 + Math.random() * 100}, ${100 + Math.random() * 100}, ${100 + Math.random() * 100}, 0.8)`;
            
            // Store orbital data for animation
            asteroid.dataset.angle = angle;
            asteroid.dataset.radius = radius;
            asteroid.dataset.orbitSpeed = 0.1 + Math.random() * 0.2;
            
            beltContainer.appendChild(asteroid);
        }
        
        solarSystem.appendChild(beltContainer);
    }
    
    // Update positions for animation
    function animateCelestialBodies() {
        // Animate celestial bodies
        document.querySelectorAll('.celestial-body').forEach(element => {
            if (element.getAttribute('data-name') === 'Sol') return; // Sun doesn't move
            
            let angle = parseFloat(element.dataset.angle);
            const speed = parseFloat(element.dataset.orbitSpeed);
            const radius = parseFloat(element.dataset.orbitRadius);
            
            // Update angle
            angle += (0.001 * speed);
            element.dataset.angle = angle;
            
            // Calculate new position
            const diameter = parseInt(element.style.width);
            const x = 2500 + Math.cos(angle) * radius - diameter/2;
            const y = 2500 + Math.sin(angle) * radius - diameter/2;
            
            // Update element position
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        });
        
        // Animate asteroids
        document.querySelectorAll('.asteroid').forEach(asteroid => {
            let angle = parseFloat(asteroid.dataset.angle);
            const speed = parseFloat(asteroid.dataset.orbitSpeed);
            const radius = parseFloat(asteroid.dataset.radius);
            
            // Update angle
            angle += (0.001 * speed);
            asteroid.dataset.angle = angle;
            
            // Calculate new position
            const size = parseInt(asteroid.style.width);
            const x = 2500 + Math.cos(angle) * radius - size/2;
            const y = 2500 + Math.sin(angle) * radius - size/2;
            
            // Update element position
            asteroid.style.left = `${x}px`;
            asteroid.style.top = `${y}px`;
        });
        
        requestAnimationFrame(animateCelestialBodies);
    }
    
    // Pan and zoom functionality
    function updateTransform() {
        solarSystem.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentZoom})`;
    }
    
    // Zoom control buttons
    document.getElementById('zoom-in').addEventListener('click', function() {
        currentZoom = Math.min(currentZoom * 1.2, maxZoom);
        updateTransform();
    });
    
    document.getElementById('zoom-out').addEventListener('click', function() {
        currentZoom = Math.max(currentZoom * 0.8, minZoom);
        updateTransform();
    });
    
    document.getElementById('reset').addEventListener('click', function() {
        currentZoom = 0.8;
        currentX = 0;
        currentY = 0;
        updateTransform();
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
        const maxPan = 1000 * currentZoom;
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
    }, { passive: false });
    
    // Initialize the solar system
    createCelestialBodies();
    animateCelestialBodies();
});
