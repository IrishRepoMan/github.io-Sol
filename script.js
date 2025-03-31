document.addEventListener('DOMContentLoaded', function() {
    const solarSystem = document.getElementById('solar-system');
    const minZoom = 0.2;
    const maxZoom = 1.5;
    let currentZoom = 0.2;
    let isDragging = false;
    let startDragX, startDragY;
    let currentX = 0, currentY = 0;
    let lastTime = 0;
    let animationFrameId = null;
    const systemWidth = 5000;
    const systemHeight = 5000;
    const systemCenter = {
        x: systemWidth / 2,
        y: systemHeight / 2
    };

    const bodyVisibilityThresholds = {
        planet: 0.1,
        moon: 0.3,
        smallMoon: 0.5,
        asteroid: 0.6
    };

    const asteroidCount = 100;

    function updateTransform() {
        const maxPan = systemWidth / 2;
        currentX = Math.max(Math.min(currentX, maxPan), -maxPan);
        currentY = Math.max(Math.min(currentY, maxPan), -maxPan);
        
        solarSystem.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%)) scale(${currentZoom})`;
        
        document.getElementById('solar-system').style.visibility = 'visible';
        document.getElementById('solar-system').style.opacity = '1';
        document.getElementById('universe').style.backgroundColor = '#000';

        updateZoomDisplay();
        updateBodyVisibility();
    }

    function updateZoomDisplay() {
        const zoomLevelDisplay = document.getElementById('zoom-level');
        if (zoomLevelDisplay) {
            zoomLevelDisplay.textContent = `${Math.round(currentZoom * 100)}%`;
        }
    }

    const moonSets = {
        jupiter: [
            {
                orbitRadius: 35,
                speed: 1.8,
                moons: [
                    { name: "Io", diameter: 10, color: "#ffffaa" },
                    { name: "Europa", diameter: 10, color: "#ffffee" },
                    { name: "Ganymede", diameter: 15, color: "#cccccc" },
                    { name: "Callisto", diameter: 14, color: "#999999" }
                ]
            },
            {
                orbitRadius: 60,
                speed: 1.2,
                moons: [
                    { name: "Amalthea", diameter: 4, color: "#bb8866" },
                    { name: "Thebe", diameter: 3, color: "#aa7755" },
                    { name: "Metis", diameter: 3, color: "#997744" }
                ]
            },
            {
                orbitRadius: 85,
                speed: 0.8,
                moons: [
                    { name: "Himalia", diameter: 5, color: "#888888" },
                    { name: "Elara", diameter: 4, color: "#777777" },
                    { name: "Pasiphae", diameter: 4, color: "#666666" }
                ]
            }
        ],
        saturn: [
            {
                orbitRadius: 45,
                speed: 1.5,
                moons: [
                    { name: "Titan", diameter: 16, color: "#e6b800" },
                    { name: "Rhea", diameter: 9, color: "#dddddd" },
                    { name: "Iapetus", diameter: 8, color: "#cccccc" }
                ]
            },
            {
                orbitRadius: 70,
                speed: 1.1,
                moons: [
                    { name: "Enceladus", diameter: 7, color: "#ffffff" },
                    { name: "Mimas", diameter: 6, color: "#eeeeee" },
                    { name: "Tethys", diameter: 7, color: "#dddddd" }
                ]
            },
            {
                orbitRadius: 95,
                speed: 0.7,
                moons: [
                    { name: "Phoebe", diameter: 5, color: "#aaaaaa" },
                    { name: "Hyperion", diameter: 5, color: "#999999" },
                    { name: "Dione", diameter: 6, color: "#bbbbbb" }
                ]
            }
        ],
        uranus: [
            {
                orbitRadius: 35,
                speed: 1.4,
                moons: [
                    { name: "Titania", diameter: 8, color: "#cccccc" },
                    { name: "Oberon", diameter: 8, color: "#bbbbbb" },
                    { name: "Umbriel", diameter: 7, color: "#aaaaaa" }
                ]
            },
            {
                orbitRadius: 55,
                speed: 1.0,
                moons: [
                    { name: "Ariel", diameter: 7, color: "#dddddd" },
                    { name: "Miranda", diameter: 6, color: "#cccccc" }
                ]
            }
        ],
        neptune: [
            {
                orbitRadius: 40,
                speed: 1.3,
                moons: [
                    { name: "Triton", diameter: 12, color: "#ccccff" },
                    { name: "Nereid", diameter: 6, color: "#bbbbee" }
                ]
            },
            {
                orbitRadius: 60,
                speed: 0.9,
                moons: [
                    { name: "Naiad", diameter: 4, color: "#aaaadd" },
                    { name: "Thalassa", diameter: 4, color: "#9999cc" },
                    { name: "Despina", diameter: 5, color: "#8888bb" }
                ]
            }
        ]
    };

    function createCelestialBodies() {
        celestialBodies.forEach(body => {
            if (body.parentBody) return;
            
            if (body.name === "Sol") {
                const sunElement = document.querySelector('.sun');
                setupBodyElement(sunElement, body);
                return;
            }
            
            const element = createBodyElement(body);
            const orbit = createOrbitElement(body);
            
            solarSystem.appendChild(element);
            solarSystem.appendChild(orbit);

            if (moonSets[body.name.toLowerCase()]) {
                createMoonSets(body, moonSets[body.name.toLowerCase()]);
            }
        });
        
        createAsteroidBelt();
    }

    function createMoonSets(parentBody, moonOrbits) {
        const parentElement = document.querySelector(`.${parentBody.name.toLowerCase()}`);
        const parentDiameter = parseFloat(parentElement.style.width);

        moonOrbits.forEach((orbitSet, orbitIndex) => {
            const orbit = document.createElement('div');
            orbit.className = 'moon-orbit';
            orbit.style.width = `${orbitSet.orbitRadius * 2}px`;
            orbit.style.height = `${orbitSet.orbitRadius * 2}px`;
            orbit.style.left = `${(parentDiameter - orbitSet.orbitRadius * 2) / 2}px`;
            orbit.style.top = `${(parentDiameter - orbitSet.orbitRadius * 2) / 2}px`;
            parentElement.appendChild(orbit);

            orbitSet.moons.forEach((moon, moonIndex) => {
                const angle = (Math.PI * 2 * moonIndex) / orbitSet.moons.length;
                const element = createMoonElement(moon, parentBody, orbitSet, angle);
                parentElement.appendChild(element);
            });
        });
    }

    function createBodyElement(body) {
        const element = document.createElement('div');
        element.className = `celestial-body ${body.name.toLowerCase()}`;
        setupBodyElement(element, body);
        return element;
    }

    function setupBodyElement(element, body) {
        element.setAttribute('data-name', body.name);
        element.setAttribute('data-body-type', body.type);
        element.style.width = `${body.diameter}px`;
        element.style.height = `${body.diameter}px`;
        
        if (body.name !== "Sol") {
            const angle = Math.random() * Math.PI * 2;
            const x = systemCenter.x + Math.cos(angle) * body.orbitRadius;
            const y = systemCenter.y + Math.sin(angle) * body.orbitRadius;
            
            element.style.left = `${x - body.diameter/2}px`;
            element.style.top = `${y - body.diameter/2}px`;
            element.dataset.angle = angle;
            element.dataset.orbitSpeed = body.orbitSpeed;
            element.dataset.orbitRadius = body.orbitRadius;
        } else {
            element.style.left = `${systemCenter.x - body.diameter/2}px`;
            element.style.top = `${systemCenter.y - body.diameter/2}px`;
        }

        const bodyContent = document.createElement('div');
        bodyContent.className = 'body-content';
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = `<h3>${body.name}</h3><p>${body.description || ''}</p>`;
        
        element.appendChild(bodyContent);
        element.appendChild(tooltip);
        
        element.addEventListener('click', function(e) {
            e.stopPropagation();
            window.location.href = `detail.html?body=${body.name.toLowerCase()}`;
        });

        element.addEventListener('mouseenter', function(e) {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                document.querySelectorAll('.tooltip').forEach(t => t.style.display = 'none');
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

        return element;
    }

    function createMoonElement(moon, parentBody, orbitSet, initialAngle) {
        const element = document.createElement('div');
        element.className = `celestial-body moon ${moon.name.toLowerCase()}`;
        element.setAttribute('data-name', moon.name);
        element.setAttribute('data-body-type', 'moon');
        element.style.width = `${moon.diameter}px`;
        element.style.height = `${moon.diameter}px`;
        
        const bodyContent = document.createElement('div');
        bodyContent.className = 'body-content';
        bodyContent.style.backgroundColor = moon.color;
        
        element.appendChild(bodyContent);
        
        if (moon.diameter >= 8) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = `<h3>${moon.name}</h3>`;
            element.appendChild(tooltip);
            
            element.addEventListener('mouseenter', function(e) {
                const tooltip = this.querySelector('.tooltip');
                if (tooltip) {
                    document.querySelectorAll('.tooltip').forEach(t => t.style.display = 'none');
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
        }

        element.dataset.angle = initialAngle;
        element.dataset.orbitSpeed = orbitSet.speed;
        element.dataset.orbitRadius = orbitSet.orbitRadius;
        element.dataset.parentBody = parentBody.name;

        return element;
    }

    function createOrbitElement(body) {
        const orbit = document.createElement('div');
        orbit.className = 'orbit';
        orbit.style.width = `${body.orbitRadius * 2}px`;
        orbit.style.height = `${body.orbitRadius * 2}px`;
        orbit.style.left = `${systemCenter.x - body.orbitRadius}px`;
        orbit.style.top = `${systemCenter.y - body.orbitRadius}px`;
        
        if (body.inclination) {
            orbit.style.transform = `rotateX(${body.inclination * 180}deg)`;
        }
        
        return orbit;
    }

    function createAsteroidBelt() {
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
            
            asteroid.dataset.angle = angle;
            asteroid.dataset.radius = radius;
            asteroid.dataset.orbitSpeed = 0.04 + Math.random() * 0.08;
            
            fragment.appendChild(asteroid);
        }
        
        beltContainer.appendChild(fragment);
        solarSystem.appendChild(beltContainer);
    }

    function updateBodyVisibility() {
        document.querySelectorAll('.celestial-body').forEach(body => {
            const bodyType = body.getAttribute('data-body-type');
            const bodyName = body.getAttribute('data-name');
            const tooltip = body.querySelector('.tooltip');
            const bodyContent = body.querySelector('.body-content');
            
            if (bodyName === "Sol") {
                body.style.display = 'block';
            } else if (bodyType === 'moon') {
                body.style.display = currentZoom >= bodyVisibilityThresholds.moon ? 'block' : 'none';
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

        document.querySelectorAll('.asteroid').forEach(asteroid => {
            asteroid.style.display = currentZoom >= bodyVisibilityThresholds.asteroid ? 'block' : 'none';
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
    }

    function animateCelestialBodies(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = (timestamp - lastTime) / 16.67;
        lastTime = timestamp;

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
            document.querySelectorAll('.celestial-body.moon').forEach(moon => {
                let angle = parseFloat(moon.dataset.angle || 0);
                const speed = parseFloat(moon.dataset.orbitSpeed || 0);
                const radius = parseFloat(moon.dataset.orbitRadius || 0);
                
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

    window.addEventListener('beforeunload', function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
});
