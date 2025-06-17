document.addEventListener("DOMContentLoaded", function () {
  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();
  document.body.classList.add("page-loaded");

  // ================================
  // THEME TOGGLE
  // ================================
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    themeToggle.innerHTML =
      currentTheme === "dark"
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';

    themeToggle.addEventListener("click", () => {
      const newTheme =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      themeToggle.innerHTML =
        newTheme === "dark"
          ? '<i class="fas fa-sun"></i>'
          : '<i class="fas fa-moon"></i>';
    });
  }

  // ================================
  // MOBILE MENU TOGGLE
  // ================================
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".nav-links");
  const navActions = document.querySelector(".nav-actions");

  function toggleMobileMenu() {
    document.body.classList.toggle("menu-open");
    mobileMenu.classList.toggle("active");
    if (navActions) navActions.classList.toggle("active");
    mobileMenuToggle.setAttribute(
      "aria-expanded",
      mobileMenu.classList.contains("active")
    );
    mobileMenuToggle.innerHTML = mobileMenu.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  }

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (
          window.innerWidth <= 768 &&
          mobileMenu.classList.contains("active")
        ) {
          toggleMobileMenu();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (
        !mobileMenu.contains(e.target) &&
        !mobileMenuToggle.contains(e.target) &&
        (!navActions || !navActions.contains(e.target))
      ) {
        if (mobileMenu.classList.contains("active")) {
          toggleMobileMenu();
        }
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        toggleMobileMenu();
      }
    });
  }

  // ================================
  // SMOOTH SCROLLING
  // ================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    });
  });

  // ================================
  // CONTACT FORM (DUMMY HANDLER)
  // ================================
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    // Floating label logic
    document
      .querySelectorAll(".form-group input, .form-group textarea")
      .forEach((input) => {
        const label = input.nextElementSibling;
        if (input.value) label.classList.add("active");

        input.addEventListener("focus", () => label.classList.add("active"));
        input.addEventListener("blur", () => {
          if (!input.value) label.classList.remove("active");
        });
      });

    // Submit handler (dummy simulated message sending)
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        message: document.getElementById("message").value.trim(),
      };

      // Basic validation
      if (!formData.name || !formData.email || !formData.message) {
        showToast("Please fill in all fields", "error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showToast("Please enter a valid email", "error");
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      try {
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate message sending with delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        contactForm.reset();
        document
          .querySelectorAll(".form-group label.active")
          .forEach((label) => label.classList.remove("active"));

        playSuccessSound();
        showToast("Message sent successfully!", "success");
      } catch (error) {
        console.error("Simulated send failed:", error);
        playErrorSound();
        showToast("Something went wrong!", "error");
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ================================
  // NAVBAR SCROLL EFFECT + ACTIVE LINK
  // ================================
  const navbar = document.getElementById("navbar");
  function handleScroll() {
    if (navbar) navbar.classList.toggle("navbar-scrolled", window.scrollY > 50);

    let currentSection = "";
    document.querySelectorAll("section").forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (
        currentSection &&
        link.getAttribute("href") === `#${currentSection}`
      ) {
        link.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  // Close mobile menu on resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && mobileMenu?.classList.contains("active")) {
      toggleMobileMenu();
    }
  });

  // ================================
  // SCROLL ANIMATIONS
  // ================================
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("animate");
      });
    },
    { threshold: 0.1 }
  );
  document
    .querySelectorAll(".animate-on-scroll")
    .forEach((el) => observer.observe(el));

  // ================================
  // TAGLINE STAGGER ANIMATION
  // ================================
  const tagline = document.querySelector(".tagline");
  if (tagline) {
    tagline.querySelectorAll(".word").forEach((word, i) => {
      word.style.animationDelay = `${1.2 + i * 0.1}s`;
    });
  }

  // ================================
  // BUTTON MAGNET HOVER
  // ================================
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
      btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
    });
  });

  document.querySelectorAll(".magnetic-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const offsetX = (x - rect.width / 2) * 0.1;
      const offsetY = (y - rect.height / 2) * 0.1;
      btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
});

// ================================
// UTILITY FUNCTIONS
// ================================
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fas ${
    type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
  }"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function playSuccessSound() {
  const audio = new Audio(
    "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA="
  );
  audio.play();
}

function playErrorSound() {
  const audio = new Audio(
    "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA="
  );
  audio.play();
}
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
