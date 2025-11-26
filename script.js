/* ============================================
   JOEVEN CERVEZA PORTFOLIO - SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initCursorGlow();
  initNavigation();
  initTypingEffect();
  initScrollAnimations();
  initCopyToClipboard();
  initSmoothScroll();
});

/* ============================================
   CURSOR GLOW EFFECT
   ============================================ */
function initCursorGlow() {
  const cursor = document.querySelector('.cursor-glow');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;
  
  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');
  
  // Show nav after scroll
  let lastScroll = 0;
  
  const handleScroll = () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
    
    // Update active nav item
    updateActiveNavItem();
    
    lastScroll = currentScroll;
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Mobile nav toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }
  
  // Close mobile nav on link click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle?.classList.remove('active');
    });
  });
}

function updateActiveNavItem() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
  const heroName = document.querySelector('.hero-name');
  if (!heroName) return;
  
  const text = heroName.textContent;
  heroName.innerHTML = '';
  heroName.style.opacity = '1';
  
  // Split text into characters
  const chars = text.split('');
  
  chars.forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${0.5 + index * 0.05}s`;
    span.style.animation = `charReveal 0.5s ease forwards`;
    heroName.appendChild(span);
  });
  
  // Add keyframes dynamically
  if (!document.querySelector('#char-reveal-keyframes')) {
    const style = document.createElement('style');
    style.id = 'char-reveal-keyframes';
    style.textContent = `
      @keyframes charReveal {
        0% {
          opacity: 0;
          transform: translateY(50px) rotateX(-90deg);
        }
        100% {
          opacity: 1;
          transform: translateY(0) rotateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
  // Elements to animate
  const animatedElements = document.querySelectorAll(
    '.section-title, .section-subtitle, .about-text, .stat-item, ' +
    '.skill-category, .skill-pill, .skill-item, .mastery-legend, ' +
    '.timeline-item, .project-card, .contact-card'
  );
  
  // Intersection Observer options
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add staggered delay for grouped elements
        const element = entry.target;
        const delay = getStaggerDelay(element);
        
        setTimeout(() => {
          element.classList.add('visible');
        }, delay);
        
        // Unobserve after animation
        observer.unobserve(element);
      }
    });
  }, observerOptions);
  
  // Observe all elements
  animatedElements.forEach(el => observer.observe(el));
}

function getStaggerDelay(element) {
  // Get stagger delay based on element type and position
  const parent = element.parentElement;
  
  if (element.classList.contains('stat-item')) {
    const siblings = Array.from(parent.querySelectorAll('.stat-item'));
    return siblings.indexOf(element) * 100;
  }
  
  if (element.classList.contains('skill-pill')) {
    const siblings = Array.from(parent.querySelectorAll('.skill-pill'));
    return siblings.indexOf(element) * 50;
  }
  
  if (element.classList.contains('skill-item')) {
    const siblings = Array.from(parent.querySelectorAll('.skill-item'));
    return siblings.indexOf(element) * 80;
  }
  
  if (element.classList.contains('skill-category')) {
    const siblings = Array.from(parent.querySelectorAll('.skill-category'));
    return siblings.indexOf(element) * 150;
  }
  
  if (element.classList.contains('timeline-item')) {
    const siblings = Array.from(parent.querySelectorAll('.timeline-item'));
    return siblings.indexOf(element) * 200;
  }
  
  if (element.classList.contains('project-card')) {
    const siblings = Array.from(parent.querySelectorAll('.project-card'));
    return siblings.indexOf(element) * 150;
  }
  
  if (element.classList.contains('contact-card')) {
    const siblings = Array.from(parent.querySelectorAll('.contact-card'));
    return siblings.indexOf(element) * 100;
  }
  
  return 0;
}

/* ============================================
   COPY TO CLIPBOARD
   ============================================ */
function initCopyToClipboard() {
  const contactCards = document.querySelectorAll('.contact-card[data-copy]');
  
  contactCards.forEach(card => {
    card.addEventListener('click', async () => {
      const textToCopy = card.dataset.copy;
      const tooltip = card.querySelector('.copy-tooltip');
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Show copied feedback
        card.classList.add('copied');
        if (tooltip) {
          tooltip.textContent = 'Copied!';
        }
        
        // Reset after 2 seconds
        setTimeout(() => {
          card.classList.remove('copied');
          if (tooltip) {
            tooltip.textContent = 'Click to copy';
          }
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        fallbackCopy(textToCopy);
      }
    });
  });
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }
  
  document.body.removeChild(textarea);
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const offsetTop = target.offsetTop - 80; // Account for fixed nav
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   PARALLAX EFFECT FOR HERO ORBS
   ============================================ */
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.hero-orb');
  
  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 0.02;
    const x = (window.innerWidth / 2 - e.clientX) * speed;
    const y = (window.innerHeight / 2 - e.clientY) * speed;
    
    orb.style.transform = `translate(${x}px, ${y}px)`;
  });
});

/* ============================================
   DYNAMIC YEAR IN FOOTER
   ============================================ */
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* ============================================
   PRELOADER (optional - adds polish)
   ============================================ */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Trigger hero animations after load
  setTimeout(() => {
    document.querySelector('.hero')?.classList.add('loaded');
  }, 100);
});

