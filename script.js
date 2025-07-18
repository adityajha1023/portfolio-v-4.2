//  ==================================================== Lenis Scroll Behavior ===================================================
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


// ==================================================== Dark Mode =================================================== 
let darkmode = localStorage.getItem("dark-mode");
const themeSwitch = document.getElementById("theme-switch");

const enableDarkMode = () => {
    document.body.classList.add("dark-mode");
    localStorage.setItem("dark-mode", "active");
}

const disableDarkMode = () => {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("dark-mode", null);
}

if(darkmode === "active"){
  enableDarkMode();
}

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem("dark-mode");
    if(darkmode !== "active"){
        enableDarkMode();
    }else{
        disableDarkMode();
    }
});


// ==================================================== Count up Animation ====================================================
const boxes = document.querySelectorAll(".child span");
const boxParent = document.getElementById("first-child"); // Use the correct parent for the counters
let activated = false;
function isElementInViewport(el, offset = 0) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset
  );
}
function animateCounters() {
  boxes.forEach(box => {
    let count = 0;
    const target = parseInt(box.dataset.count);
    // If the span has text like "0 years", preserve the suffix
    const originalText = box.innerText;
    const match = originalText.match(/[\d,]+(.*)/);
    const suffix = match ? match[1] : "";
    function updateCount() {
      if (count < target) {
        count++;
        box.innerText = count + suffix;
        setTimeout(updateCount, 10); // Slowed down from 10ms to 30ms
      } else {
        box.innerText = target + suffix;
      }
    }
    updateCount();
  });
}
window.addEventListener("scroll", () => {
  if (
    isElementInViewport(boxParent, 100) && activated === false
  ) {
    animateCounters();
    activated = true;
  }
});


// ==================================================== Strike through animation for Months ====================================================
const monthsEl = document.getElementById("months");
if (monthsEl && !monthsEl.querySelector('.strike-line')) {
  // Make #months position: relative for absolute overlay
  monthsEl.style.position = "relative";
  // Create the animated line element
  const line = document.createElement("span");
  line.className = "strike-line";
  Object.assign(line.style, {
    position: "absolute",
    left: "-10%",
    top: "55%",
    height: "2.5px", // thinner line
    background: "var(--text-color)",
    width: "0%",
    transform: "translateY(-50%) rotate(-8deg)",
    pointerEvents: "none",
    zIndex: 2,
    borderRadius: "2px",
    boxShadow: "0 1px 8px 0 #d9d9d9a0"
  });
  monthsEl.appendChild(line);
}

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && monthsEl) {
  const line = monthsEl.querySelector('.strike-line');
  // Reset line width
  gsap.set(line, { width: "0%" });

  ScrollTrigger.create({
    trigger: monthsEl.parentElement, // parent .child
    start: "top 60%",
    onEnter: () => {
      gsap.to(line, {
        width: "120%",
        duration: 1, // 1 second animation
        ease: "power2.out"
      });
    },
    onLeaveBack: () => {
      gsap.to(line, {
        width: "0%",
        duration: 0.5,
        ease: "power2.in"
      });
    }
  });
}


// ==================================================== GSAP ScrollTrigger Animation For Headings Show Up Animation ====================================================
// Helper function to split text into spans and set initial styles
function splitTextToSpans(selector) {
  const el = document.querySelector(selector);
  if (el && !el.classList.contains('split-done')) {
    const text = el.textContent;
    el.innerHTML = '';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = 0.2;
      span.style.filter = 'blur(2px)';
      span.style.color = '#d9d9d9';
      el.appendChild(span);
    });
    el.classList.add('split-done');
  }
}
// List of heading selectors and their scrollTrigger settings
const headings = [
  {
    selector: '#h12',
    trigger: '#h12',
    start: 'top 80%',
  },
  {
    selector: '#h11',
    trigger: '#h11',
    start: 'top 80%',
  },
  {
    selector: '#your-ultimate',
    trigger: '#your-ultimate',
    start: 'top 80%',
  },
  {
    selector: '#featured-projects',
    trigger: '#featured-projects',
    start: 'top 80%',
  },
  {
    selector: '#testimonials-heading',
    trigger: '#testimonials-heading',
    start: 'top 80%',
  },
  { selector: '#faqs-heading',
    trigger: '#faqs-heading',
    start: 'top 80%',
  }
];
gsap.registerPlugin(ScrollTrigger);
headings.forEach(({selector, trigger, start}) => {
  splitTextToSpans(selector);
  gsap.to(`${selector} span`, {
    opacity: 1,
    filter: 'blur(0px)',
    color: '', // Remove color override to inherit from parent or CSS
    duration: 0.2,
    stagger: 0.02,
    scrollTrigger: {
      trigger: trigger,
      start: start,
      toggleActions: 'play none none none'
    }
  });
});


