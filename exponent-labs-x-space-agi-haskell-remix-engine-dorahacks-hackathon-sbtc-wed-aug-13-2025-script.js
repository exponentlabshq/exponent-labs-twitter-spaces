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
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousTouchPosition.x;
        const deltaY = touch.clientY - previousTouchPosition.y;
        
        if (particles) {
            particles.rotation.x += deltaY * 0.01;
            particles.rotation.y += deltaX * 0.01;
        }
        
        previousTouchPosition = { x: touch.clientX, y: touch.clientY };
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Initialize GSAP animations
function initGSAPAnimations() {
    try {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, skipping animations');
            return;
        }
        
        // Animate title
        gsap.fromTo('#title', 
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        );
        
        // Animate search box
        gsap.fromTo('.search-box', 
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.3 }
        );
        
        // Animate navigation tabs
        gsap.fromTo('.nav-tab', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.5, stagger: 0.1 }
        );
        
        console.log('GSAP animations initialized successfully');
    } catch (error) {
        console.error('Error initializing GSAP animations:', error);
    }
}

// Load the JSON data
fetch('exponent-labs-x-space-agi-haskell-remix-engine-dorahacks-hackathon-sbtc-wed-aug-13-2025.json')
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
        renderLiveDevelopment();
        renderToolIntegration();
        renderHackathonJourney();
        renderMentorshipDynamics();
        renderCareerEvolution();
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
                        ${logicFramework.implementation_quote ? `<div class="quote"><strong>Implementation:</strong> ${logicFramework.implementation_quote}</div>` : ''}
                        ${logicFramework.mathematical_goal ? `<p><strong>Mathematical Goal:</strong> ${logicFramework.mathematical_goal}</p>` : ''}
                    </div>
                `;
            });
        } else {
            html += `
                <div class="framework-card">
                    <h4>${key.replace(/_/g, ' ').toUpperCase()}</h4>
                    <p><strong>Description:</strong> ${framework.description || 'No description available'}</p>
                    ${framework.quote ? `<div class="quote"><strong>Quote:</strong> ${framework.quote}</div>` : ''}
                    ${framework.practical_application ? `<p><strong>Practical Application:</strong> ${framework.practical_application}</p>` : ''}
                    ${framework.specific_example ? `<div class="example"><strong>Example:</strong> ${framework.specific_example}</div>` : ''}
                    ${framework.implementation_quote ? `<div class="quote"><strong>Implementation:</strong> ${framework.implementation_quote}</div>` : ''}
                    ${framework.mathematical_goal ? `<p><strong>Mathematical Goal:</strong> ${framework.mathematical_goal}</p>` : ''}
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
    
    Object.entries(thoughtFunctions).forEach(([key, functionData]) => {
        html += `
            <div class="thought-function-card">
                <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                ${functionData.structure ? `
                    <h4>Structure:</h4>
                    <ul class="structure-list">
                        ${functionData.structure.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                ` : ''}
                ${functionData.principle ? `<p><strong>Principle:</strong> ${functionData.principle}</p>` : ''}
                ${functionData.quote ? `<div class="quote"><strong>Quote:</strong> ${functionData.quote}</div>` : ''}
                ${functionData.practical_application ? `<p><strong>Practical Application:</strong> ${functionData.practical_application}</p>` : ''}
                ${functionData.specific_example ? `<div class="example"><strong>Example:</strong> ${functionData.specific_example}</div>` : ''}
                ${functionData.market_forces_quote ? `<div class="quote"><strong>Market Forces:</strong> ${functionData.market_forces_quote}</div>` : ''}
                ${functionData.examples ? `
                    <h4>Examples:</h4>
                    <ul class="structure-list">
                        ${functionData.examples.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                ` : ''}
                ${functionData.benefit ? `<p><strong>Benefit:</strong> ${functionData.benefit}</p>` : ''}
                ${functionData.implementation_quote ? `<div class="quote"><strong>Implementation:</strong> ${functionData.implementation_quote}</div>` : ''}
                ${functionData['12_disciples'] ? `<p><strong>12 Disciples:</strong> ${functionData['12_disciples']}</p>` : ''}
                ${functionData['13_to_50_expansion'] ? `<p><strong>13-50 Expansion:</strong> ${functionData['13_to_50_expansion']}</p>` : ''}
                ${functionData.exponential_organization ? `<p><strong>Exponential Organization:</strong> ${functionData.exponential_organization}</p>` : ''}
            </div>
        `;
    });
    
    content.innerHTML = html;
}

function renderImplementations() {
    const content = document.getElementById('implementations-content');
    const implementations = summaryData.practical_software_implementations;
    
    let html = '<div class="implementation-grid">';
    
    Object.entries(implementations).forEach(([key, implementation]) => {
        if (key === 'ai_agent_systems') {
            Object.entries(implementation).forEach(([agentKey, agentData]) => {
                html += `
                    <div class="implementation-card">
                        <h3>${agentKey.replace(/_/g, ' ').toUpperCase()}</h3>
                        ${agentData.purpose ? `<p><strong>Purpose:</strong> ${agentData.purpose}</p>` : ''}
                        ${agentData.quote ? `<div class="quote"><strong>Quote:</strong> ${agentData.quote}</div>` : ''}
                        ${agentData.implementation ? `<p><strong>Implementation:</strong> ${agentData.implementation}</p>` : ''}
                        ${agentData.example ? `<p><strong>Example:</strong> ${agentData.example}</p>` : ''}
                        ${agentData.personalization_quote ? `<div class="quote"><strong>Personalization:</strong> ${agentData.personalization_quote}</div>` : ''}
                        ${agentData.structure ? `<p><strong>Structure:</strong> ${agentData.structure}</p>` : ''}
                        ${agentData.benefit ? `<p><strong>Benefit:</strong> ${agentData.benefit}</p>` : ''}
                        ${agentData.implementation_quote ? `<div class="quote"><strong>Implementation:</strong> ${agentData.implementation_quote}</div>` : ''}
                    </div>
                `;
            });
        } else {
            html += `
                <div class="implementation-card">
                    <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                    ${implementation.approach ? `<p><strong>Approach:</strong> ${implementation.approach}</p>` : ''}
                    ${implementation.quote ? `<div class="quote"><strong>Quote:</strong> ${implementation.quote}</div>` : ''}
                    ${implementation.structure ? `
                        <h4>Structure:</h4>
                        <ul class="structure-list">
                            ${implementation.structure.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    ` : ''}
                    ${implementation.design_principles ? `<p><strong>Design Principles:</strong> ${implementation.design_principles}</p>` : ''}
                    ${implementation.implementation_quote ? `<div class="quote"><strong>Implementation:</strong> ${implementation.implementation_quote}</div>` : ''}
                    ${implementation.sprint_approach ? `<p><strong>Sprint Approach:</strong> ${implementation.sprint_approach}</p>` : ''}
                    ${implementation.mvp_philosophy ? `<p><strong>MVP Philosophy:</strong> ${implementation.mvp_philosophy}</p>` : ''}
                    ${implementation.quote_2 ? `<div class="quote"><strong>Additional Quote:</strong> ${implementation.quote_2}</div>` : ''}
                    ${implementation.tools ? `<p><strong>Tools:</strong> ${implementation.tools}</p>` : ''}
                    ${implementation.principle ? `<p><strong>Principle:</strong> ${implementation.principle}</p>` : ''}
                </div>
            `;
        }
    });
    
    html += '</div>';
    content.innerHTML = html;
}

function renderInsights() {
    const content = document.getElementById('insights-content');
    const insights = summaryData.key_insights_and_lessons;
    
    let html = '';
    
    Object.entries(insights).forEach(([key, insight]) => {
        html += `
            <div class="insight-card">
                <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                ${insight.time_constraints ? `<p><strong>Time Constraints:</strong> ${insight.time_constraints}</p>` : ''}
                ${insight.quote ? `<div class="quote"><strong>Quote:</strong> ${insight.quote}</div>` : ''}
                ${insight.parallel_projects ? `<p><strong>Parallel Projects:</strong> ${insight.parallel_projects}</p>` : ''}
                ${insight.quote_2 ? `<div class="quote"><strong>Additional Quote:</strong> ${insight.quote_2}</div>` : ''}
                ${insight.role_switching ? `<p><strong>Role Switching:</strong> ${insight.role_switching}</p>` : ''}
                ${insight.quote_3 ? `<div class="quote"><strong>Third Quote:</strong> ${insight.quote_3}</div>` : ''}
                ${insight.early_stage ? `<p><strong>Early Stage:</strong> ${insight.early_stage}</p>` : ''}
                ${insight.mid_stage ? `<p><strong>Mid Stage:</strong> ${insight.mid_stage}</p>` : ''}
                ${insight.mature_stage ? `<p><strong>Mature Stage:</strong> ${insight.mature_stage}</p>` : ''}
                ${insight.progressive_engagement ? `<p><strong>Progressive Engagement:</strong> ${insight.progressive_engagement}</p>` : ''}
                ${insight.email_capture ? `<p><strong>Email Capture:</strong> ${insight.email_capture}</p>` : ''}
                ${insight.landing_page_purpose ? `<p><strong>Landing Page Purpose:</strong> ${insight.landing_page_purpose}</p>` : ''}
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
            <div class="achievement-card">
                <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                ${achievement.project ? `<p><strong>Project:</strong> ${achievement.project}</p>` : ''}
                ${achievement.quote ? `<div class="quote"><strong>Quote:</strong> ${achievement.quote}</div>` : ''}
                ${achievement.learning_outcome ? `<p><strong>Learning Outcome:</strong> ${achievement.learning_outcome}</p>` : ''}
                ${achievement.time_to_deploy ? `<p><strong>Time to Deploy:</strong> ${achievement.time_to_deploy}</p>` : ''}
                ${achievement.constraint_quote ? `<div class="quote"><strong>Constraint:</strong> ${achievement.constraint_quote}</div>` : ''}
                ${achievement.system_prompt_engineering ? `<p><strong>System Prompt Engineering:</strong> ${achievement.system_prompt_engineering}</p>` : ''}
                ${achievement.voice_integration ? `<p><strong>Voice Integration:</strong> ${achievement.voice_integration}</p>` : ''}
                ${achievement.adaptive_responses ? `<p><strong>Adaptive Responses:</strong> ${achievement.adaptive_responses}</p>` : ''}
                ${achievement.implementation_quote ? `<div class="quote"><strong>Implementation:</strong> ${achievement.implementation_quote}</div>` : ''}
                ${achievement.dual_approach ? `<p><strong>Dual Approach:</strong> ${achievement.dual_approach}</p>` : ''}
                ${achievement.content_management ? `<p><strong>Content Management:</strong> ${achievement.content_management}</p>` : ''}
                ${achievement.deployment ? `<p><strong>Deployment:</strong> ${achievement.deployment}</p>` : ''}
            </div>
        `;
    });
    
    content.innerHTML = html;
}

function renderPrototypes() {
    const content = document.getElementById('prototypes-content');
    const prototypes = summaryData.hero_banner_and_prototypes;
    
    let html = `
        <div class="prototype-header">
            <h3>${prototypes.title}</h3>
            <p>${prototypes.description}</p>
        </div>
        <div class="prototype-grid">
    `;
    
    prototypes.prototypes.forEach(prototype => {
        html += `
            <div class="prototype-card">
                <h3>${prototype.name}</h3>
                <p><strong>Platform:</strong> ${prototype.platform}</p>
                <p><strong>Description:</strong> ${prototype.description}</p>
                ${prototype.url && prototype.url !== '[PLACEHOLDER_URL_1]' && prototype.url !== '[PLACEHOLDER_URL_2]' ? 
                    `<p><strong>URL:</strong> <a href="${prototype.url}" class="url" target="_blank">${prototype.url}</a></p>` : 
                    `<p><strong>URL:</strong> <span class="url">${prototype.url}</span></p>`
                }
                ${prototype.features ? `
                    <h4>Features:</h4>
                    <ul class="features-list">
                        ${prototype.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                ` : ''}
                ${prototype.creation_time ? `<p><strong>Creation Time:</strong> ${prototype.creation_time}</p>` : ''}
                ${prototype.quote ? `<div class="quote"><strong>Quote:</strong> ${prototype.quote}</div>` : ''}
                ${prototype.deployment_method ? `<p><strong>Deployment Method:</strong> ${prototype.deployment_method}</p>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    
    if (prototypes.methodology) {
        html += `
            <div class="methodology-section">
                <h3>Methodology</h3>
                ${prototypes.methodology.development_approach ? `<p><strong>Development Approach:</strong> ${prototypes.methodology.development_approach}</p>` : ''}
                ${prototypes.methodology.learning_focus ? `<p><strong>Learning Focus:</strong> ${prototypes.methodology.learning_focus}</p>` : ''}
                ${prototypes.methodology.quote ? `<div class="quote"><strong>Quote:</strong> ${prototypes.methodology.quote}</div>` : ''}
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
            <div class="insight-card">
                <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                ${direction.agent_communication ? `<p><strong>Agent Communication:</strong> ${direction.agent_communication}</p>` : ''}
                ${direction.quote ? `<div class="quote"><strong>Quote:</strong> ${direction.quote}</div>` : ''}
                ${direction.exponential_scaling ? `<p><strong>Exponential Scaling:</strong> ${direction.exponential_scaling}</p>` : ''}
                ${direction.quote_2 ? `<div class="quote"><strong>Additional Quote:</strong> ${direction.quote_2}</div>` : ''}
                ${direction.synthetic_conferences ? `<p><strong>Synthetic Conferences:</strong> ${direction.synthetic_conferences}</p>` : ''}
                ${direction.quote_3 ? `<div class="quote"><strong>Third Quote:</strong> ${direction.quote_3}</div>` : ''}
                ${direction.from_software_to_infrastructure ? `<p><strong>From Software to Infrastructure:</strong> ${direction.from_software_to_infrastructure}</p>` : ''}
                ${direction.railway_alternatives ? `<p><strong>Railway Alternatives:</strong> ${direction.railway_alternatives}</p>` : ''}
                ${direction.aws_optimization ? `<p><strong>AWS Optimization:</strong> ${direction.aws_optimization}</p>` : ''}
                ${direction.mathematical_formalization ? `<p><strong>Mathematical Formalization:</strong> ${direction.mathematical_formalization}</p>` : ''}
                ${direction.category_theory_implementation ? `<p><strong>Category Theory Implementation:</strong> ${direction.category_theory_implementation}</p>` : ''}
                ${direction.metaphor_framework_scaling ? `<p><strong>Metaphor Framework Scaling:</strong> ${direction.metaphor_framework_scaling}</p>` : ''}
            </div>
        `;
    });
    
    content.innerHTML = html;
}

function renderLiveDevelopment() {
    const content = document.getElementById('live-development-content');
    const liveDev = summaryData.live_development;
    
    let html = '<div class="live-development-timeline">';
    
    Object.entries(liveDev).forEach(([key, project]) => {
        html += `
            <div class="timeline-item">
                <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                <div class="timeline-details">
                    <div class="timeline-detail">
                        <strong>Timeline:</strong> ${project.development_timeline}
                    </div>
                    <div class="timeline-detail">
                        <strong>Technical Decisions:</strong> ${project.technical_decisions}
                    </div>
                    <div class="timeline-detail">
                        <strong>Live Results:</strong> ${project.live_results}
                    </div>
                    <div class="timeline-detail">
                        <strong>Constraints:</strong> ${project.constraints}
                    </div>
                    <div class="timeline-detail">
                        <strong>Learning Outcomes:</strong> ${project.learning_outcomes}
                    </div>
                </div>
                ${project.quote ? `<div class="quote"><strong>Quote:</strong> ${project.quote}</div>` : ''}
                ${project.implementation_details ? `<p><strong>Implementation Details:</strong> ${project.implementation_details}</p>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

function renderToolIntegration() {
    const content = document.getElementById('tool-integration-content');
    const tools = summaryData.tool_integration;
    
    let html = '<div class="tool-integration-grid">';
    
    Object.entries(tools).forEach(([key, tool]) => {
        html += `
            <div class="tool-card">
                <h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <div class="tool-purpose">
                    <strong>Purpose:</strong> ${tool.purpose}
                </div>
                <div class="tool-challenge">
                    <strong>Integration Challenge:</strong> ${tool.integration_challenge}
                </div>
                <div class="tool-solution">
                    <strong>Solution:</strong> ${tool.solution}
                </div>
                <div class="tool-impact">
                    <strong>Business Impact:</strong> ${tool.business_impact}
                </div>
                ${tool.quote ? `<div class="quote"><strong>Quote:</strong> ${tool.quote}</div>` : ''}
                ${tool.technical_implementation ? `<p><strong>Technical Implementation:</strong> ${tool.technical_implementation}</p>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

function renderHackathonJourney() {
    const content = document.getElementById('hackathon-journey-content');
    const hackathon = summaryData.hackathon_journey;
    
    let html = '<div class="hackathon-journey">';
    
    // DORA Hacks Project
    const doraHacks = hackathon.dora_hacks;
    html += `
        <div class="hackathon-phase">
            <h3><span class="phase-icon">🚀</span> DORA Hacks Project</h3>
            <div class="deadline-highlight">
                <strong>Deadline:</strong> ${doraHacks.deadline}
            </div>
            <div class="phase-details">
                <div class="phase-detail">
                    <strong>Project:</strong> ${doraHacks.project}
                </div>
                <div class="phase-detail">
                    <strong>Technical Stack:</strong> ${doraHacks.technical_stack}
                </div>
                <div class="phase-detail">
                    <strong>Business Model:</strong> ${doraHacks.business_model}
                </div>
                <div class="phase-detail">
                    <strong>Current Status:</strong> ${doraHacks.current_status}
                </div>
            </div>
            ${doraHacks.quote ? `<div class="quote"><strong>Quote:</strong> ${doraHacks.quote}</div>` : ''}
            <p><strong>Technical Challenges:</strong> ${doraHacks.technical_challenges}</p>
            <p><strong>Market Opportunity:</strong> ${doraHacks.market_opportunity}</p>
        </div>
    `;
    
    // Project Evolution
    const evolution = hackathon.project_evolution;
    html += `
        <div class="hackathon-phase">
            <h3><span class="phase-icon">📈</span> Project Evolution</h3>
            <div class="phase-details">
                <div class="phase-detail">
                    <strong>Initial Concept:</strong> ${evolution.initial_concept}
                </div>
                <div class="phase-detail">
                    <strong>Development Phases:</strong> ${evolution.development_phases}
                </div>
                <div class="phase-detail">
                    <strong>Integration Partners:</strong> ${evolution.integration_partners}
                </div>
                <div class="phase-detail">
                    <strong>Regulatory Requirements:</strong> ${evolution.regulatory_requirements}
                </div>
            </div>
            ${evolution.quote ? `<div class="quote"><strong>Quote:</strong> ${evolution.quote}</div>` : ''}
            <p><strong>Success Metrics:</strong> ${evolution.success_metrics}</p>
        </div>
    `;
    
    // Business Impact
    const impact = hackathon.business_impact;
    html += `
        <div class="hackathon-phase">
            <h3><span class="phase-icon">💼</span> Business Impact</h3>
            <div class="phase-details">
                <div class="phase-detail">
                    <strong>Target Market:</strong> ${impact.target_market}
                </div>
                <div class="phase-detail">
                    <strong>Value Proposition:</strong> ${impact.value_proposition}
                </div>
                <div class="phase-detail">
                    <strong>Competitive Advantage:</strong> ${impact.competitive_advantage}
                </div>
                <div class="phase-detail">
                    <strong>Scaling Potential:</strong> ${impact.scaling_potential}
                </div>
            </div>
            ${impact.quote ? `<div class="quote"><strong>Quote:</strong> ${impact.quote}</div>` : ''}
            <p><strong>Long-term Vision:</strong> ${impact.long_term_vision}</p>
        </div>
    `;
    
    html += '</div>';
    content.innerHTML = html;
}

function renderMentorshipDynamics() {
    const content = document.getElementById('mentorship-dynamics-content');
    const mentorship = summaryData.mentorship_dynamics;
    
    let html = '<div class="mentorship-dynamics">';
    
    // Mentorship Natural Development
    const naturalDevelopment = mentorship.mentorship_natural_development;
    html += `
        <div class="mentorship-stage">
            <h3>Mentorship Natural Development</h3>
            <div class="phase-details">
                <div class="phase-detail">
                    <strong>Early Experience:</strong> ${naturalDevelopment.early_experience}
                </div>
                <div class="phase-detail">
                    <strong>Skill Development:</strong> ${naturalDevelopment.skill_development}
                </div>
                <div class="phase-detail">
                    <strong>Practical Application:</strong> ${naturalDevelopment.practical_application}
                </div>
            </div>
            ${naturalDevelopment.quote ? `<div class="mentorship-quote"><strong>Quote:</strong> ${naturalDevelopment.quote}</div>` : ''}
        </div>
    `;
    
    // Team Building Approach
    const teamBuilding = mentorship.team_building_approach;
    html += `
        <div class="mentorship-stage">
            <h3>Team Building Approach</h3>
            <div class="phase-details">
                <div class="phase-detail">
                    <strong>Current Role:</strong> ${teamBuilding.current_role}
                </div>
                <div class="phase-detail">
                    <strong>Team Structure:</strong> ${teamBuilding.team_structure}
                </div>
                <div class="phase-detail">
                    <strong>Leadership Style:</strong> ${teamBuilding.leadership_style}
                </div>
            </div>
            ${teamBuilding.quote ? `<div class="mentorship-quote"><strong>Quote:</strong> ${teamBuilding.quote}</div>` : ''}
            ${teamBuilding.quote_2 ? `<div class="mentorship-quote"><strong>Quote 2:</strong> ${teamBuilding.quote_2}</div>` : ''}
        </div>
    `;
    
    // Career Transition Mentorship
    const careerTransition = mentorship.career_transition_mentorship;
    html += `
        <div class="mentorship-stage">
            <h3>Career Transition Mentorship</h3>
            <div class="phase-details">
                <div class="phase-detail">
                    <strong>Personal Journey:</strong> ${careerTransition.personal_journey}
                </div>
                <div class="phase-detail">
                    <strong>Mentorship Evolution:</strong> ${careerTransition.mentorship_evolution}
                </div>
                <div class="phase-detail">
                    <strong>Next Steps:</strong> ${careerTransition.next_steps}
                </div>
            </div>
            ${careerTransition.quote ? `<div class="mentorship-quote"><strong>Quote:</strong> ${careerTransition.quote}</div>` : ''}
            ${careerTransition.quote_2 ? `<div class="mentorship-quote"><strong>Quote 2:</strong> ${careerTransition.quote_2}</div>` : ''}
        </div>
    `;
    
    html += '</div>';
    content.innerHTML = html;
}

function renderCareerEvolution() {
    const content = document.getElementById('career-evolution-content');
    const career = summaryData.career_evolution;
    
    let html = '<div class="career-evolution">';
    
    // Technical Progression
    const technical = career.technical_progression;
    html += `
        <div class="career-stage">
            <h3><span class="career-icon">⚡</span> Technical Progression</h3>
            <div class="career-progression">
                <span>${technical.starting_point}</span>
                <span class="progression-arrow">→</span>
                <span>${technical.current_position}</span>
            </div>
            <div class="phase-details">
                <div class="phase-detail">
                    <strong>Skill Development:</strong> ${technical.skill_development}
                </div>
                <div class="phase-detail">
                    <strong>Learning Curve:</strong> ${technical.learning_curve}
                </div>
                <div class="phase-detail">
                    <strong>Next Steps:</strong> ${technical.next_steps}
                </div>
            </div>
            ${technical.quote ? `<div class="career-quote"><strong>Quote:</strong> ${technical.quote}</div>` : ''}
        </div>
    `;
    
    // Leadership Development
    const leadership = career.leadership_development;
    html += `
        <div class="career-stage">
            <h3><span class="career-icon">👥</span> Leadership Development</h3>
            <div class="phase-details">
                <div class="phase-detail">
                    <strong>Mentorship Natural:</strong> ${leadership.mentorship_natural}
                </div>
                <div class="phase-detail">
                    <strong>Team Management:</strong> ${leadership.team_management}
                </div>
                <div class="phase-detail">
                    <strong>Founder Mindset:</strong> ${leadership.founder_mindset}
                </div>
            </div>
            ${leadership.quote ? `<div class="career-quote"><strong>Quote:</strong> ${leadership.quote}</div>` : ''}
            <p><strong>Leadership Style:</strong> ${leadership.leadership_style}</p>
            <p><strong>Scaling Challenge:</strong> ${leadership.scaling_challenge}</p>
        </div>
    `;
    
    // Entrepreneurial Journey
    const entrepreneurial = career.entrepreneurial_journey;
    html += `
        <div class="career-stage">
            <h3><span class="career-icon">🚀</span> Entrepreneurial Journey</h3>
            <div class="phase-details">
                <div class="phase-detail">
                    <strong>Headhunting Experience:</strong> ${entrepreneurial.headhunting_experience}
                </div>
                <div class="phase-detail">
                    <strong>Project Development:</strong> ${entrepreneurial.project_development}
                </div>
                <div class="phase-detail">
                    <strong>Market Understanding:</strong> ${entrepreneurial.market_understanding}
                </div>
            </div>
            ${entrepreneurial.quote ? `<div class="career-quote"><strong>Quote:</strong> ${entrepreneurial.quote}</div>` : ''}
            <p><strong>Business Model:</strong> ${entrepreneurial.business_model}</p>
            <p><strong>Future Vision:</strong> ${entrepreneurial.future_vision}</p>
        </div>
    `;
    
    html += '</div>';
    content.innerHTML = html;
}

// Search functionality
function initializeSearch() {
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 2) {
                searchContent(searchTerm);
            } else {
                clearSearch();
            }
        });
    }
}

function searchContent(searchTerm) {
    const allContent = document.querySelectorAll('.tab-content');
    allContent.forEach(content => {
        const elements = content.querySelectorAll('p, h3, h4, .quote, .example');
        elements.forEach(element => {
            const text = element.textContent;
            if (text.toLowerCase().includes(searchTerm)) {
                highlightText(element, searchTerm);
            }
        });
    });
}

function highlightText(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
}

function clearSearch() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.innerHTML = parent.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/g, '$1');
    });
}

// Mobile navigation
function toggleMobileNav() {
    const dropdown = document.getElementById('mobileNavDropdown');
    dropdown.classList.toggle('active');
}

// Close mobile nav when clicking outside
document.addEventListener('click', function(e) {
    const mobileNav = document.querySelector('.mobile-nav');
    const dropdown = document.getElementById('mobileNavDropdown');
    
    if (!mobileNav.contains(e.target) && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
    }
});

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});
