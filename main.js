/* ==========================================================================
   UNWRAPPED - INTERACTIVE LOGIC (CLEAN SCROLL EDITION)
   ========================================================================== */

// 1. Configuration & Constants
const TOTAL_FRAMES = 241;
const FRAME_PREFIX = './frames/ezgif-frame-';
const FRAME_SUFFIX = '.jpg';

// BOPP Animation configuration
const BOPP_TOTAL_FRAMES = 196;
const BOPP_START_FRAME = 6;
const BOPP_FRAME_PREFIX = './bopp-frames/ezgif-frame-';
const BOPP_FRAME_SUFFIX = '.jpg';

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

// BOPP Element Selectors
const boppCanvas = document.getElementById('bopp-canvas');
const boppCtx = boppCanvas ? boppCanvas.getContext('2d') : null;
const boppSection = document.getElementById('bopp-showcase');
const boppText1 = document.getElementById('bopp-text-1');
const boppText2 = document.getElementById('bopp-text-2');
const boppText3 = document.getElementById('bopp-text-3');

// 3. Application State
const images = [];
const boppImages = [];
let loadedCount = 0;
let isLoaded = false;
let boppLastImg1, boppLastImg2;

// Total images to load in preloader (includes 2 final custom BOPP showcase images)
const GLOBAL_TOTAL_IMAGES = TOTAL_FRAMES + BOPP_TOTAL_FRAMES + 2;

// Scroll & Lerp variables for main Butter Paper animation
let scrollPercent = 0;
let targetFrame = 1;
let currentFrame = 1;

// Scroll & Lerp variables for BOPP animation
let boppProgress = 0;
let boppTargetFrame = 6;
let boppCurrentFrame = 6;

