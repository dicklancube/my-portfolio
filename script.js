
    // ===== DOM Elements =====
    const themeToggle = document.getElementById('theme-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const sections = document.querySelectorAll('section');
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.nav-links');

    // ===== Theme Toggle Functionality =====
    function initializeTheme() {
      const currentTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      themeToggle.innerHTML = currentTheme === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    }

    function toggleTheme() {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' 
        ? 'light' 
        : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.innerHTML = newTheme === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    }

    // ===== Navigation Effects =====
    function handleScroll() {
      // Sticky navbar effect
      if (window.scrollY > 100) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }

      // Active section highlighting
      let currentSection = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }

    // ===== Smooth Scrolling =====
    function setupSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
            
            // Update URL without page jump
            if (history.pushState) {
              history.pushState(null, null, targetId);
            } else {
              location.hash = targetId;
            }
          }

          // Close mobile menu if open
          if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
          }
        });
      });
    }

    // ===== Form Handling =====
    function initializeForm() {
      // Floating label effect
      formInputs.forEach(input => {
        // Initialize labels for pre-filled content
        if (input.value) {
          input.nextElementSibling.classList.add('active');
        }
        
        input.addEventListener('focus', () => {
          input.nextElementSibling.classList.add('active');
        });
        
        input.addEventListener('blur', () => {
          if (!input.value) {
            input.nextElementSibling.classList.remove('active');
          }
        });
      });

      // Form submission
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          message: document.getElementById('message').value
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
          showAlert('Please fill in all fields', 'error');
          return;
        }

        if (!validateEmail(formData.email)) {
          showAlert('Please enter a valid email address', 'error');
          return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        try {
          // Show loading state
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
          submitBtn.disabled = true;
          
          // In a real implementation, you would use:
          // const response = await fetch('your-endpoint', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(formData)
          // });
          
          // For demo purposes:
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          showAlert('Message sent successfully!', 'success');
          contactForm.reset();
          formInputs.forEach(input => {
            input.nextElementSibling.classList.remove('active');
          });
        } catch (error) {
          showAlert('Failed to send message. Please try again.', 'error');
          console.error('Form submission error:', error);
        } finally {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      });
    }

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function showAlert(message, type) {
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type}`;
      alertDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
      `;
      
      document.body.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.classList.add('fade-out');
        setTimeout(() => alertDiv.remove(), 500);
      }, 3000);
    }

    // ===== Scroll Animations =====
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

    // ===== Mobile Menu =====
    function setupMobileMenu() {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.innerHTML = mobileMenu.classList.contains('active') 
          ? '<i class="fas fa-times"></i>' 
          : '<i class="fas fa-bars"></i>';
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          mobileMenu.classList.remove('active');
          mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    }

    // ===== Initialize Everything =====
    document.addEventListener('DOMContentLoaded', () => {
      initializeTheme();
      initializeForm();
      initializeAnimations();
      setupSmoothScrolling();
      setupMobileMenu();
      
      themeToggle.addEventListener('click', toggleTheme);
      window.addEventListener('scroll', handleScroll);
      
      // Initial scroll position check
      handleScroll();
    });
     function setupMobileMenu() {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.querySelector('.nav-actions').classList.toggle('active');
        mobileMenuToggle.innerHTML = mobileMenu.classList.contains('active') 
          ? '<i class="fas fa-times"></i>' 
          : '<i class="fas fa-bars"></i>';
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target) &&
            !document.querySelector('.nav-actions').contains(e.target)) {
          mobileMenu.classList.remove('active');
          document.querySelector('.nav-actions').classList.remove('active');
          mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    }
    document.addEventListener('DOMContentLoaded', function() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');
  
        mobileMenuToggle.addEventListener('click', function() {
          navLinks.classList.toggle('active');
          navActions.classList.toggle('active');
          this.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
        });
  
        // Close menu when clicking on nav items
        document.querySelectorAll('.nav-link').forEach(link => {
          link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
              navLinks.classList.remove('active');
              navActions.classList.remove('active');
              mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
          });
        });
      });
  
