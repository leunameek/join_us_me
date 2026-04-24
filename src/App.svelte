<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Showcase from './lib/Showcase.svelte';
  import Footer from './lib/Footer.svelte';

  gsap.registerPlugin(ScrollTrigger);

  // ============================================================
  // CHECKPOINT A — Frame source configuration
  // ============================================================
  const TOTAL_FRAMES = 720;
  const FRAME_PATH   = '/frames/';
  const FRAME_PREFIX = 'cards arriving_';
  const FRAME_EXT    = '.png';

  // ============================================================
  // CHECKPOINT B — Scene boundaries (for reference / callbacks)
  // scene1 : 0   → 93   (94 frames)
  // scene2 : 94  → 165  (72 frames)
  // scene3 : 166 → 719  (554 frames)
  // ============================================================
  const SCENES = {
    scene1: { start: 0,   end: 93  },
    scene2: { start: 94,  end: 165 },
    scene3: { start: 166, end: 719 },
  };

  // ============================================================
  // CHECKPOINT C — Global scroll feel
  //
  // UNITS_PER_FRAME : base scroll units consumed per frame.
  //   This is the global default — overrides go in Checkpoint G.
  //
  // UNITS_PER_SECOND : how many scroll units equal one "second"
  //   of hold time. Raise to make holds longer, lower to shorten.
  //   Rule of thumb: UNITS_PER_SECOND ≈ 10 × UNITS_PER_FRAME
  //   gives a noticeable but not exhausting pause.
  //
  // PX_PER_UNIT : actual browser pixels per scroll unit.
  //   Raise to slow the whole animation down, lower to speed up.
  //
  // SCRUB_SMOOTHING : 0 = instant frame response on scroll,
  //   higher = more lag/easing feel (0.5 – 1 is a sweet spot).
  // ============================================================
  const UNITS_PER_FRAME  = 2;
  const UNITS_PER_SECOND = 20;
  const PX_PER_UNIT      = 5;
  const SCRUB_SMOOTHING  = 0.6;

  // ============================================================
  // CHECKPOINT D — Dynamic background
  // ============================================================
  const BG_BLUR       = 80;
  const BG_BRIGHTNESS = 0.40;
  const BG_SATURATE   = 1.4;
  const BG_SCALE      = 1.08;

  // ============================================================
  // CHECKPOINT G — Per-frame timing overrides
  //
  // Two entry types:
  //
  //   Hold — freeze on a specific frame for N seconds of scroll:
  //     { frame: <index>, holdSeconds: <number> }
  //
  //   Rate — change scroll speed for a frame range:
  //     { start: <index>, end: <index>, unitsPerFrame: <number> }
  //     Higher unitsPerFrame = more scroll needed = slower playback.
  //
  // Entries are applied in order; later entries win on overlap.
  // ============================================================
  const TIMING_OVERRIDES = [
    // Scene 1 — pause on frame 70 so text can be read
    { frame: 70,  holdSeconds: 8 },

    // Transition zone between scene 1 and mid-scene 2 — slightly slower
    { start: 93,  end: 144, unitsPerFrame: 5 },

    // Scene 3 — four key frames that need reading time
    { frame: 254, holdSeconds: 8 },
    { frame: 299, holdSeconds: 8 },
    { frame: 342, holdSeconds: 8 },
    { frame: 385, holdSeconds: 8 },

    // Late scene 3 — another hold
    { frame: 573, holdSeconds: 8 },
  ];

  // -- internal state --
  let container        = $state(null);
  let canvas           = $state(null);
  let bgCanvas         = $state(null);
  let canvasCtx;
  let bgCtx;
  let images           = [];
  let isLoaded         = $state(false);
  let loadProgress     = $state(0);
  let currentFrameName = $state('');

  // ============================================================
  // Scroll map — built once after constants are set.
  //
  // scrollAt[i] = cumulative scroll units when frame i first appears.
  // scrollAt[TOTAL_FRAMES] = grand total scroll units.
  //
  // Each frame occupies:  rateTable[i] + holdTable[i]  units.
  // ============================================================
  function buildScrollMap() {
    const rateTable = new Float64Array(TOTAL_FRAMES).fill(UNITS_PER_FRAME);
    const holdTable = new Float64Array(TOTAL_FRAMES);

    for (const o of TIMING_OVERRIDES) {
      if ('unitsPerFrame' in o) {
        for (let f = o.start; f <= o.end; f++) rateTable[f] = o.unitsPerFrame;
      }
      if ('holdSeconds' in o) {
        holdTable[o.frame] = o.holdSeconds * UNITS_PER_SECOND;
      }
    }

    const scrollAt = new Float64Array(TOTAL_FRAMES + 1);
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      scrollAt[i + 1] = scrollAt[i] + rateTable[i] + holdTable[i];
    }
    return scrollAt;
  }

  // Binary search: given scroll position s, return frame index.
  function scrollPosToFrame(s, scrollAt) {
    let lo = 0, hi = TOTAL_FRAMES - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (scrollAt[mid] <= s) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  }

  const scrollAt = buildScrollMap();
  const totalScrollPx = scrollAt[TOTAL_FRAMES] * PX_PER_UNIT;

  function padFrame(n) {
    return String(n).padStart(5, '0');
  }

  function getFrameSrc(i) {
    return FRAME_PATH + encodeURIComponent(`${FRAME_PREFIX}${padFrame(i)}`) + FRAME_EXT;
  }

  function drawFrame(index) {
    const i = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
    if (!images[i]?.complete) return;

    currentFrameName = `${FRAME_PREFIX}${padFrame(i)}${FRAME_EXT}`;

    if (canvasCtx) {
      canvasCtx.clearRect(0, 0, 1920, 1080);
      canvasCtx.drawImage(images[i], 0, 0, 1920, 1080);
    }

    if (bgCtx) {
      bgCtx.clearRect(0, 0, 192, 108);
      bgCtx.drawImage(images[i], 0, 0, 192, 108);
    }
  }

  function preloadImages() {
    return new Promise((resolve) => {
      let settled = 0;
      images = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
        const img    = new Image();
        img.src      = getFrameSrc(i);
        const onDone = () => {
          settled++;
          loadProgress = Math.round((settled / TOTAL_FRAMES) * 100);
          if (settled === TOTAL_FRAMES) resolve();
        };
        img.onload  = onDone;
        img.onerror = onDone;
        return img;
      });
    });
  }

  onMount(() => {
    canvasCtx = canvas.getContext('2d');
    bgCtx     = bgCanvas.getContext('2d');
    let gsapCtx;

    preloadImages().then(() => {
      isLoaded = true;
      drawFrame(0);

      gsapCtx = gsap.context(() => {
        // ============================================================
        // CHECKPOINT E — ScrollTrigger wiring
        // end is now derived from the scroll map so all timing
        // overrides in Checkpoint G are automatically accounted for.
        // ============================================================
        ScrollTrigger.create({
          trigger     : container,
          start       : 'top top',
          end         : `+=${totalScrollPx}`,
          pin         : true,
          scrub       : SCRUB_SMOOTHING,
          anticipatePin: 1,
          onUpdate(self) {
            const pos   = self.progress * scrollAt[TOTAL_FRAMES];
            const frame = scrollPosToFrame(pos, scrollAt);
            drawFrame(frame);

            // ============================================================
            // CHECKPOINT F — Per-scene side effects
            // ============================================================
            // if (frame === SCENES.scene2.start) { /* entering scene 2 */ }
            // if (frame === SCENES.scene3.start) { /* entering scene 3 */ }
          },
        });
      }, container);
    });

    return () => gsapCtx?.revert();
  });
