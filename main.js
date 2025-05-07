// Main JavaScript functionality for the website

// Global window object for animation exports
window.threeAnimation = window.threeAnimation || {};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Generate placeholders for any missing images
    generatePlaceholders();
    
    // Initialize smooth page transitions
    initPageTransitions();
    
    // Initialize general interactive elements
    initInteractiveElements();
    
    // Initialize custom multiselect for services
    initServicesMultiselect();
    
    console.log('Stellar3D website initialized successfully.');
});

// Theme toggling
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.querySelector('i').className = 'fas fa-moon';
    } else if (!savedTheme && !prefersDarkScheme.matches) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.querySelector('i').className = 'fas fa-moon';
    } else {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        if (themeToggle) themeToggle.querySelector('i').className = 'fas fa-sun';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('dark-mode')) {
                // Switch to light mode
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                themeToggle.querySelector('i').className = 'fas fa-moon';
            } else {
                // Switch to dark mode
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                themeToggle.querySelector('i').className = 'fas fa-sun';
            }
            
            // Trigger 3D effect on theme change
            if (window.threeAnimation && window.threeAnimation.pulseEffect) {
                window.threeAnimation.pulseEffect();
            }
        });
    }
}

// Mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const socialIcons = document.querySelector('.social-icons');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            socialIcons.classList.toggle('active');
            this.classList.toggle('active');
            
            const isOpen = navLinks.classList.contains('active');
            mobileMenuBtn.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            
            // Prevent body scrolling when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
            
            // Trigger 3D effect on menu toggle
            if (window.threeAnimation && window.threeAnimation.pulseEffect) {
                window.threeAnimation.pulseEffect();
            }
        });
        
        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                socialIcons.classList.remove('active');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                document.body.style.overflow = '';
            });
        });
    }
}

// Generate placeholders for missing images
function generatePlaceholders() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Don't generate placeholder if image already has a src starting with "data:"
            if (this.src.startsWith('data:')) return;
            
            const width = this.width || 300;
            const height = this.height || 200;
            
            // Determine type of image from alt text or src
            const alt = this.alt ? this.alt.toLowerCase() : '';
            const src = this.src ? this.src.toLowerCase() : '';
            let type = 'placeholder';
            
            if (alt.includes('hero') || src.includes('hero')) {
                type = 'hero';
            } else if (alt.includes('featured') || src.includes('featured')) {
                type = 'featured';
            } else if (alt.includes('team') || src.includes('team') || alt.includes('client') || src.includes('client')) {
                type = 'profile';
            } else if (alt.includes('service') || src.includes('service')) {
                type = 'service';
            } else if (alt.includes('project') || src.includes('project') || alt.includes('portfolio') || src.includes('portfolio')) {
                type = 'project';
            }
            
            // Generate placeholder
            const placeholderDataUrl = generatePlaceholderCanvas(width, height, type, alt);
            this.src = placeholderDataUrl;
        });
    });
}

