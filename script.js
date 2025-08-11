let summaryData = null;
let scene, camera, renderer, particles;

// Initialize Three.js
function initThreeJS() {
    try {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded, skipping 3D initialization');
            return;
        }
        
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('threejs-canvas'),
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Create particle system - responsive to device
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 50 : 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * (isMobile ? 8 : 10);
            positions[i + 1] = (Math.random() - 0.5) * (isMobile ? 8 : 10);
            positions[i + 2] = (Math.random() - 0.5) * (isMobile ? 8 : 10);
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x3498db,
            size: isMobile ? 0.03 : 0.05,
            transparent: true,
            opacity: isMobile ? 0.4 : 0.6
        });
        
        particles = new THREE.Points(geometry, material);
        scene.add(particles);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            if (particles) {
                particles.rotation.x += 0.001;
                particles.rotation.y += 0.002;
            }
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Add touch/mouse interaction for mobile
        if (isMobile) {
            addTouchInteraction();
        }
        
        console.log('Three.js initialized successfully');
    } catch (error) {
        console.error('Error initializing Three.js:', error);
    }
}

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Add touch interaction for mobile devices
function addTouchInteraction() {
    let isDragging = false;
    let previousTouchPosition = { x: 0, y: 0 };
    
    // Touch events
    document.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousTouchPosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging || !particles) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousTouchPosition.x;
        const deltaY = touch.clientY - previousTouchPosition.y;
        
        particles.rotation.x += deltaY * 0.01;
        particles.rotation.y += deltaX * 0.01;
        
        previousTouchPosition = { x: touch.clientX, y: touch.clientY };
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Mouse events for desktop testing
    document.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousTouchPosition = { x: e.clientX, y: e.clientY };
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !particles) return;
        
        const deltaX = e.clientX - previousTouchPosition.x;
        const deltaY = e.clientY - previousTouchPosition.y;
        
        particles.rotation.x += deltaY * 0.01;
        particles.rotation.y += deltaX * 0.01;
        
        previousTouchPosition = { x: e.clientX, y: e.clientY };
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Initialize GSAP animations
function initGSAPAnimations() {
    try {
        // Check if GSAP is loaded
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, skipping animations');
            return;
        }
        
        // Fade in the title
        gsap.from('#title', {
            duration: 1.5,
            y: -50,
            opacity: 0,
            ease: 'power2.out'
        });
        
        // Stagger in the nav tabs
        gsap.from('.nav-tab', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.5
        });
        
        // Fade in the search box
        gsap.from('.search-box', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: 'power2.out',
            delay: 0.8
        });
        
        // Fade in the first tab content
        gsap.from('#frameworks-content', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power2.out',
            delay: 1
        });
        
        console.log('GSAP animations initialized successfully');
    } catch (error) {
        console.error('Error initializing GSAP animations:', error);
    }
}

// Load the JSON data
        fetch('executive_summary.json')
            .then(response => response.json())
            .then(data => {
                summaryData = data;
                document.getElementById('title').textContent = data.metadata.title;
                console.log('Loaded data structure:', data);
                debugDataStructure(data); // Check for undefined values
                renderAllTabs();
                
                // Initialize Three.js and GSAP animations
                initThreeJS();
                initGSAPAnimations();
            })
    .catch(error => {
        console.error('Error loading data:', error);
        document.getElementById('title').textContent = 'Error Loading Data';
    });

// Debug function to check for undefined values
function debugDataStructure(data, path = '') {
    Object.entries(data).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (value === undefined) {
            console.warn(`UNDEFINED VALUE FOUND at: ${currentPath}`);
        } else if (typeof value === 'object' && value !== null) {
            debugDataStructure(value, currentPath);
        }
    });
}

function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // GSAP animation for tab content
    const activeContent = document.getElementById(tabName);
    if (activeContent && typeof gsap !== 'undefined') {
        try {
            gsap.fromTo(activeContent, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
        } catch (error) {
            console.error('Error animating tab content:', error);
        }
    }
}