// 4. Image Preloading Phase (Parallel loading for both main and BOPP frames)
const preloadImages = () => {
  return new Promise((resolve) => {
    // Helper to increment loader and resolve
    const onImageLoaded = () => {
      loadedCount++;
      const percent = Math.floor((loadedCount / GLOBAL_TOTAL_IMAGES) * 100);
      progressBar.style.width = `${percent}%`;
      progressText.textContent = `${percent}%`;
      
      if (loadedCount === GLOBAL_TOTAL_IMAGES) {
        isLoaded = true;
        setTimeout(() => {
          preloader.classList.add('fade-out');
          resolve();
        }, 600);
      }
    };
    
    const onImageError = (filename) => {
      console.error(`Failed to load image: ${filename}`);
      onImageLoaded(); // Continue loading to not block the page
    };

    // 1. Preload Main Frames (1 to 241)
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const filename = `${FRAME_PREFIX}${pad(i)}${FRAME_SUFFIX}`;
      img.onload = onImageLoaded;
      img.onerror = () => onImageError(filename);
      img.src = filename;
      images[i - 1] = img;
    }

    // 2. Preload BOPP Frames (006 to 201)
    for (let i = 0; i < BOPP_TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = BOPP_START_FRAME + i;
      const filename = `${BOPP_FRAME_PREFIX}${pad(frameNum)}${BOPP_FRAME_SUFFIX}`;
      img.onload = onImageLoaded;
      img.onerror = () => onImageError(filename);
      img.src = filename;
      boppImages[i] = img;
    }

    // 3. Preload Final Custom BOPP Showcase Images
    boppLastImg1 = new Image();
    boppLastImg1.onload = onImageLoaded;
    boppLastImg1.onerror = () => onImageError('./bopp-last-1.jpg');
    boppLastImg1.src = './bopp-last-1.jpg';

    boppLastImg2 = new Image();
    boppLastImg2.onload = onImageLoaded;
    boppLastImg2.onerror = () => onImageError('./bopp-last-2.jpg');
    boppLastImg2.src = './bopp-last-2.jpg';
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

// 6. BOPP Canvas Drawing & Calibration
const drawBoppFrame = (frameIndex) => {
  if (!boppCanvas || !boppCtx) return;
  const index = Math.min(BOPP_TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIndex - BOPP_START_FRAME)));
  
  const w = window.innerWidth;
  const h = window.innerHeight;
  boppCanvas.width = w;
  boppCanvas.height = h;

  // Check if we are rendering the very last frame (index 195, corresponding to frame 201)
  if (index === BOPP_TOTAL_FRAMES - 1 && boppLastImg1 && boppLastImg2 && boppLastImg1.complete && boppLastImg2.complete) {
    boppCtx.clearRect(0, 0, w, h);
    
    // Responsive: side-by-side on desktop, stacked on mobile
    if (w > 768) {
      // DESKTOP: Side-by-side split screen
      const halfW = w / 2;
      
      // Left half: draw boppLastImg1 (WhatsApp Image 1)
      drawCoverImage(boppCtx, boppLastImg1, 0, 0, halfW, h);
      
      // Right half: draw boppLastImg2 (WhatsApp Image 2)
      drawCoverImage(boppCtx, boppLastImg2, halfW, 0, halfW, h);
      
      // Elegant vertical glassmorphic divider
      boppCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      boppCtx.lineWidth = 4;
      boppCtx.beginPath();
      boppCtx.moveTo(halfW, 0);
      boppCtx.lineTo(halfW, h);
      boppCtx.stroke();
    } else {
      // MOBILE: Stacked vertically
      const halfH = h / 2;
      
      // Top half: draw boppLastImg1 (WhatsApp Image 1)
      drawCoverImage(boppCtx, boppLastImg1, 0, 0, w, halfH);
      
      // Bottom half: draw boppLastImg2 (WhatsApp Image 2)
      drawCoverImage(boppCtx, boppLastImg2, 0, halfH, w, halfH);
      
      // Elegant horizontal glassmorphic divider
      boppCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      boppCtx.lineWidth = 4;
      boppCtx.beginPath();
      boppCtx.moveTo(0, halfH);
      boppCtx.lineTo(w, halfH);
      boppCtx.stroke();
    }
    return;
  }

  let img = boppImages[index];
  
  // High-performance complete-frame rendering fallback to prevent flickering
  if (!img || !img.complete || img.naturalWidth === 0) {
    let found = false;
    for (let offset = 1; offset < BOPP_TOTAL_FRAMES; offset++) {
      const prevImg = boppImages[index - offset];
      if (prevImg && prevImg.complete && prevImg.naturalWidth > 0) {
        img = prevImg;
        found = true;
        break;
      }
      const nextImg = boppImages[index + offset];
      if (nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
        img = nextImg;
        found = true;
        break;
      }
    }
    if (!found) return; // Wait until at least one frame is loaded
  }

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
  boppCtx.clearRect(0, 0, w, h);
  boppCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
};

// Helper function to draw an image covering a sub-rectangle on the canvas (object-fit: cover)
const drawCoverImage = (context, img, dx, dy, dw, dh) => {
  const imgWidth = img.naturalWidth || img.width;
  const imgHeight = img.naturalHeight || img.height;
  const imgRatio = imgWidth / imgHeight;
  const destRatio = dw / dh;
  
  let sx, sy, sw, sh;
  
  if (destRatio > imgRatio) {
    // Destination is wider than image aspect ratio, crop height
    sw = imgWidth;
    sh = imgWidth / destRatio;
    sx = 0;
    sy = (imgHeight - sh) / 2;
  } else {
    // Destination is taller than image aspect ratio, crop width
    sh = imgHeight;
    sw = imgHeight * destRatio;
    sx = (imgWidth - sw) / 2;
    sy = 0;
  }
  
  context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
};

// 7. Scroll Position Tracking & UI Sync
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

  // Calculate BOPP scroll scrubbing progress
  if (boppSection) {
    const rect = boppSection.getBoundingClientRect();
    const sectionHeight = boppSection.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollDepth = sectionHeight - windowHeight;
    
    if (rect.top <= 0) {
      // Section is in view / active scroll
      boppProgress = Math.min(1, Math.max(0, -rect.top / scrollDepth));
    } else {
      boppProgress = 0;
    }
    
    boppTargetFrame = BOPP_START_FRAME + Math.floor(boppProgress * (BOPP_TOTAL_FRAMES - 1));
  }
};

