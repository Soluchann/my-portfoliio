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
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectModal');
  const modalTitle = document.querySelector('.modal__title');
  const modalDescription = document.querySelector('.modal__description');
  const modalCloseBtns = document.querySelectorAll('.modal__close, .modal__close-btn');
  const backToTopBtn = document.querySelector('.back-to-top');
  const sections = document.querySelectorAll('section');
  const projectDetailsBtns = document.querySelectorAll('.project-details-btn');

  // Enhanced project data with more detailed information
  const projectsData = [
    {
      id: 'project1',
      title: 'Enhanced School Zone Safety',
      subtitle: 'Vehicle Speed Estimation And Geofence Based Control',
      description: 'Developed a real-time vehicle speed estimation system using YOLO and DeepSORT, enhancing school zone safety through intelligent geofencing. Implemented geofence-based speed control to automatically detect and manage vehicle behavior in school zones, improving pedestrian safety. The system uses computer vision techniques to detect vehicles, track their movements, and estimate their speeds accurately. When vehicles enter the designated school zone (geofence), the system can trigger alerts or notifications if speed limits are exceeded, helping to enforce safety regulations more effectively. Technologies used include Python, OpenCV, YOLO object detection, DeepSORT tracking algorithm, and GPS-based geofencing systems.'
    },
    {
      id: 'project2',
      title: 'Heart Disease Prediction',
      description: 'A comprehensive prediction analysis system that evaluates the likelihood of heart disease based on user input parameters. This project utilizes advanced machine learning algorithms to analyze various health parameters and predict the likelihood of heart disease. Features include sophisticated data visualization, model training with cross-validation techniques, and an interactive web interface for users to input their health metrics for real-time predictions. The model was trained on extensive medical datasets and achieves high accuracy in identifying potential heart conditions based on multiple risk factors including age, blood pressure, cholesterol levels, and lifestyle factors. The system provides detailed risk assessments and recommendations for further medical consultation.'
    },
    {
      id: 'project3',
      title: 'Bike Demand Prediction',
      description: 'An advanced analytics solution based on Kaggle dataset for predicting bike rental demand across various temporal and environmental factors using multiple linear regression and sophisticated feature engineering techniques. This project involved extensive data preprocessing, exploratory data analysis, and statistical modeling to identify key factors affecting bike rental demand. The model considers seasonal variations, weather conditions, time-based patterns, holidays, and user demographics to provide accurate predictions. The results help bike rental companies optimize their inventory management, resource allocation, and pricing strategies based on anticipated demand fluctuations. Technologies used include Python, Pandas, Scikit-learn, Matplotlib, and Jupyter notebooks for comprehensive data analysis and visualization.'
    }
  ];

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

  // Enhanced Modal functionality with keyboard navigation
  function openModal(projectId) {
    console.log('Opening modal for project:', projectId);
    const projectData = projectsData.find(function(p) { return p.id === projectId; });
    
    if (projectData && modal && modalTitle && modalDescription) {
      modalTitle.textContent = projectData.title;
      modalDescription.textContent = projectData.description;
      modal.classList.add('active');
      body.style.overflow = 'hidden';
      
      // Focus management for accessibility
      const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
      
      console.log('Modal opened successfully');
    }
  }

  function closeModal() {
    console.log('Closing modal');
    if (modal) {
      modal.classList.remove('active');
      body.style.overflow = '';
      
      // Return focus to triggering element
      const activeCard = document.querySelector('.project-card:focus, .project-details-btn:focus');
      if (activeCard) {
        activeCard.focus();
      }
    }
  }

  // Enhanced project interaction with keyboard support
  projectDetailsBtns.forEach(function(btn, index) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      if (card) {
        const projectId = card.getAttribute('data-project');
        openModal(projectId);
      }
    });

    // Add keyboard support
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Enhanced project cards with better interaction
  projectCards.forEach(function(card, index) {
    // Make cards keyboard navigable
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View project details');

    card.addEventListener('click', function() {
      const projectId = card.getAttribute('data-project');
      openModal(projectId);
    });

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Enhanced modal close functionality
  modalCloseBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal();
    });
  });

  // Enhanced modal backdrop click
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

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
        link.href = 'resources/RESUME_ADARSH 3.pdf'; // <-- Change this to your actual resume file path
        link.download = 'Adarsh_resume.pdf';
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

  // Enhanced form validation and submission
  function setupContactForm() {
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    console.log('Setting up contact form. Elements found:', {
      sendMessageBtn: !!sendMessageBtn,
      nameInput: !!nameInput,
      emailInput: !!emailInput,
      messageInput: !!messageInput
    });
    
    if (sendMessageBtn && nameInput && emailInput && messageInput) {
      // Real-time validation
      const inputs = [nameInput, emailInput, messageInput];
      inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
      });

      sendMessageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Send message button clicked');
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
          if (!validateField.call(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          showNotification('Please correct the errors above.', 'error');
          return;
        }

        // Simulate form submission
        const originalText = sendMessageBtn.innerHTML;
        sendMessageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendMessageBtn.disabled = true;

        setTimeout(() => {
          sendMessageBtn.innerHTML = originalText;
          sendMessageBtn.disabled = false;
          
          // Clear form
          nameInput.value = '';
          emailInput.value = '';
          if (subjectInput) subjectInput.value = '';
          messageInput.value = '';
          
          showNotification('Thank you for your message! This is a demo form.', 'success');
        }, 2000);
      });
    } else {
      console.log('Contact form elements not found');
    }
  }

  // Enhanced field validation
  function validateField() {
    const field = this;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    clearFieldError.call(field);

    if (field.hasAttribute('required') && !value) {
      errorMessage = 'This field is required.';
      isValid = false;
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address.';
        isValid = false;
      }
    } else if (field.id === 'name' && value && value.length < 2) {
      errorMessage = 'Name must be at least 2 characters long.';
      isValid = false;
    } else if (field.id === 'message' && value && value.length < 10) {
      errorMessage = 'Message must be at least 10 characters long.';
      isValid = false;
    }

    if (!isValid) {
      showFieldError(field, errorMessage);
    }

    return isValid;
  }

  function showFieldError(field, message) {
    field.classList.add('error');
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  function clearFieldError() {
    this.classList.remove('error');
    const errorElement = this.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

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

  // Enhanced skills animation
  function setupSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-item__progress');
    
    if ('IntersectionObserver' in window) {
      const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(function() {
              bar.style.transition = 'width 1.5s ease-in-out';
              bar.style.width = width;
            }, 200);
            
            skillObserver.unobserve(bar);
          }
        });
      }, { threshold: 0.5 });
      
      skillBars.forEach(function(bar) {
        skillObserver.observe(bar);
      });
    }
  }

  // Enhanced keyboard navigation
  document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('active')) {
        closeModal();
      } else if (nav && nav.classList.contains('active')) {
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
    const sectionIds = Array.from(sections).map(s => s.id).filter(id => id);
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
    setupContactForm();
    setupAnimations();
    setupSkillsAnimation();
    setupAccessibility();
    
    // Initial calls
    handleScroll();
    
    console.log('Enhanced resume website initialized successfully!');
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