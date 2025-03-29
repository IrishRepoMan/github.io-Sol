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
});
