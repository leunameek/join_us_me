<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  // ============================================================
  // CHECKPOINT H — Project data
  // Edit titles, types, years, and colors here.
  // Colors available: #E42D3F #FF1132 #FF5256 #0063D3 #0077D3 #0087D4
  // Layout keys: 'wide' (2 col) | 'tall' (2 row) | 'xwide' (3 col) | 'normal'
  // ============================================================
  const projects = [
    { id: '01', title: 'Echoes',       type: 'Interactive Documentary', year: '2024', color: '#E42D3F', layout: 'wide'   },
    { id: '02', title: 'Neon Pulse',   type: 'Motion Graphics Reel',    year: '2024', color: '#0063D3', layout: 'normal' },
    { id: '03', title: 'The Void',     type: 'Generative Art',          year: '2023', color: '#FF1132', layout: 'tall'   },
    { id: '04', title: 'Signal Lost',  type: 'Podcast Series',          year: '2024', color: '#0077D3', layout: 'normal' },
    { id: '05', title: 'Parallel',     type: 'AR Experience',           year: '2023', color: '#FF5256', layout: 'wide'   },
    { id: '06', title: 'Chromatic',    type: 'Live VJ Performance',     year: '2024', color: '#0087D4', layout: 'wide'   },
    { id: '07', title: 'Fragments',    type: 'Animated Short Film',     year: '2023', color: '#E42D3F', layout: 'normal' },
    { id: '08', title: 'Static',       type: 'Sound Design Portfolio',  year: '2024', color: '#0063D3', layout: 'normal' },
    { id: '09', title: 'Prism',        type: 'Digital Exhibition',      year: '2023', color: '#FF1132', layout: 'normal' },
    { id: '10', title: 'Drift',        type: 'Experimental Video Art',  year: '2024', color: '#0077D3', layout: 'xwide'  },
  ];

  // ============================================================
  // CHECKPOINT H — Bounce animation feel
  // ELASTIC_STRENGTH : bounciness (1 = default, higher = more bounce)
  // ELASTIC_PERIOD   : oscillation speed (lower = snappier bounce)
  // STAGGER_AMOUNT   : total seconds spread across all cards
  // ============================================================
  const ELASTIC_STRENGTH = 1;
  const ELASTIC_PERIOD   = 0.4;
  const STAGGER_AMOUNT   = 0.7;

  // ============================================================
  // CHECKPOINT H — Trigger offset
  // Passed in from App.svelte as (40 * PX_PER_UNIT) pixels.
  // Controls how far past the last animation frame the user must
  // scroll before the showcase animates in.
  // The same value is added as padding-top so content aligns
  // exactly with the viewport when the trigger fires.
  // ============================================================
  let { triggerOffsetPx = 0 } = $props();

  let section;

  onMount(() => {
    const E = ELASTIC_STRENGTH;
    const P = ELASTIC_PERIOD;

    const ctx = gsap.context(() => {
      // Single timeline — all animations share one ScrollTrigger so
      // everything fires together at exactly the right scroll position.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger : section,
          // Fires when the point `triggerOffsetPx` below the section
          // top reaches the viewport top — i.e., exactly 40 scroll
          // units after the last animation frame ends.
          start   : `top+=${triggerOffsetPx} top`,
          once    : true, // play once; won't re-trigger on scroll back
        },
      });

      // ── Header sequence ──────────────────────────────────────
      tl.from('.sh-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.9,
        ease: 'expo.out',
      })
      .from('.sh-headline', {
        y: -80,
        opacity: 0,
        duration: 1.1,
        ease: `elastic.out(${E}, ${P})`,
      }, '<')
      .from('.sh-sub', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      }, '<0.15');

      // Count ticks up alongside the header
      const countEl = section.querySelector('.sh-count');
      if (countEl) {
        const proxy = { val: 0 };
        tl.to(proxy, {
          val: 10,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate() { countEl.textContent = String(Math.round(proxy.val)).padStart(2, '0'); },
        }, '<');
      }

      // ── Cards stagger bounce ─────────────────────────────────
      tl.from('.project-card', {
        y: 120,
        scale: 0.75,
        opacity: 0,
        duration: 1,
        ease: `elastic.out(${E}, ${P})`,
        stagger: { amount: STAGGER_AMOUNT, from: 'start' },
      }, '<0.2');

    }, section);

    return () => ctx.revert();
  });