// ====================================================Animate #paragraph to fade in from opacity 0 to 1 on scroll ====================================================
gsap.fromTo(
  "#paragraph",
  { opacity: 0 },
  {
    opacity: 1,
    duration: 0.8,
    ease: "power1.out",
    scrollTrigger: {
      trigger: "#paragraph",
      start: "top 85%",
      toggleActions: "play none none none"
    }
  }
);


// ==================================================== Animate #featured-projects line ====================================================
const featuredProjects = document.getElementById('featured-projects');
if (featuredProjects) {
  const svgWidth = 290; 
  const svgHeight = 8;
  const strokeColor = "var(--hover-color)"; 
  const strokeWidth = 4;
  const svgNS = "http://www.w3.org/2000/svg";

  // Only create the SVG if it doesn't already exist
  let svg = document.getElementById("featured-glow-line");
  if (!svg) {
    svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("id", "featured-glow-line");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.style.display = "block";
    svg.style.margin = "18px auto 0 auto";
    svg.style.opacity = "1";
    svg.style.overflow = "visible";

    // Create a path: a smooth S-curve
    const path = document.createElementNS(svgNS, "path");
    const d = `M 4 ${svgHeight/2} 
       C ${svgWidth/4} 0, ${svgWidth*3/4} ${svgHeight}, ${svgWidth-4} ${svgHeight/2}`;
    path.setAttribute("d", d);
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", strokeWidth);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("filter", "url(#glow)");

    // Add a filter for the glow effect
    const defs = document.createElementNS(svgNS, "defs");
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", "glow");
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");

    const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
    feGaussianBlur.setAttribute("stdDeviation", "3.5");
    feGaussianBlur.setAttribute("result", "coloredBlur");

    const feMerge = document.createElementNS(svgNS, "feMerge");
    const feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
    feMergeNode1.setAttribute("in", "coloredBlur");
    const feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
    feMergeNode2.setAttribute("in", "SourceGraphic");

    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);

    svg.appendChild(defs);
    svg.appendChild(path);

    // Insert after #featured-projects
    featuredProjects.insertAdjacentElement('afterend', svg);
  }

  // Animate the line drawing from left to right on scroll trigger EVERY time
  // (reset on leaveBack, animate on enter)
  const line = svg.querySelector("path");
  if (line) {
    const length = line.getTotalLength();
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;

    // Kill any previous ScrollTrigger for this line
    if (line._glowLineScrollTrigger) {
      line._glowLineScrollTrigger.kill();
    }

    line._glowLineScrollTrigger = ScrollTrigger.create({
      trigger: "#featured-projects",
      start: "top 80%",
      onEnter: () => {
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.out"
        });
      },
      onLeaveBack: () => {
        gsap.to(line, {
          strokeDashoffset: length,
          duration: 0.5,
          ease: "power2.in"
        });
      }
    });
  }
}

// ==================================================== Background Animation For Testimonials  =================================================== 
(function() {
  const section = document.querySelector('.testimonials');
  const canvas = document.getElementById('testimonials-bg');
  let ctx = canvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;
  let width, height;
  let circles = [];
  const NUM_CIRCLES = 80;
  const RADIUS = 1;
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    width = section.offsetWidth;
    height = section.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createCircles() {
    circles = [];
    for (let i = 0; i < NUM_CIRCLES; i++) {
      let angle = randomBetween(0, 2 * Math.PI);
      let speed = randomBetween(0.15, 0.5);
      circles.push({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: 'rgba(220,220,220,0.7)',
        changeDirTimer: Math.floor(randomBetween(60, 180)), // frames until next direction change
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let c of circles) {
      // Randomly change direction at intervals
      c.changeDirTimer--;
      if (c.changeDirTimer <= 0) {
        let angle = randomBetween(0, 2 * Math.PI);
        let speed = randomBetween(0.15, 0.5);
        c.vx = Math.cos(angle) * speed;
        c.vy = Math.sin(angle) * speed;
        c.changeDirTimer = Math.floor(randomBetween(60, 180));
      }

      // Move
      c.x += c.vx;
      c.y += c.vy;

      // Wrap around edges
      if (c.x < 0) c.x = width;
      if (c.x > width) c.x = 0;
      if (c.y < 0) c.y = height;
      if (c.y > height) c.y = 0;

      // Interactivity: repel from mouse
      if (mouse.x !== null && mouse.y !== null) {
        let dx = c.x - mouse.x;
        let dy = c.y - mouse.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 60) {
          let angle = Math.atan2(dy, dx);
          let force = (60 - dist) / 60;
          c.vx += Math.cos(angle) * force * 0.7;
          c.vy += Math.sin(angle) * force * 0.7;
        }
      }

      // Limit velocity to keep movement smooth
      let maxSpeed = 0.7;
      let speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
      if (speed > maxSpeed) {
        c.vx = (c.vx / speed) * maxSpeed;
        c.vy = (c.vy / speed) * maxSpeed;
      }

      // Draw
      ctx.beginPath();
      ctx.arc(c.x, c.y, RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = c.color;
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / (rect.right - rect.left) * width;
    mouse.y = (e.clientY - rect.top) / (rect.bottom - rect.top) * height;
  }
  function onMouseLeave() {
    mouse.x = null;
    mouse.y = null;
  }

  // Responsive
  window.addEventListener('resize', () => {
    resizeCanvas();
    createCircles();
  });

  // Mouse events
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);

  // Init
  function init() {
    resizeCanvas();
    createCircles();
    animate();
  }

  // Wait for section to have size
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 100);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(init, 100));
  }
})();