// 8. Continuous Animation Loop (lerp & requestAnimationFrame)
const tick = () => {
  if (isLoaded) {
    // 8.1 Main Butter Paper animation scrubbing
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

    // Premium 3D Transform entry scroll animation
    const entryProgress = Math.min(1, smoothPercent / 0.45);
    const rotX = 12 * (1 - entryProgress);  // pivots down from 12deg to 0deg
    const rotY = -8 * (1 - entryProgress); // pivots sideways from -8deg to 0deg
    const scale = 0.88 + 0.12 * entryProgress; // scales up from 0.88 to 1.00
    canvas.style.transform = `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;

    // Headings Fade and Float Up (fades out completely at 40% scroll)
    if (smoothPercent <= 0.40) {
      const fadeProgress = smoothPercent / 0.40;
      heroOverlay.style.opacity = 1 - fadeProgress;
      heroOverlay.style.transform = `translate(-50%, -50%) translateY(${-fadeProgress * 65}px) scale(${1 - fadeProgress * 0.08})`;
      heroOverlay.style.pointerEvents = 'auto';
    } else {
      heroOverlay.style.opacity = 0;
      heroOverlay.style.pointerEvents = 'none';
    }

    // 8.2 BOPP Scroll Scrubbing & Smooth Lerp
    if (boppSection) {
      const boppFrameDiff = boppTargetFrame - boppCurrentFrame;
      if (Math.abs(boppFrameDiff) > 0.05) {
        boppCurrentFrame += boppFrameDiff * 0.07;
      } else {
        boppCurrentFrame = boppTargetFrame;
      }
      
      // Draw frame onto canvas
      drawBoppFrame(boppCurrentFrame);
      
      // Smooth lerped progress
      const smoothBoppPercent = (boppCurrentFrame - BOPP_START_FRAME) / (BOPP_TOTAL_FRAMES - 1);
      
      // BOPP 3D Entry/Exit Perspective Transformations
      let boppEntryProgress = 1;
      if (smoothBoppPercent < 0.15) {
        boppEntryProgress = smoothBoppPercent / 0.15; // entry scale
      } else if (smoothBoppPercent > 0.85) {
        boppEntryProgress = (1 - smoothBoppPercent) / 0.15; // exit scale
      }
      
      const boppRotX = 12 * (1 - boppEntryProgress);
      const boppRotY = -8 * (1 - boppEntryProgress);
      const boppScale = 0.88 + 0.12 * boppEntryProgress;
      if (boppCanvas) {
        boppCanvas.style.transform = `translate(-50%, -50%) rotateX(${boppRotX}deg) rotateY(${boppRotY}deg) scale(${boppScale})`;
      }

      // BOPP Sequential Heading Text Triggers
      if (smoothBoppPercent > 0.08 && smoothBoppPercent < 0.35) {
        boppText1.classList.add('active');
      } else {
        boppText1.classList.remove('active');
      }

      if (smoothBoppPercent >= 0.38 && smoothBoppPercent < 0.68) {
        boppText2.classList.add('active');
      } else {
        boppText2.classList.remove('active');
      }

      if (smoothBoppPercent >= 0.71 && smoothBoppPercent < 0.95) {
        boppText3.classList.add('active');
      } else {
        boppText3.classList.remove('active');
      }
    }
  }
  
  requestAnimationFrame(tick);
};

// 9. Initialization Engine
const init = async () => {
  // Preload and monitor image loads
  await preloadImages();
  
  // Size Canvases to screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  if (boppCanvas) {
    boppCanvas.width = window.innerWidth;
    boppCanvas.height = window.innerHeight;
  }
  
  // Render introductory default frames
  drawFrame(1);
  drawBoppFrame(BOPP_START_FRAME);
  
  // Set up event listeners
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', () => {
    drawFrame(currentFrame);
    drawBoppFrame(boppCurrentFrame);
  });
  
  // Run animation ticker
  requestAnimationFrame(tick);
  
  // Lucide icon replacement initialization
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
};

// Run Setup on page load
window.addEventListener('DOMContentLoaded', init);
