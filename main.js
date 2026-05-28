/* ==========================================================================
   UNWRAPPED - INTERACTIVE LOGIC (CLEAN SCROLL EDITION)
   ========================================================================== */

// 1. Configuration & Constants
const TOTAL_FRAMES = 241;
const FRAME_PREFIX = './frames/ezgif-frame-';
const FRAME_SUFFIX = '.jpg';

// Pad frame number helper (e.g. 1 -> "001")
const pad = (num, size = 3) => {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

// 2. Element Selectors
const preloader = document.getElementById('preloader');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');
const scrollTrackerBar = document.getElementById('scroll-tracker-bar');
const heroOverlay = document.getElementById('hero-text-overlay');

// 3. Application State
const images = [];
let loadedCount = 0;
let isLoaded = false;

// Scroll & Lerp variables for ultra-smooth buttery scrubbing
let scrollPercent = 0;
let targetFrame = 1;
let currentFrame = 1;

// 4. Image Preloading Phase
const preloadImages = () => {
  return new Promise((resolve) => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const filename = `${FRAME_PREFIX}${pad(i)}${FRAME_SUFFIX}`;
      
      img.onload = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        
        // Update preloader UI
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`;
        
        if (loadedCount === TOTAL_FRAMES) {
          isLoaded = true;
          setTimeout(() => {
            // Fade out preloader beautifully
            preloader.classList.add('fade-out');
            resolve();
          }, 600);
        }
      };
      
      img.onerror = () => {
        console.error(`Failed to load frame: ${filename}`);
        // Handle error gracefully to not freeze loader
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          isLoaded = true;
          preloader.classList.add('fade-out');
          resolve();
        }
      };
      
      img.src = filename;
      images[i - 1] = img; // Preassign by index to guarantee perfect chronological order
    }
  });
};

// 5. Canvas Drawing & Aspect Ratio Calibration
const drawFrame = (frameIndex) => {
  const index = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameIndex)));
  let img = images[index - 1];
  
  // High-performance complete-frame rendering fallback to prevent flickering
  if (!img || !img.complete || img.naturalWidth === 0) {
    let found = false;
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prevImg = images[index - 1 - offset];
      if (prevImg && prevImg.complete && prevImg.naturalWidth > 0) {
        img = prevImg;
        found = true;
        break;
      }
      const nextImg = images[index - 1 + offset];
      if (nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
        img = nextImg;
        found = true;
        break;
      }
    }
    if (!found) return; // Wait until at least one frame is loaded
  }

  // Size canvas dynamically to fit parent viewport
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  // Perform "object-fit: cover" calculations for Canvas rendering
  const imgWidth = img.naturalWidth || img.width || 1280;
  const imgHeight = img.naturalHeight || img.height || 720;
  
  const imgRatio = imgWidth / imgHeight;
  const screenRatio = w / h;
  
  let drawWidth, drawHeight, drawX, drawY;
  
  if (screenRatio > imgRatio) {
    // Screen is wider than image aspect ratio
    drawWidth = w;
    drawHeight = w / imgRatio;
    drawX = 0;
    drawY = (h - drawHeight) / 2;
  } else {
    // Screen is taller than image aspect ratio
    drawHeight = h;
    drawWidth = h * imgRatio;
    drawX = (w - drawWidth) / 2;
    drawY = 0;
  }
  
  // Clear canvas and draw new centered frame
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
};

// 6. Scroll Position Tracking & UI Sync
const getScrollPercent = () => {
  const scrollY = window.scrollY || window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;
  return scrollY / maxScroll;
};

const handleScroll = () => {
  scrollPercent = getScrollPercent();
  
  // Calculate Target Frame based on scroll percent
  targetFrame = Math.floor(scrollPercent * (TOTAL_FRAMES - 1)) + 1;
  
  // Sync top scroll-tracker bar
  scrollTrackerBar.style.width = `${scrollPercent * 100}%`;
};

// 7. Continuous Animation Loop (lerp & requestAnimationFrame)
const tick = () => {
  if (isLoaded) {
    // Smooth linear interpolation
    // Interpolate current frame closer to target frame (lerp factor: 0.07 for ultra-smooth buttery glide)
    const frameDiff = targetFrame - currentFrame;
    
    if (Math.abs(frameDiff) > 0.05) {
      currentFrame += frameDiff * 0.07;
    } else {
      currentFrame = targetFrame;
    }
    
    // Draw frame onto canvas
    drawFrame(currentFrame);

    // Compute lerped smooth scroll percentage (synced with frame glide)
    const smoothPercent = (currentFrame - 1) / (TOTAL_FRAMES - 1);

    // 7.1 Premium 3D Transform entry scroll animation
    const entryProgress = Math.min(1, smoothPercent / 0.45);
    const rotX = 12 * (1 - entryProgress);  // pivots down from 12deg to 0deg
    const rotY = -8 * (1 - entryProgress); // pivots sideways from -8deg to 0deg
    const scale = 0.88 + 0.12 * entryProgress; // scales up from 0.88 to 1.00
    canvas.style.transform = `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;

    // 7.2 Headings Fade and Float Up (fades out completely at 40% scroll)
    if (smoothPercent <= 0.40) {
      const fadeProgress = smoothPercent / 0.40;
      heroOverlay.style.opacity = 1 - fadeProgress;
      heroOverlay.style.transform = `translate(-50%, -50%) translateY(${-fadeProgress * 65}px) scale(${1 - fadeProgress * 0.08})`;
      heroOverlay.style.pointerEvents = 'auto';
    } else {
      heroOverlay.style.opacity = 0;
      heroOverlay.style.pointerEvents = 'none';
    }
  }
  
  requestAnimationFrame(tick);
};

// 8. Initialization Engine
const init = async () => {
  // Preload and monitor image loads
  await preloadImages();
  
  // Size Canvas to screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Render introductory default frame
  drawFrame(1);
  
  // Set up event listeners
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', () => drawFrame(currentFrame));
  
  // Run animation ticker
  requestAnimationFrame(tick);
  
  // Lucide icon replacement initialization
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
};

// Run Setup on page load
window.addEventListener('DOMContentLoaded', init);