// Create placeholder image on canvas
function generatePlaceholderCanvas(width, height, type, text) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background based on type
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    
    switch(type) {
        case 'hero':
            gradient.addColorStop(0, '#0ea5e9');
            gradient.addColorStop(1, '#14b8a6');
            break;
        case 'featured':
            gradient.addColorStop(0, '#14b8a6');
            gradient.addColorStop(1, '#0ea5e9');
            break;
        case 'profile':
            gradient.addColorStop(0, '#0284c7');
            gradient.addColorStop(1, '#0369a1');
            break;
        case 'service':
            gradient.addColorStop(0, '#0d9488');
            gradient.addColorStop(1, '#0f766e');
            break;
        case 'project':
            gradient.addColorStop(0, '#0369a1');
            gradient.addColorStop(1, '#0c4a6e');
            break;
        default:
            gradient.addColorStop(0, '#0ea5e9');
            gradient.addColorStop(1, '#0c4a6e');
    }
    
    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add pattern
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    const patternSize = Math.min(width, height) / 10;
    
    for (let i = 0; i < width; i += patternSize) {
        for (let j = 0; j < height; j += patternSize) {
            if ((i + j) % (patternSize * 2) === 0) {
                ctx.fillRect(i, j, patternSize, patternSize);
            }
        }
    }
    
    // Add text
    const displayText = text || type.toUpperCase();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `bold ${Math.min(width, height) / 10}px Space Grotesk, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, width / 2, height / 2);
    
    // Add 3D cube icon
    const cubeSize = Math.min(width, height) / 8;
    const cubeX = width / 2;
    const cubeY = height / 2 + Math.min(width, height) / 6;
    
    // Draw cube
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cubeX - cubeSize/2, cubeY - cubeSize/3);
    ctx.lineTo(cubeX + cubeSize/2, cubeY - cubeSize/3);
    ctx.lineTo(cubeX + cubeSize/2, cubeY + cubeSize/3);
    ctx.lineTo(cubeX - cubeSize/2, cubeY + cubeSize/3);
    ctx.lineTo(cubeX - cubeSize/2, cubeY - cubeSize/3);
    ctx.stroke();
    
    // Draw cube perspective lines
    ctx.beginPath();
    ctx.moveTo(cubeX - cubeSize/2, cubeY - cubeSize/3);
    ctx.lineTo(cubeX - cubeSize/4, cubeY - cubeSize/2);
    ctx.lineTo(cubeX + cubeSize/4 + cubeSize/2, cubeY - cubeSize/2);
    ctx.lineTo(cubeX + cubeSize/2, cubeY - cubeSize/3);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(cubeX + cubeSize/4 + cubeSize/2, cubeY - cubeSize/2);
    ctx.lineTo(cubeX + cubeSize/4 + cubeSize/2, cubeY + cubeSize/3 - cubeSize/6);
    ctx.lineTo(cubeX + cubeSize/2, cubeY + cubeSize/3);
    ctx.stroke();
    
    // Add watermark
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `${Math.min(width, height) / 20}px Inter, sans-serif`;
    ctx.fillText('Stellar3D', width / 2, height - Math.min(width, height) / 15);
    
    return canvas.toDataURL('image/png');
}

// Page transitions
function initPageTransitions() {
    // Add classes for page transitions
    document.body.classList.add('page-transition-ready');
    
    // Add click handler to all internal links
    document.querySelectorAll('a[href^="index"], a[href^="about"], a[href^="services"], a[href^="contact"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const isExternal = href.startsWith('http') || href.startsWith('www');
            
            if (!isExternal) {
                e.preventDefault();
                const targetPage = href;
                
                // Animate page out
                document.body.classList.add('page-transition-out');
                
                // Wait for animation, then navigate
                setTimeout(() => {
                    window.location.href = targetPage;
                }, 500);
            }
        });
    });
    
    // Animate page in when loaded
    window.addEventListener('pageshow', function() {
        document.body.classList.remove('page-transition-out');
        document.body.classList.add('page-transition-in');
        
        setTimeout(() => {
            document.body.classList.remove('page-transition-in');
        }, 500);
    });
}

// Initialize interactive elements
function initInteractiveElements() {
    // Animate elements on scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('animate-lift3d') || 
                    entry.target.classList.contains('animate-pulse3d') ||
                    entry.target.classList.contains('animate-float3d')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, { threshold: 0.15 });
    
    // Observe elements with animation classes
    document.querySelectorAll('.animate-lift3d, .animate-pulse3d, .animate-float3d, .animate-fade-in').forEach(el => {
        animateOnScroll.observe(el);
    });
    
    // Add interaction effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (window.threeAnimation && window.threeAnimation.pulseEffect) {
                window.threeAnimation.pulseEffect(0.5);
            }
        });
    });
}

// Function to change page-specific animations
function changePage(pageName) {
    console.log(`Changing to ${pageName} page animations`);
    
    // Clear any existing page-specific classes
    document.body.classList.remove('home-page', 'about-page', 'services-page', 'contact-page');
    
    // Add the new page class
    document.body.classList.add(`${pageName}-page`);
    
    // Trigger initial animation
    if (window.threeAnimation && window.threeAnimation.pulseEffect) {
        window.threeAnimation.pulseEffect(1.0);
    }
    
    return true;
}

// Animation effects that can be called from other files
function pulseEffect() {
    if (typeof scene !== 'undefined' && scene.children.length > 0) {
        // Find objects to pulse
        scene.children.forEach(child => {
            if (child.type === 'Mesh' || child.type === 'Points') {
                // Apply pulse animation
                const originalScale = child.scale.x;
                
                // Animate with GSAP if available
                if (typeof gsap !== 'undefined') {
                    gsap.to(child.scale, {
                        x: originalScale * 1.2,
                        y: originalScale * 1.2,
                        z: originalScale * 1.2,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.out"
                    });
                }
            }
        });
    }
}

function createFloatingText(text, position, color, size) {
    if (typeof THREE === 'undefined' || typeof scene === 'undefined') return;
    
    // Use a simple cube with text texture instead of TextGeometry
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;
    
    // Background with transparency
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text
    ctx.font = 'Bold 80px Space Grotesk, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, canvas.width/2, canvas.height/2);
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create floating plane with text
    const geometry = new THREE.PlaneGeometry(size || 2, size || 2);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        color: color || 0x00a8cc,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    const textMesh = new THREE.Mesh(geometry, material);
    textMesh.position.set(
        position.x || 0,
        position.y || 0,
        position.z || 0
    );
    
    scene.add(textMesh);
    
    // Animate floating
    const animate = () => {
        if (textMesh) {
            textMesh.rotation.y += 0.01;
            textMesh.position.y += Math.sin(Date.now() * 0.001) * 0.01;
        }
        requestAnimationFrame(animate);
    };
    
    animate();
    
    return textMesh;
}

function create3DObject(type, position, color, size) {
    if (typeof THREE === 'undefined' || typeof scene === 'undefined') return;
    
    let geometry;
    
    // Create geometry based on type
    switch(type) {
        case 'sphere':
            geometry = new THREE.SphereGeometry(size || 1, 32, 32);
            break;
        case 'cube':
            geometry = new THREE.BoxGeometry(size || 1, size || 1, size || 1);
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry((size || 1) * 0.7, (size || 1) * 0.3, 16, 100);
            break;
        case 'icosahedron':
            geometry = new THREE.IcosahedronGeometry(size || 1, 0);
            break;
        default:
            geometry = new THREE.BoxGeometry(size || 1, size || 1, size || 1);
    }
    
    const material = new THREE.MeshStandardMaterial({ 
        color: color || 0x00a8cc,
        metalness: 0.3,
        roughness: 0.4,
        transparent: true,
        opacity: 0.8
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
        position.x || 0,
        position.y || 0,
        position.z || 0
    );
    
    scene.add(mesh);
    
    // Animate floating
    const animate = () => {
        if (mesh) {
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.01;
            mesh.position.y += Math.sin(Date.now() * 0.001) * 0.01;
        }
        requestAnimationFrame(animate);
    };
    
    animate();
    
    return mesh;
}

// --- SMOOTH SCROLL FOR NAV LINKS ---
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: 'smooth'
        });
      }
    }
  });
});

// --- NAVBAR ANIMATION ON SCROLL ---
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = window.scrollY;
});

// --- SECTION FADE-IN ON SCROLL ---
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.15 });
sections.forEach(section => sectionObserver.observe(section));

// --- 3D ANIMATED HERO BACKGROUND (PARTICLES) ---
(function() {
  const canvas = document.getElementById('hero-3d-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0;
  let particles = [];
  const PARTICLE_COUNT = 80;
  let mouse = { x: 0.5, y: 0.5 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.querySelector('.hero-section').offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1 + 0.5,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        baseSize: 2 + Math.random() * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      // Parallax effect
      const px = (mouse.x - 0.5) * 60 * p.z;
      const py = (mouse.y - 0.5) * 60 * p.z;
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x + px, p.y + py, p.baseSize * p.z, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(37,99,235,${0.18 + 0.5 * p.z})`;
      ctx.shadowColor = '#2563eb';
      ctx.shadowBlur = 12 * p.z;
      ctx.fill();
      ctx.restore();
      // Move
      p.x += p.vx * p.z;
      p.y += p.vy * p.z;
      // Bounce
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
    requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createParticles();
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = 0.5;
    mouse.y = 0.5;
  });
  init();
})();

