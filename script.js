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
    
    // Celestial bodies data - we'll expand this with all solar system bodies
    const celestialBodies = [
        {
            name: "Sol",
            diameter: 200,  // Size in pixels
            position: { x: 2500, y: 2500 },  // Center of the solar system
            color: "#fd6801",
            description: "Our solar system's star, providing energy to all planets and supporting life on Earth.",
            orbitSpeed: 0,  // Sun doesn't orbit
        },
        {
            name: "Mercury",
            diameter: 20,
            orbitRadius: 300,
            orbitSpeed: 4.1,
            color: "#a6a6a6",
            description: "The smallest and innermost planet, known for extreme temperature variations and rich mineral deposits."
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
            name: "Mars",
            diameter: 30,
            orbitRadius: 600,
            orbitSpeed: 0.53,
            color: "#ff6600",
            description: "The solar system's breadbasket with terraformed agricultural domes producing food for trillions of humans."
        }
        // We'll add more planets and bodies later
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
            bodyContent.style.backgroundColor = body.color;
            
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
    }
    
    // Update positions for animation
    function animateCelestialBodies() {
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
    
    // Initialize the solar system
    createCelestialBodies();
    animateCelestialBodies();
});