</script>

<div bind:this={container} class="scene-root">

  <canvas
    bind:this={bgCanvas}
    width="192"
    height="108"
    class="bg-canvas"
    class:hidden={!isLoaded}
    style:filter="blur({BG_BLUR}px) brightness({BG_BRIGHTNESS}) saturate({BG_SATURATE})"
    style:transform="scale({BG_SCALE})"
  ></canvas>

  {#if !isLoaded}
    <div class="loader">
      <span class="loader-label">Loading</span>
      <div class="progress-track">
        <div class="progress-bar" style:width="{loadProgress}%"></div>
      </div>
      <span class="progress-pct">{loadProgress}%</span>
    </div>
  {/if}

  <canvas
    bind:this={canvas}
    width="1920"
    height="1080"
    class="frame-canvas"
    class:hidden={!isLoaded}
  ></canvas>

  <!-- DEBUG: remove when timing corrections are done -->
  <!-- {#if isLoaded}
    <div class="debug-label">{currentFrameName}</div>
  {/if} -->

</div>

<Showcase triggerOffsetPx={40 * PX_PER_UNIT} />
<Footer />

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    background: #ffffff;
    overflow-x: hidden;
  }

  .scene-root {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #ffffff; /* CHECKPOINT D: white behind the blurred glow */
    overflow: hidden;
  }

  .bg-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform-origin: center center;
    z-index: 0;
  }

  /* ============================================================
     CHECKPOINT D — Main canvas sizing
     16:9 letterbox. Swap to width:100vw; height:100vh to fill.
  ============================================================ */
  .frame-canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 100vw;
    height: 56.25vw;
    max-height: 100vh;
    max-width: 177.78vh;
  }

  .bg-canvas.hidden,
  .frame-canvas.hidden {
    visibility: hidden;
  }

  .loader {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: #ffffff;
    font-family: system-ui, sans-serif;
    letter-spacing: 0.12em;
  }

  .loader-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    opacity: 0.4;
  }

  .progress-track {
    width: 220px;
    height: 1px;
    background: rgba(255, 255, 255, 0.15);
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: #ffffff;
    transition: width 0.08s linear;
  }

  .progress-pct {
    font-size: 0.65rem;
    opacity: 0.3;
    font-variant-numeric: tabular-nums;
  }

  /* DEBUG label — delete with its template block when done */
  .debug-label {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-family: monospace;
    font-size: 0.8rem;
    padding: 4px 12px;
    border-radius: 4px;
    pointer-events: none;
    white-space: nowrap;
  }
</style>