</script>

<section bind:this={section} class="showcase" style:padding-top="{triggerOffsetPx + 120}px">

  <!-- ============================================================
       Header
  ============================================================ -->
  <div class="sh-header">
    <div class="sh-top-row">
      <span class="sh-label">Selected Works</span>
      <div class="sh-line"></div>
      <span class="sh-count">00</span>
    </div>
    <h2 class="sh-headline">Multimedia<br/>Engineering</h2>
    <p class="sh-sub">A collection of projects spanning interaction, motion, sound, and space — 2023 / 2024</p>
  </div>

  <!-- ============================================================
       CHECKPOINT H — Project grid
       Layout is defined via CSS classes driven by project.layout.
       Grid is 4 columns. See .layout-* rules in <style> below.
  ============================================================ -->
  <div class="project-grid">
    {#each projects as p}
      <article
        class="project-card layout-{p.layout}"
        style:--card-color={p.color}
      >
        <span class="card-id">{p.id}</span>
        <div class="card-body">
          <h3 class="card-title">{p.title}</h3>
        </div>
        <div class="card-footer">
          <span class="card-type">{p.type}</span>
          <span class="card-year">{p.year}</span>
        </div>
        <!-- Decorative circle — adds depth without clutter -->
        <div class="card-deco" aria-hidden="true"></div>
      </article>
    {/each}
  </div>

</section>

<style>
  .showcase {
    padding: 120px 60px 160px;
    background: #fff;
    min-height: 100vh;
  }

  /* ── Header ─────────────────────────────────────────────── */
  .sh-header {
    margin-bottom: 64px;
    max-width: 900px;
  }

  .sh-top-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }

  .sh-label {
    font-family: system-ui, sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #999;
    white-space: nowrap;
  }

  .sh-line {
    flex: 1;
    height: 1px;
    background: #ddd;
  }

  .sh-count {
    font-family: monospace;
    font-size: 0.75rem;
    color: #bbb;
    letter-spacing: 0.05em;
  }

  .sh-headline {
    margin: 0 0 20px;
    font-family: system-ui, sans-serif;
    font-size: clamp(3.5rem, 7vw, 7rem);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.03em;
    color: #0a0a0a;
  }

  .sh-sub {
    margin: 0;
    font-family: system-ui, sans-serif;
    font-size: 0.95rem;
    color: #888;
    max-width: 520px;
    line-height: 1.6;
  }

  /* ── Grid ───────────────────────────────────────────────── */
  .project-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 260px;
    gap: 16px;
  }

  /* ============================================================
     CHECKPOINT H — Layout variants
     Adjust column/row spans here if you change the grid.
  ============================================================ */
  .layout-normal { /* 1×1 — default, no extra rules needed */ }
  .layout-wide   { grid-column: span 2; }
  .layout-tall   { grid-row:    span 2; }
  .layout-xwide  { grid-column: span 3; }

  /* ── Card ───────────────────────────────────────────────── */
  .project-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    border-radius: 20px;
    background: var(--card-color);
    color: #fff;
    overflow: hidden;
    cursor: default;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.25s ease;
  }

  /* Hover: mini bounce via cubic-bezier overshoot */
  .project-card:hover {
    transform: scale(1.025) translateY(-4px);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
  }

  .card-id {
    font-family: monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    opacity: 0.55;
    align-self: flex-start;
  }

  .card-body {
    flex: 1;
    display: flex;
    align-items: flex-end;
    padding-bottom: 12px;
  }

  .card-title {
    margin: 0;
    font-family: system-ui, sans-serif;
    font-size: clamp(1.6rem, 2.8vw, 2.4rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;
    position: relative;
    z-index: 1;
  }

  .card-type {
    font-family: system-ui, sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.75;
  }

  .card-year {
    font-family: monospace;
    font-size: 0.75rem;
    opacity: 0.55;
    white-space: nowrap;
  }

  /* Decorative circle — large semi-transparent shape in corner */
  .card-deco {
    position: absolute;
    bottom: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }

  /* Second smaller circle via ::after */
  .project-card::before {
    content: '';
    position: absolute;
    top: -20px;
    right: 60px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    pointer-events: none;
  }
</style>