// ==================================================== FAQS Animation===================================================
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const toggle = item.querySelector('.faq-toggle');
      
      question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          
          // Close all other FAQ items
          faqItems.forEach(otherItem => {
              if (otherItem !== item) {
                  otherItem.classList.remove('active');
                  otherItem.querySelector('.faq-answer').classList.remove('active');
              }
          });
          
          // Toggle current item
          if (isActive) {
              item.classList.remove('active');
              answer.classList.remove('active');
          } else {
              item.classList.add('active');
              answer.classList.add('active');
          }
      });
  });
});






// ==================================================== GSAP ScrollTrigger Animation For Testimonials (Horizontal Scroll) =================================================== 

const wrapper = gsap.utils.toArray(".wrapper .item");
gsap.to(wrapper, {
    xPercent: -70 * (wrapper.length - 1),
    scrollTrigger: {  
        trigger: ".wrapper",
        pin: true,
        scrub: 1,
    },
    ease: "none"
});

// ==================================================== Carousel button animation ===================================================
// Carousel logic for .cards section

const cardsSection = document.querySelector('.cards');
const cards = Array.from(cardsSection.children);
const leftBtn = document.getElementById('carousel-left');
const rightBtn = document.getElementById('carousel-right');

let currentIndex = 0;

// Helper: Remove animation classes
function resetCardAnimations() {
  cards.forEach(card => {
    card.classList.remove('carouselFadeZoomRotate');
  });
}

// Helper: Animate and show only the current card
function showCard(index, direction) {
  // Hide all cards except the current one
  cards.forEach((card, i) => {
    if (i === index) {
      card.style.display = 'flex';
      // Enable pointer events for links inside the visible card
      card.style.pointerEvents = 'auto';
      // Also enable pointer events for all links inside this card
      card.querySelectorAll('a').forEach(a => a.style.pointerEvents = 'auto');
    } else {
      card.style.display = 'none';
      // Disable pointer events for links inside hidden cards
      card.style.pointerEvents = 'none';
      card.querySelectorAll('a').forEach(a => a.style.pointerEvents = 'none');
    }
  });

  // Animate the current card
  resetCardAnimations();
  // Force reflow to restart animation
  void cards[index].offsetWidth;
  cards[index].classList.add('carouselFadeZoomRotate');
}

// On mobile, show only one card at a time
function setupCarousel() {
  if (window.innerWidth <= 600) {
    cards.forEach((card, i) => {
      if (i === currentIndex) {
        card.style.display = 'flex';
        card.style.pointerEvents = 'auto';
        card.querySelectorAll('a').forEach(a => a.style.pointerEvents = 'auto');
      } else {
        card.style.display = 'none';
        card.style.pointerEvents = 'none';
        card.querySelectorAll('a').forEach(a => a.style.pointerEvents = 'none');
      }
    });
  } else {
    // On desktop, show all cards and enable all links
    cards.forEach(card => {
      card.style.display = 'flex';
      card.style.pointerEvents = 'auto';
      card.classList.remove('carouselFadeZoomRotate');
      card.querySelectorAll('a').forEach(a => a.style.pointerEvents = 'auto');
    });
  }
}

// Button event listeners
leftBtn.addEventListener('click', () => {
  if (window.innerWidth > 600) return; // Only on mobile
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  showCard(currentIndex, 'left');
});

rightBtn.addEventListener('click', () => {
  if (window.innerWidth > 600) return; // Only on mobile
  currentIndex = (currentIndex + 1) % cards.length;
  showCard(currentIndex, 'right');
});

// On resize, reset carousel
window.addEventListener('resize', setupCarousel);

// Initial setup
setupCarousel();
