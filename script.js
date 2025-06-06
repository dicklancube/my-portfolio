document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  document.body.classList.add('page-loaded');

  // Theme functionality
  const themeToggle = document.getElementById('theme-toggle');
  function initializeTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.innerHTML = currentTheme === 'dark' 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  }
  
  function toggleTheme() {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  }
  
  if (themeToggle) {
    initializeTheme();
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Mobile menu functionality
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');
  
  function toggleMobileMenu() {
    document.body.classList.toggle('menu-open');
    mobileMenu.classList.toggle('active');
    if (navActions) navActions.classList.toggle('active');
    mobileMenuToggle.setAttribute('aria-expanded', 
      mobileMenu.classList.contains('active'));
    mobileMenuToggle.innerHTML = mobileMenu.classList.contains('active') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  }
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMobileMenu();
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768 && mobileMenu.classList.contains('active')) {
          toggleMobileMenu();
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileMenu.contains(e.target) && 
          !mobileMenuToggle.contains(e.target) &&
          (!navActions || !navActions.contains(e.target))) {
        if (mobileMenu.classList.contains('active')) {
          toggleMobileMenu();
        }
      }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Update URL without page jump
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    });
  });

  // Form handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Initialize form labels
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
      const label = input.nextElementSibling;
      if (input.value) label.classList.add('active');
      
      input.addEventListener('focus', () => label.classList.add('active'));
      input.addEventListener('blur', () => !input.value && label.classList.remove('active'));
    });
    
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
      };
      
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        showAlert('Please fill in all fields', 'error');
        return;
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showAlert('Please enter a valid email', 'error');
        return;
      }
      
      // Submit form
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showAlert('Message sent successfully!', 'success');
        contactForm.reset();
        document.querySelectorAll('.form-group label.active').forEach(label => {
          label.classList.remove('active');
        });
      } catch (error) {
        showAlert('Failed to send message', 'error');
        console.error('Error:', error);
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // Scroll animations
  function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
  initializeAnimations();
  
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    if (navbar) {
      navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
    }
    
    // Active section highlighting
    let currentSection = '';
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute('id');
      }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (currentSection && link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initialize
  
  // Close mobile menu when resizing to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
});

// Alert system
function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.setAttribute('role', 'alert');
  alert.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.classList.add('fade-out');
    setTimeout(() => alert.remove(), 500);
  }, 3000);
}