function renderAllTabs() {
    if (!summaryData) {
        console.error('No data available for rendering');
        return;
    }
    try {
        renderFrameworks();
        renderThoughtFunctions();
        renderImplementations();
        renderInsights();
        renderAchievements();
        renderPrototypes();
        renderFuture();
    } catch (error) {
        console.error('Error rendering tabs:', error);
        document.getElementById('frameworks-content').innerHTML = '<p>Error rendering content. Check console for details.</p>';
    }
}

function renderFrameworks() {
    const content = document.getElementById('frameworks-content');
    const frameworks = summaryData.core_theoretical_frameworks;
    
    let html = '<div class="framework-grid">';
    
    Object.entries(frameworks).forEach(([key, framework]) => {
        if (key === 'logic_systems') {
            // Handle nested logic systems structure
            Object.entries(framework).forEach(([logicKey, logicFramework]) => {
                html += `
                    <div class="framework-card">
                        <h4>${logicKey.replace(/_/g, ' ').toUpperCase()}</h4>
                        <p><strong>Description:</strong> ${logicFramework.description || 'No description available'}</p>
                        ${logicFramework.quote ? `<div class="quote"><strong>Quote:</strong> ${logicFramework.quote}</div>` : ''}
                        ${logicFramework.practical_application ? `<p><strong>Practical Application:</strong> ${logicFramework.practical_application}</p>` : ''}
                        ${logicFramework.specific_example ? `<div class="example"><strong>Example:</strong> ${logicFramework.specific_example}</div>` : ''}
                        ${logicFramework.implementation_quote ? `<div class="implementation"><strong>Implementation:</strong> ${logicFramework.implementation_quote}</div>` : ''}
                    </div>
                `;
            });
        } else {
            // Handle other frameworks normally
            html += `
                <div class="framework-card">
                    <h4>${key.replace(/_/g, ' ').toUpperCase()}</h4>
                    <p><strong>Description:</strong> ${framework.description || 'No description available'}</p>
                    ${framework.quote ? `<div class="quote"><strong>Quote:</strong> ${framework.quote}</div>` : ''}
                    ${framework.practical_application ? `<p><strong>Practical Application:</strong> ${framework.practical_application}</p>` : ''}
                    ${framework.specific_example ? `<div class="example"><strong>Example:</strong> ${framework.specific_example}</div>` : ''}
                    ${framework.implementation_quote ? `<div class="implementation"><strong>Implementation:</strong> ${framework.implementation_quote}</div>` : ''}
                    ${framework.mathematical_goal ? `<div class="implementation"><strong>Mathematical Goal:</strong> ${framework.mathematical_goal}</div>` : ''}
                </div>
            `;
        }
    });
    
    html += '</div>';
    content.innerHTML = html;
}

