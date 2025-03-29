document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.getElementById('solar-map');
    const bodyName = document.getElementById('body-name');
    const bodyDescription = document.getElementById('body-description');
    
    // Add orbital paths
    for (const [id, body] of Object.entries(celestialBodies)) {
        if (body.orbit) {
            const orbit = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
            orbit.setAttribute("cx", "500");
            orbit.setAttribute("cy", "300");
            orbit.setAttribute("rx", body.orbit.rx);
            orbit.setAttribute("ry", body.orbit.ry);
            orbit.setAttribute("fill", "none");
            orbit.setAttribute("stroke", "rgba(255, 255, 255, 0.2)");
            orbit.setAttribute("stroke-width", "1");
            svgMap.appendChild(orbit);
        }
    }
    
    // Add celestial bodies
    for (const [id, body] of Object.entries(celestialBodies)) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        element.setAttribute("cx", body.position.x);
        element.setAttribute("cy", body.position.y);
        element.setAttribute("r", body.position.radius);
        element.setAttribute("fill", body.color);
        element.setAttribute("id", id);
        element.setAttribute("class", "celestial-body");
        
        // Add hover event
        element.addEventListener('mouseenter', function() {
            bodyName.textContent = body.name;
            bodyDescription.textContent = body.shortDescription;
            this.setAttribute("r", body.position.radius * 1.2);
        });
        
        element.addEventListener('mouseleave', function() {
            this.setAttribute("r", body.position.radius);
        });
        
        // Add click event to navigate to detail page
        element.addEventListener('click', function() {
            window.location.href = body.detailPage;
        });
        
        svgMap.appendChild(element);
        
        // Add text label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", body.position.x);
        label.setAttribute("y", body.position.y + body.position.radius + 15);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("class", "body-label");
        label.textContent = body.name;
        svgMap.appendChild(label);
    }
    
    // Add background stars
    function addBackgroundStars() {
        for (let i = 0; i < 200; i++) {
            const star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const x = Math.random() * 1000;
            const y = Math.random() * 600;
            const size = Math.random() * 1.5;
            const opacity = Math.random() * 0.8 + 0.2;
            
            star.setAttribute("cx", x);
            star.setAttribute("cy", y);
            star.setAttribute("r", size);
            star.setAttribute("fill", "white");
            star.setAttribute("opacity", opacity);
            
            svgMap.insertBefore(star, svgMap.firstChild);
        }
    }
    
    addBackgroundStars();
    
    // Add asteroid belt
    function addAsteroidBelt() {
        const belt = document.createElementNS("http://www.w3.org/2000/svg", "g");
        belt.setAttribute("id", "asteroid-belt");
        
        const centerX = 500;
        const centerY = 300;
        const innerRadius = 330;
        const outerRadius = 380;
        
        for (let i = 0; i < 400; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = innerRadius + Math.random() * (outerRadius - innerRadius);
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const size = Math.random() * 2 + 0.5;
            
            const asteroid = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            asteroid.setAttribute("cx", x);
            asteroid.setAttribute("cy", y);
            asteroid.setAttribute("r", size);
            asteroid.setAttribute("fill", "#aaa");
            asteroid.setAttribute("opacity", Math.random() * 0.8 + 0.2);
            
            belt.appendChild(asteroid);
        }
        
        svgMap.insertBefore(belt, svgMap.firstChild.nextSibling); // Insert after stars
    }
    
    addAsteroidBelt();
    
    // Zoom and pan functionality
let currentScale = 1;
let isPanning = false;
let startPoint = { x: 0, y: 0 };
let viewBox = { x: 0, y: 0, width: 1000, height: 600 };

// Define limits
const ZOOM_MIN = 0.5;  // Maximum zoom out (see more of the map)
const ZOOM_MAX = 5;    // Maximum zoom in
const PAN_LIMIT = 500; // Maximum distance to pan from center

function updateViewBox() {
    // Enforce zoom limits
    const currentZoom = 1000 / viewBox.width;
    
    if (currentZoom < ZOOM_MIN) {
        // Limit zoom out
        viewBox.width = 1000 / ZOOM_MIN;
        viewBox.height = 600 / ZOOM_MIN;
    } else if (currentZoom > ZOOM_MAX) {
        // Limit zoom in
        viewBox.width = 1000 / ZOOM_MAX;
        viewBox.height = 600 / ZOOM_MAX;
    }
    
    // Enforce pan limits
    viewBox.x = Math.max(Math.min(viewBox.x, PAN_LIMIT), -PAN_LIMIT);
    viewBox.y = Math.max(Math.min(viewBox.y, PAN_LIMIT), -PAN_LIMIT);
    
    svgMap.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
}

// Zoom functionality
svgMap.addEventListener('wheel', function(e) {
    e.preventDefault();
    
    const mouseX = e.clientX - svgMap.getBoundingClientRect().left;
    const mouseY = e.clientY - svgMap.getBoundingClientRect().top;
    
    const svgPoint = svgMap.createSVGPoint();
    svgPoint.x = mouseX;
    svgPoint.y = mouseY;
    
    const CTM = svgMap.getScreenCTM();
    const svgCoords = svgPoint.matrixTransform(CTM.inverse());
    
    const zoomFactor = e.deltaY < 0 ? 0.8 : 1.25;
    const newWidth = viewBox.width * zoomFactor;
    const newHeight = viewBox.height * zoomFactor;
    
    viewBox.x = svgCoords.x - (svgCoords.x - viewBox.x) * zoomFactor;
    viewBox.y = svgCoords.y - (svgCoords.y - viewBox.y) * zoomFactor;
    viewBox.width = newWidth;
    viewBox.height = newHeight;
    
    updateViewBox();
});

    // Pan functionality
    svgMap.addEventListener('mousedown', function(e) {
        if (e.button === 0) { // Left mouse button
            isPanning = true;
            startPoint = { x: e.clientX, y: e.clientY };
            svgMap.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (!isPanning) return;
        
        const dx = (e.clientX - startPoint.x) * viewBox.width / svgMap.clientWidth;
        const dy = (e.clientY - startPoint.y) * viewBox.height / svgMap.clientHeight;
        
        viewBox.x -= dx;
        viewBox.y -= dy;
        
        updateViewBox();
        
        startPoint = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mouseup', function() {
        isPanning = false;
        svgMap.style.cursor = 'default';
    });

    // Add reset view button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset View';
    resetButton.style.position = 'absolute';
    resetButton.style.top = '10px';
    resetButton.style.right = '10px';
    resetButton.style.zIndex = '100';
    resetButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    resetButton.style.color = 'white';
    resetButton.style.border = 'none';
    resetButton.style.padding = '5px 10px';
    resetButton.style.borderRadius = '5px';
    resetButton.style.cursor = 'pointer';

    resetButton.addEventListener('click', function() {
        viewBox = { x: 0, y: 0, width: 1000, height: 600 };
        updateViewBox();
    });

    document.querySelector('#map-container').appendChild(resetButton);
});