// --- CARD TILT ON HOVER ---
function addCardTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(600px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
addCardTilt('.service-card');
addCardTilt('.portfolio-item');

// --- SCROLLSPY FOR NAV LINKS ---
const sectionIds = Array.from(document.querySelectorAll('section')).map(s => s.id);
window.addEventListener('scroll', () => {
  let current = '';
  const scrollY = window.scrollY + 80;
  for (const id of sectionIds) {
    const section = document.getElementById(id);
    if (section && section.offsetTop <= scrollY) {
      current = id;
    }
  }
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// --- CUSTOM MULTI-SELECT DROPDOWN LOGIC FOR SERVICES ---
document.addEventListener('DOMContentLoaded', function() {
  const multiselect = document.getElementById('services-multiselect');
  if (!multiselect) return;
  const selectedText = document.getElementById('selected-services-text');
  const dropdown = document.getElementById('services-list');
  const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');

  function updateSelectedText() {
    const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    selectedText.textContent = selected.length ? selected.join(', ') : 'Select Services';
  }

  multiselect.addEventListener('click', function(e) {
    e.stopPropagation();
    multiselect.classList.toggle('active');
  });

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateSelectedText);
  });

  document.addEventListener('click', function(e) {
    if (!multiselect.contains(e.target)) {
      multiselect.classList.remove('active');
    }
  });

  // Initial update
  updateSelectedText();
}); 