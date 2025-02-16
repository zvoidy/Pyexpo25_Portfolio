const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("min");
const seconds = document.getElementById("sec");

const timerSet = new Date(2025, 1, 17, 10, 0, 0);

function updateCountDown(){
  const currentTime = new Date();
  const diff = timerSet - currentTime;
  const d = Math.floor(diff / 1000 / 60 / 60 / 24);
  const h = Math.floor(diff / 1000 / 60 / 60 ) % 24;
  const m = Math.floor(diff / 1000 / 60 ) % 60;
  const s = Math.floor(diff / 1000) % 60;

  days.innerHTML = d;
  hours.innerHTML = h < 10 ? '0'+ h : h;
  minutes.innerHTML = m < 10 ? '0'+ m : m;
  seconds.innerHTML = s < 10 ? '0'+ s : s;
}
setInterval(updateCountDown,1000)

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
