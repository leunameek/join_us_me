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
    { id: '01', title: 'Shattered Dimensions', type: 'Videogame', year: '2025', color: '#E42D3F', layout: 'wide', href: 'https://youtu.be/Edkg-3UX678' },
    { id: '02', title: 'Signal Loss',  type: 'Interactive VR experience', year: '2026', color: '#0063D3', layout: 'normal', href: 'https://youtu.be/i9O02UTwz-4' },
    { id: '03', title: 'Todo pasa',    type: 'Animation',               year: '2024', color: '#FF1132', layout: 'tall', href: 'https://youtu.be/ZJnWZPjOmAI' },
    { id: '04', title: 'El reflejo',   type: 'Short film',              year: '2025', color: '#0077D3', layout: 'normal', href: 'https://youtu.be/DU5OJZSlr9Q' },
    { id: '05', title: 'Triciclo',     type: 'Render',                  year: '2026', color: '#FF5256', layout: 'wide', href: 'https://youtu.be/Ffv9OrQj6Fs' },
    { id: '06', title: 'Idles',        type: '3D animation integration into a videogame environment', year: '2025', color: '#0087D4', layout: 'wide', href: 'https://youtu.be/RPQHx0z3Gsg?si=jSB4MHtu9R4qhdyM' },
    { id: '07', title: 'El Carcacho no Sube (prolly end up in the River)', type: '3D Animation',      year: '2025', color: '#E42D3F', layout: 'normal', href: 'https://youtu.be/Bo2mO9kCTJY' },
    { id: '08', title: 'Nissan GTR',   type: 'Render',                  year: '2026', color: '#0063D3', layout: 'normal', href: 'https://youtu.be/DDoAQwEvza4' },
    { id: '09', title: 'Incredibugs',  type: 'Videogame',               year: '2025', color: '#FF1132', layout: 'normal', href: 'https://github.com/Mael047/IncrediBugs_Game' },
    { id: '10', title: 'AntEater',     type: 'Simulation',              year: '2025', color: '#0077D3', layout: 'xwide', href: 'https://github.com/leunameek/AntEater' },
    { id: '11', title: 'Crazy Cowboy', type: 'Videogame',               year: '2025', color: '#E42D3F', layout: 'normal', href: 'https://github.com/leunameek/crazycowboy' },
    { id: '12', title: 'Koin',         type: 'Website',                 year: '2026', color: '#0063D3', layout: 'normal', href: 'https://github.com/ElViejoH/Koinpage' },
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
          val: projects.length,
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
      <span class="sh-label">Lo que crearás</span>
      <div class="sh-line"></div>
      <span class="sh-count">00</span>
    </div>
    <h2 class="sh-headline">Ingeniería<br/>En Multimedia</h2>
    <p class="sh-sub">Algunos de los proyectos de los estudiantes — 2022 / 2026</p>
  </div>

  <!-- ============================================================
       CHECKPOINT H — Project grid
       Layout is defined via CSS classes driven by project.layout.
       Grid is 4 columns. See .layout-* rules in <style> below.
  ============================================================ -->
  <div class="project-grid">
    {#each projects as p}
      {#if p.href}
        <a
          class="project-card layout-{p.layout}"
          style:--card-color={p.color}
          href={p.href}
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir {p.title} en una nueva pestaña"
        >
          <span class="card-id">{p.id}</span>
          <div class="card-body">
            <h3 class="card-title">{p.title}</h3>
          </div>
          <div class="card-footer">
            <span class="card-type">{p.type}</span>
            <span class="card-year">{p.year}</span>
          </div>
          <div class="card-deco" aria-hidden="true"></div>
        </a>
      {:else}
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
          <div class="card-deco" aria-hidden="true"></div>
        </article>
      {/if}
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
    text-decoration: none;
    isolation: isolate;
    transform: translateZ(0);
    transition:
      transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.45s ease,
      filter 0.45s ease;
  }

  a.project-card {
    cursor: pointer;
  }

  .project-card::after {
    content: '';
    position: absolute;
    inset: -55%;
    z-index: 0;
    background:
      linear-gradient(115deg, transparent 38%, rgba(255, 255, 255, 0.42) 48%, transparent 58%),
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.28), transparent 26%);
    opacity: 0;
    transform: translateX(-34%) rotate(8deg);
    transition:
      opacity 0.35s ease,
      transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
  }

  /* Hover: lifted prism sheen */
  .project-card:hover {
    transform: perspective(900px) rotateX(3deg) rotateY(-4deg) translateY(-10px) scale(1.035);
    box-shadow:
      0 28px 56px rgba(0, 0, 0, 0.22),
      0 0 0 1px rgba(255, 255, 255, 0.22) inset,
      0 0 34px color-mix(in srgb, var(--card-color) 72%, white 28%);
    filter: saturate(1.16) contrast(1.04);
  }

  .project-card:hover::after {
    opacity: 1;
    transform: translateX(34%) rotate(8deg);
  }

  .project-card:hover .card-deco {
    opacity: 0.52;
    transform: scale(1.28) translate(-10px, -8px);
  }

  .project-card:hover::before {
    opacity: 0.68;
    transform: scale(1.35) translate(-8px, 6px);
  }

  .project-card:hover .card-id,
  .project-card:hover .card-footer {
    opacity: 0.88;
  }

  .project-card:hover .card-title {
    transform: translateY(-4px);
    text-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
  }

  .card-id {
    font-family: monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    opacity: 0.55;
    align-self: flex-start;
    position: relative;
    z-index: 1;
    transition: opacity 0.25s ease;
  }

  .card-body {
    flex: 1;
    display: flex;
    align-items: flex-end;
    padding-bottom: 12px;
    position: relative;
    z-index: 1;
  }

  .card-title {
    margin: 0;
    font-family: system-ui, sans-serif;
    font-size: clamp(1.6rem, 2.8vw, 2.4rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    transition:
      transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
      text-shadow 0.45s ease;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;
    position: relative;
    z-index: 1;
    transition: opacity 0.25s ease;
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
    transition:
      opacity 0.35s ease,
      transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 0;
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
    z-index: 0;
    transition:
      opacity 0.35s ease,
      transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>
