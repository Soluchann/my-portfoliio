// Enhanced Resume Website JavaScript with Advanced Responsive Features
document.addEventListener('DOMContentLoaded', function() {
  console.log('Enhanced Resume Website - Starting initialization');
  
  // Performance optimization - use passive event listeners where possible
  const passiveSupported = (() => {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {
      passiveSupported = false;
    }
    return passiveSupported;
  })();

  // DOM Elements with enhanced selectors
  const body = document.body;
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav__link');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const themeToggle = document.querySelector('.theme-toggle');
  const backToTopBtn = document.querySelector('.back-to-top');
  const sections = document.querySelectorAll('section');

  // Enhanced theme management with system preference detection (removed localStorage)
  function initializeTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-color-scheme', initialTheme);
    updateThemeIcon(initialTheme);
    console.log('Initial theme set to:', initialTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-color-scheme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (themeToggle) {
      const moonIcon = themeToggle.querySelector('.fa-moon');
      const sunIcon = themeToggle.querySelector('.fa-sun');
      
      if (theme === 'dark') {
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'block';
      } else {
        if (moonIcon) moonIcon.style.display = 'block';
        if (sunIcon) sunIcon.style.display = 'none';
      }
    }
  }

  // Enhanced Theme Toggle with animation
  if (themeToggle) {
    console.log('Theme toggle found, setting up event listener');
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Theme toggle clicked');
      
      const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      console.log('Changing theme from', currentTheme, 'to', newTheme);
      
      // Add smooth transition
      document.documentElement.style.transition = 'color 0.3s ease, background-color 0.3s ease';
      
      document.documentElement.setAttribute('data-color-scheme', newTheme);
      updateThemeIcon(newTheme);
      
      // Remove transition after animation
      setTimeout(() => {
        document.documentElement.style.transition = '';
      }, 300);
      
      console.log('Theme changed to:', newTheme);
    });
  } else {
    console.log('Theme toggle not found');
  }

  // Enhanced Mobile Menu with improved accessibility
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      const isActive = nav.classList.contains('active');
      
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Update ARIA attributes for accessibility
      menuToggle.setAttribute('aria-expanded', !isActive);
      nav.setAttribute('aria-hidden', isActive);
      
      // Prevent body scroll when menu is open
      if (!isActive) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
      }
    });
  }

  // Enhanced navigation with smooth scrolling and active link management
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      // Close mobile menu
      if (nav) nav.classList.remove('active');
      if (menuToggle) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      if (nav) nav.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
    });
  });

  // Enhanced smooth scrolling with offset calculation
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement && header) {
        const headerHeight = header.getBoundingClientRect().height;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Enhanced scroll functionality with throttling
  let scrollTimeout;
  let lastScrollTop = 0;

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Back to top button visibility - fixed to only show after scrolling
    if (backToTopBtn) {
      if (scrollTop > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
    
    // Update scroll progress
    updateScrollProgress();
    
    // Update active navigation link
    updateActiveNavLink();
    
    // Update header style with scroll direction detection
    updateHeaderStyle(scrollTop);
    
    lastScrollTop = scrollTop;
  }

  // Throttled scroll event listener
  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        handleScroll();
        scrollTimeout = null;
      }, 16); // ~60fps
    }
  }, passiveSupported ? { passive: true } : false);

  // Enhanced scroll progress indicator
  function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    let progressBar = document.getElementById('scrollProgress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scrollProgress';
      progressBar.className = 'scroll-progress';
      progressBar.style.width = '0%';
      document.body.appendChild(progressBar);
    }
    progressBar.style.width = scrolled + '%';
  }

  // Enhanced back to top functionality
  if (backToTopBtn) {
    // Ensure it's hidden initially
    backToTopBtn.classList.remove('visible');
    
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Add keyboard support
    backToTopBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  // Enhanced header style updates with scroll direction
  function updateHeaderStyle(scrollTop) {
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Add scroll direction classes for advanced styling
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.classList.add('scroll-down');
        header.classList.remove('scroll-up');
      } else if (scrollTop < lastScrollTop) {
        header.classList.add('scroll-up');
        header.classList.remove('scroll-down');
      }
    }
  }

  // Enhanced active navigation link detection
  function updateActiveNavLink() {
    if (!header || sections.length === 0) return;
    
    const scrollPosition = window.scrollY + header.offsetHeight + 50;
    let currentSection = '';
    
    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = sectionId;
      }
    });

    // Update navigation links
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  // Enhanced download functionality with multiple triggers
  function setupDownloadButton(button) {
    if (button) {
      console.log('Setting up download button:', button);
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Download button clicked');
        
        // Enhanced user feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
        button.disabled = true;
        
        setTimeout(() => {button.innerHTML = originalText;
        button.disabled = false;

        // Trigger actual file download
        const link = document.createElement('a');
        link.href = 'resources/Adarsh Resume.pdf'; // <-- Change this to your actual resume file path
        link.download = 'Adarsh Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Your download has started.', 'success');
        }, 1500);
      });
    }
  }

  // Setup all download buttons
  const downloadBtns = document.querySelectorAll('#downloadResume, #downloadResumeBottom, .download-resume .btn');
  downloadBtns.forEach(setupDownloadButton);

  // Enhanced notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: var(--space-16);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-base);
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      max-width: 300px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: var(--space-8);">
        <i class="fas fa-${icon}" style="color: var(--color-${type === 'error' ? 'error' : type === 'success' ? 'success' : 'primary'}); margin-top: 2px;"></i>
        <div style="flex: 1;">${message}</div>
        <button onclick="this.parentNode.parentNode.remove()" style="background: none; border: none; cursor: pointer; padding: 0; margin-left: var(--space-8);">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Slide in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }

  // Enhanced animations with Intersection Observer
  function setupAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      animatedElements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      animatedElements.forEach(function(el) {
        el.classList.add('visible');
      });
    }
  }

  // Enhanced keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        body.style.overflow = '';
      }
    }

    // Navigate sections with arrow keys when no input is focused
    if (!document.activeElement.matches('input, textarea, select') && e.ctrlKey) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateToNextSection(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateToNextSection(-1);
      }
    }
  });

  // Enhanced section navigation
  function navigateToNextSection(direction) {
    const currentSection = getCurrentSection();
    const sectionElements = Array.from(sections).filter(s => s && s.id);
    // Use actual on-screen order (CSS reorder affects offsetTop)
    sectionElements.sort((a, b) => a.offsetTop - b.offsetTop);
    const sectionIds = sectionElements.map(s => s.id);
    const currentIndex = sectionIds.indexOf(currentSection);
    
    if (currentIndex !== -1) {
      const nextIndex = currentIndex + direction;
      if (nextIndex >= 0 && nextIndex < sectionIds.length) {
        const targetSection = document.getElementById(sectionIds[nextIndex]);
        if (targetSection && header) {
          const headerHeight = header.getBoundingClientRect().height;
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  }

  function getCurrentSection() {
    if (!header || sections.length === 0) return '';
    
    const scrollPosition = window.scrollY + header.offsetHeight + 50;
    let currentSection = '';
    
    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = sectionId;
      }
    });
    
    return currentSection;
  }

  // Enhanced resize handler for responsive updates
  let resizeTimeout;
  window.addEventListener('resize', function() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(function() {
      // Recalculate layouts if needed
      updateActiveNavLink();
      
      // Close mobile menu on resize to larger screen
      if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        body.style.overflow = '';
      }
    }, 250);
  });

  // Enhanced accessibility features
  function setupAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
      position: absolute;
      left: -9999px;
      z-index: 10001;
      padding: var(--space-8) var(--space-16);
      background: var(--color-primary);
      color: var(--color-btn-primary-text);
      text-decoration: none;
      border-radius: var(--radius-base);
    `;
    
    skipLink.addEventListener('focus', function() {
      this.style.left = 'var(--space-16)';
      this.style.top = 'var(--space-16)';
    });
    
    skipLink.addEventListener('blur', function() {
      this.style.left = '-9999px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main landmark
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main';
    }
  }

  // Initialize all features
  function init() {
    console.log('Initializing enhanced resume website...');
    
    initializeTheme();
    setupAnimations();
    setupAccessibility();
    setupCursorWaveGrid();
    
    // Initial calls
    handleScroll();
    
    console.log('Enhanced resume website initialized successfully!');
  }

  // Cursor-reactive wave grid overlay
  function setupCursorWaveGrid() {
    const canvas = document.getElementById('gridWave');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const state = {
      w: 0,
      h: 0,
      dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      hasMouse: false,
      t: 0,
      rafId: 0,
      lastTime: 0,
    };

    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function isDarkTheme() {
      const attr = document.documentElement.getAttribute('data-color-scheme');
      if (attr === 'dark') return true;
      if (attr === 'light') return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function resize() {
      state.w = window.innerWidth;
      state.h = window.innerHeight;
      canvas.width = Math.floor(state.w * state.dpr);
      canvas.height = Math.floor(state.h * state.dpr);
      canvas.style.width = state.w + 'px';
      canvas.style.height = state.h + 'px';
    }

    function setMouse(clientX, clientY) {
      state.targetMouseX = clientX;
      state.targetMouseY = clientY;
      state.hasMouse = true;
    }

    window.addEventListener('mousemove', (e) => setMouse(e.clientX, e.clientY), passiveSupported ? { passive: true } : false);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY);
    }, passiveSupported ? { passive: true } : false);

    window.addEventListener('resize', resize);
    resize();

    // Start from center to avoid "jump" on load
    state.mouseX = state.w / 2;
    state.mouseY = state.h / 3;
    state.targetMouseX = state.mouseX;
    state.targetMouseY = state.mouseY;
    state.hasMouse = false;

    const spacing = 26; // match the CSS grid
    const step = spacing; // draw points per cell
    const sigma = 40; // crest radius
    const amp = 18; // crest amplitude in px
    const fadeRadius = 420;

    function drawFrame(ts) {
      const now = ts || performance.now();
      const dt = Math.min(50, now - (state.lastTime || now));
      state.lastTime = now;
      state.t += (dt / 1000) * (prefersReduced ? 0.25 : 1);

      // Smoothly follow cursor to avoid sudden crest creation.
      const smoothFactor = prefersReduced ? 0.08 : 0.18;
      state.mouseX += (state.targetMouseX - state.mouseX) * smoothFactor;
      state.mouseY += (state.targetMouseY - state.mouseY) * smoothFactor;

      const dpr = state.dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Clear
      ctx.clearRect(0, 0, state.w, state.h);

      // If user hasn't moved yet, keep it very subtle
      const mx = state.mouseX;
      const my = state.mouseY;

      // Stroke style (monochrome, theme-aware)
      const dark = isDarkTheme();
      const baseAlpha = state.hasMouse ? (dark ? 0.14 : 0.08) : (dark ? 0.05 : 0.03);
      ctx.lineWidth = 1;
      ctx.strokeStyle = dark ? `rgba(255,255,255,${baseAlpha})` : `rgba(0,0,0,${baseAlpha})`;

      // Helper: distance-based fade
      function fade(dist) {
        const x = Math.max(0, 1 - dist / fadeRadius);
        return x * x; // smooth-ish fade
      }

      function crest(dx, dy) {
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
        const g = Math.exp(-(dist * dist) / (2 * sigma * sigma));
        // Smooth localized bulge with no oscillating ring.
        const c = amp * g * fade(dist);
        return { dist, c };
      }

      // Vertical grid lines
      // Anchor the grid to the viewport (static), not to the cursor
      const startX = -spacing * 2;
      for (let x = startX; x <= state.w + spacing * 2; x += spacing) {
        ctx.beginPath();
        // sample y points
        for (let y = -spacing * 2; y <= state.h + spacing * 2; y += step) {
          const dx = x - mx;
          const dy = y - my;
          const { dist, c } = crest(dx, dy);
          const ux = dx / dist;
          const uy = dy / dist;
          // Radial displacement: creates a "crest" around the cursor
          const xx = x + ux * c;
          const yy = y + uy * c;
          if (y === -spacing * 2) ctx.moveTo(xx, yy);
          else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
      }

      // Horizontal grid lines
      const startY = -spacing * 2;
      for (let y = startY; y <= state.h + spacing * 2; y += spacing) {
        ctx.beginPath();
        for (let x = -spacing * 2; x <= state.w + spacing * 2; x += step) {
          const dx = x - mx;
          const dy = y - my;
          const { dist, c } = crest(dx, dy);
          const ux = dx / dist;
          const uy = dy / dist;
          const xx = x + ux * c;
          const yy = y + uy * c;
          if (x === -spacing * 2) ctx.moveTo(xx, yy);
          else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
      }

      state.rafId = window.requestAnimationFrame(drawFrame);
    }

    state.rafId = window.requestAnimationFrame(drawFrame);

    // Stop animations if tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      } else if (!state.rafId) {
        state.lastTime = 0;
        state.rafId = window.requestAnimationFrame(drawFrame);
      }
    });
  }

  // Start initialization
  init();

  // Performance monitoring (development only)
  if (window.performance && window.performance.measure) {
    setTimeout(() => {
      const navigationStart = window.performance.timing.navigationStart;
      const loadComplete = window.performance.timing.loadEventEnd;
      const loadTime = loadComplete - navigationStart;
      console.log('Page load time:', loadTime + 'ms');
    }, 1000);
  }
});