function renderThoughtFunctions() {
    const content = document.getElementById('thought-functions-content');
    const thoughtFunctions = summaryData.thought_functions_and_prompts;
    
    let html = '';
    
    Object.entries(thoughtFunctions).forEach(([key, func]) => {
        html += `
            <div class="section">
                <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                ${func.principle ? `<p><strong>Principle:</strong> ${func.principle}</p>` : ''}
                ${func.quote ? `<div class="quote"><strong>Quote:</strong> ${func.quote}</div>` : ''}
                ${func.practical_application ? `<p><strong>Practical Application:</strong> ${func.practical_application}</p>` : ''}
                ${func.examples ? `
                    <div class="example">
                        <strong>Examples:</strong>
                        <ul>${func.examples.map(ex => `<li>${ex || 'No example available'}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                ${func.implementation_quote ? `<div class="implementation"><strong>Implementation:</strong> ${func.implementation_quote}</div>` : ''}
                ${func.benefit ? `<p><strong>Benefit:</strong> ${func.benefit}</p>` : ''}
                ${func.structure ? `
                    <div class="example">
                        <strong>Structure:</strong>
                        <ol>${func.structure.map(item => `<li>${item || 'No item available'}</li>`).join('')}</ol>
                    </div>
                ` : ''}
                ${func.market_forces_quote ? `<div class="quote"><strong>Market Forces:</strong> ${func.market_forces_quote}</div>` : ''}
            </div>
        `;
    });
    
    content.innerHTML = html;
}

function renderImplementations() {
    const content = document.getElementById('implementations-content');
    const implementations = summaryData.practical_software_implementations;
    
    let html = '';
    
    Object.entries(implementations).forEach(([key, impl]) => {
        html += `
            <div class="section">
                <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                ${impl.purpose ? `<p><strong>Purpose:</strong> ${impl.purpose}</p>` : ''}
                ${impl.approach ? `<p><strong>Approach:</strong> ${impl.approach}</p>` : ''}
                ${impl.quote ? `<div class="quote"><strong>Quote:</strong> ${impl.quote}</div>` : ''}
                ${impl.implementation ? `<p><strong>Implementation:</strong> ${impl.implementation}</p>` : ''}
                ${impl.example ? `<div class="example"><strong>Example:</strong> ${impl.example}</div>` : ''}
                ${impl.implementation_quote ? `<div class="implementation"><strong>Implementation Quote:</strong> ${impl.implementation_quote}</div>` : ''}
                ${impl.structure ? `
                    <div class="example">
                        <strong>Structure:</strong>
                        <ul>${impl.structure.map(item => `<li>${item || 'No item available'}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                ${impl.design_principles ? `<p><strong>Design Principles:</strong> ${impl.design_principles}</p>` : ''}
                ${impl.tools ? `<p><strong>Tools:</strong> ${impl.tools}</p>` : ''}
                ${impl.principle ? `<p><strong>Principle:</strong> ${impl.principle}</p>` : ''}
            </div>
        `;
    });
    
    content.innerHTML = html;
}

function renderInsights() {
    const content = document.getElementById('insights-content');
    const insights = summaryData.key_insights_and_lessons;
    
    let html = '';
    
    Object.entries(insights).forEach(([key, insight]) => {
        html += `
            <div class="section">
                <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                ${Object.entries(insight).map(([subKey, subInsight]) => {
                    if (typeof subInsight === 'string' && !subInsight.includes('quote')) {
                        return `<p><strong>${subKey.replace(/_/g, ' ').toUpperCase()}:</strong> ${subInsight}</p>`;
                    } else if (subInsight.quote) {
                        return `<div class="quote"><strong>${subKey.replace(/_/g, ' ').toUpperCase()}:</strong> ${subInsight.quote}</div>`;
                    }
                    return '';
                }).join('')}
            </div>
        `;
    });
    
    content.innerHTML = html;
}

function renderAchievements() {
    const content = document.getElementById('achievements-content');
    const achievements = summaryData.technical_achievements;
    
    let html = '';
    
    Object.entries(achievements).forEach(([key, achievement]) => {
        html += `
            <div class="section">
                <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                ${achievement.project ? `<p><strong>Project:</strong> ${achievement.project}</p>` : ''}
                ${achievement.quote ? `<div class="quote"><strong>Quote:</strong> ${achievement.quote}</div>` : ''}
                ${achievement.learning_outcome ? `<p><strong>Learning Outcome:</strong> ${achievement.learning_outcome}</p>` : ''}
                ${achievement.time_to_deploy ? `<p><strong>Time to Deploy:</strong> ${achievement.time_to_deploy}</p>` : ''}
                ${achievement.implementation_quote ? `<div class="implementation"><strong>Implementation:</strong> ${achievement.implementation_quote}</div>` : ''}
            </div>
        `;
    });
    
    content.innerHTML = html;
}

function renderPrototypes() {
    const content = document.getElementById('prototypes-content');
    const heroData = summaryData.hero_banner_and_prototypes;
    
    if (!heroData) {
        content.innerHTML = '<p>No prototype data available.</p>';
        return;
    }
    
    let html = `
        <div class="section">
            <h3>${heroData.title}</h3>
            <p><strong>Description:</strong> ${heroData.description}</p>
        </div>
    `;
    
    // Render prototypes
    if (heroData.prototypes) {
        html += '<h3>Live Prototypes</h3>';
        heroData.prototypes.forEach((prototype, index) => {
            html += `
                <div class="section">
                    <h4>${prototype.name}</h4>
                    <p><strong>Platform:</strong> ${prototype.platform}</p>
                    <p><strong>Description:</strong> ${prototype.description}</p>
                    <p><strong>URL:</strong> <a href="${prototype.url}" target="_blank" style="color: #3498db; text-decoration: none;">${prototype.url}</a></p>
                    ${prototype.features ? `
                        <div class="example">
                            <strong>Features:</strong>
                            <ul>${prototype.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    ${prototype.creation_time ? `<p><strong>Creation Time:</strong> ${prototype.creation_time}</p>` : ''}
                    ${prototype.deployment_method ? `<p><strong>Deployment Method:</strong> ${prototype.deployment_method}</p>` : ''}
                    ${prototype.quote ? `<div class="quote"><strong>Quote:</strong> ${prototype.quote}</div>` : ''}
                </div>
            `;
        });
    }
    
    // Render methodology
    if (heroData.methodology) {
        html += `
            <div class="section">
                <h3>Methodology</h3>
                <p><strong>Dual Approach:</strong> ${heroData.methodology.dual_approach}</p>
                <p><strong>Rapid Iteration:</strong> ${heroData.methodology.rapid_iteration}</p>
                <p><strong>Deployment Strategy:</strong> ${heroData.methodology.deployment_strategy}</p>
                ${heroData.methodology.quote ? `<div class="quote"><strong>Quote:</strong> ${heroData.methodology.quote}</div>` : ''}
            </div>
        `;
    }
    
    // Render technical achievements
    if (heroData.technical_achievements) {
        html += `
            <div class="section">
                <h3>Technical Achievements</h3>
                <p><strong>Time to Prototype:</strong> ${heroData.technical_achievements.time_to_prototype}</p>
                <p><strong>Platforms Used:</strong> ${heroData.technical_achievements.platforms_used.join(', ')}</p>
                <p><strong>Technologies:</strong> ${heroData.technical_achievements.technologies.join(', ')}</p>
                <p><strong>Deployment Speed:</strong> ${heroData.technical_achievements.deployment_speed}</p>
            </div>
        `;
    }
    
    content.innerHTML = html;
}

function renderFuture() {
    const content = document.getElementById('future-content');
    const future = summaryData.future_directions;
    
    let html = '';
    
    Object.entries(future).forEach(([key, direction]) => {
        html += `
            <div class="section">
                <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                ${Object.entries(direction).map(([subKey, subDirection]) => {
                    if (typeof subDirection === 'string' && !subDirection.includes('quote')) {
                        return `<p><strong>${subKey.replace(/_/g, ' ').toUpperCase()}:</strong> ${subDirection}</p>`;
                    } else if (subDirection.quote) {
                        return `<div class="quote"><strong>${subKey.replace(/_/g, ' ').toUpperCase()}:</strong> ${subDirection.quote}</div>`;
                    }
                    return '';
                }).join('')}
            </div>
        `;
    });
    
    content.innerHTML = html;
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length < 2) {
                removeHighlights();
                return;
            }
            
            searchAndHighlight(searchTerm);
        });
    }
});

function searchAndHighlight(searchTerm) {
    removeHighlights();
    
    const textNodes = document.evaluate(
        "//text()[normalize-space(.)!='']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    
    for (let i = 0; i < textNodes.snapshotLength; i++) {
        const node = textNodes.snapshotItem(i);
        const text = node.textContent;
        if (text.toLowerCase().includes(searchTerm)) {
            const span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = text;
            node.parentNode.replaceChild(span, node);
        }
    }
}

function removeHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}
