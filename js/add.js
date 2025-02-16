const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("min");
const seconds = document.getElementById("sec");

const timerSet = new Date(2025, 1, 17, 10, 0, 0);
let fireworksStarted = false;
let fireworksInterval;
let fireworksAnimationRunning = true;

function updateCountDown() {
  const currentTime = new Date();
  const diff = timerSet - currentTime;
  
  if (diff <= 0) {
    days.innerHTML = "00";
    hours.innerHTML = "00";
    minutes.innerHTML = "00";
    seconds.innerHTML = "00";

    if (!fireworksStarted) {
      startFireworks();
      fireworksStarted = true;
    }
    return;
  }

  const d = Math.floor(diff / 1000 / 60 / 60 / 24);
  const h = Math.floor(diff / 1000 / 60 / 60) % 24;
  const m = Math.floor(diff / 1000 / 60) % 60;
  const s = Math.floor(diff / 1000) % 60;

  days.innerHTML = d;
  hours.innerHTML = h < 10 ? "0" + h : h;
  minutes.innerHTML = m < 10 ? "0" + m : m;
  seconds.innerHTML = s < 10 ? "0" + s : s;
}

setInterval(updateCountDown, 1000);
updateCountDown();

const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const fireworks = [];
const particles = [];

class Firework {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speedX = (targetX - x) / 20;
    this.speedY = (targetY - y) / 20;
    this.life = 20;
    this.trail = [];
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
  }

  update() {
    this.trail.push({ x: this.x, y: this.y, color: this.color });

    if (this.trail.length > 6) this.trail.shift();

    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;

    if (this.life <= 0) {
      this.explode();
      return true;
    }
    return false;
  }

  draw() {
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.shadowBlur = 15;

    ctx.beginPath();
    for (let i = 0; i < this.trail.length - 1; i++) {
      ctx.strokeStyle = this.trail[i].color;
      ctx.shadowColor = this.trail[i].color;
      ctx.globalAlpha = (i + 1) / this.trail.length;
      ctx.moveTo(this.trail[i].x, this.trail[i].y);
      ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
    }
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  explode() {
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = (Math.random() - 0.5) * 6;
    this.speedY = (Math.random() - 0.5) * 6;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    this.life = 50;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;
    return this.life <= 0;
  }

  draw() {
    ctx.globalAlpha = this.life / 50; // Gradual fade-out effect
    ctx.shadowBlur = 15; // Glow effect
    ctx.shadowColor = this.color; // Use the particle color for glow
    ctx.fillStyle = this.color;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2); // Increased size for better glow
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0; // Reset to avoid affecting other elements
  }
}



function startFireworks() {
  fireworksAnimationRunning = true;
  fireworksInterval = setInterval(() => {
    if (fireworks.length < 4) {
      const x = Math.random() * canvas.width;
      const y = canvas.height;
      const targetX = Math.random() * canvas.width;
      const targetY = Math.random() * canvas.height * (0.4 + Math.random() * 0.5);
      fireworks.push(new Firework(x, y, targetX, targetY));
    }
  }, 800);

  // Stop fireworks and fade out after 10 seconds
  setTimeout(() => {
    stopFireworks();
    fadeOutFireworks();
  }, 10000);
}

function stopFireworks() {
  clearInterval(fireworksInterval);
}

function fadeOutFireworks() {
  let fadeDuration = 2000; // 2 seconds fade out
  let startTime = performance.now();

  function fade() {
    let elapsed = performance.now() - startTime;
    let fadeProgress = Math.max(1 - elapsed / fadeDuration, 0);

    ctx.globalAlpha = fadeProgress;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = fireworks.length - 1; i >= 0; i--) {
      if (fireworks[i].update()) {
        fireworks.splice(i, 1);
      } else {
        fireworks[i].draw();
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].update()) {
        particles.splice(i, 1);
      } else {
        particles[i].draw();
      }
    }

    if (fadeProgress > 0) {
      requestAnimationFrame(fade);
    } else {
      fireworks.length = 0;
      particles.length = 0;
      fireworksAnimationRunning = false;
      ctx.globalAlpha = 1; // Reset opacity
    }
  }

  fade();
}

function animateFireworks() {
  if (!fireworksAnimationRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    if (fireworks[i].update()) {
      fireworks.splice(i, 1);
    } else {
      fireworks[i].draw();
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].update()) {
      particles.splice(i, 1);
    } else {
      particles[i].draw();
    }
  }

  requestAnimationFrame(animateFireworks);
}

function checkTimer() {
  const now = new Date();
  const timerEnd = new Date(2025, 1, 17, 10, 0, 0);

  if (now >= timerEnd && !fireworksStarted) {
    startFireworks();
    fireworksStarted = true;
  }
}

setInterval(checkTimer, 1000);
animateFireworks();


// Update the video source based on viewport width
function updateVideoSource() {
  var video = document.querySelector('.mainbanner');
  if (!video) return;
  var source = video.querySelector('source');
  // Adjust the source as needed for mobile vs desktop
  if (window.innerWidth < 768) {
    source.src = "assets/pyexpopcbanner.webm"; // Mobile version
  } else {
    source.src = "assets/pyexpopcbanner.webm"; // Desktop version
  }
  video.load();
}

document.addEventListener("DOMContentLoaded", updateVideoSource);
window.addEventListener("resize", updateVideoSource);

// When the window fully loads, wait 1.5 seconds, then fade out loader
window.addEventListener("load", function () {
  setTimeout(function () {
    var loaderOverlay = document.querySelector(".preloader");
    if (loaderOverlay) {
      loaderOverlay.classList.add("fade-out");

      // Wait for transition to complete before hiding it
      loaderOverlay.addEventListener("transitionend", function () {
        loaderOverlay.style.display = "none";
      }, { once: true });
    }

    // Show and play the video smoothly
    var video = document.querySelector(".mainbanner");
    if (video) {
      video.style.display = "block";
      video.play();
    }

    // Re-enable scrolling
    document.body.style.overflow = "auto";
  }, 100); // Adjust delay if needed
});

document.addEventListener("DOMContentLoaded", function () {
  const marquee = document.querySelector(".instagram-marquee");
  const scrollSpeed = 1; // pixels per interval
  const intervalTime = 20; // milliseconds per interval
  let autoScrollInterval = null;
  
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      // If not at the end, increment scrollLeft
      if (marquee.scrollLeft < marquee.scrollWidth - marquee.clientWidth) {
        marquee.scrollLeft += scrollSpeed;
      } else {
        // Reached the end—stop the auto-scroll
        clearInterval(autoScrollInterval);
      }
    }, intervalTime);
  }
  
  // Start auto-scrolling once DOM is loaded
  startAutoScroll();
  
  // Optional: Pause auto-scroll on hover and resume on mouse leave
  marquee.addEventListener("mouseenter", () => {
    clearInterval(autoScrollInterval);
  });
  marquee.addEventListener("mouseleave", () => {
    // Only resume if not already at the end
    if (marquee.scrollLeft < marquee.scrollWidth - marquee.clientWidth) {
      startAutoScroll();
    }
  });
});
