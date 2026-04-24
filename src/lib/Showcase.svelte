<svelte:head>
  <link rel="stylesheet" href="https://use.typekit.net/lqj2hyi.css">
</svelte:head>

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
    { id: '01', title: 'Shattered Dimensions', type: 'Videojuego', year: '2025', color: '#E42D3F', layout: 'wide', href: 'https://youtu.be/Edkg-3UX678' },
    { id: '02', title: 'Signal Loss',  type: 'Experiencia de Realidad Virtual Interactiva', year: '2026', color: '#0063D3', layout: 'normal', href: 'https://youtu.be/i9O02UTwz-4' },
    { id: '03', title: 'Todo pasa',    type: 'Animación',               year: '2024', color: '#FF1132', layout: 'tall', href: 'https://youtu.be/ZJnWZPjOmAI' },
    { id: '04', title: 'El reflejo',   type: 'Corto',              year: '2025', color: '#0077D3', layout: 'normal', href: 'https://youtu.be/DU5OJZSlr9Q' },
    { id: '05', title: 'Triciclo',     type: 'Render',                  year: '2026', color: '#FF5256', layout: 'wide', href: 'https://youtu.be/Ffv9OrQj6Fs' },
    { id: '06', title: 'Idles',        type: 'Animación 3D integrada en motor gráfico', year: '2025', color: '#0087D4', layout: 'wide', href: 'https://youtu.be/RPQHx0z3Gsg?si=jSB4MHtu9R4qhdyM' },
    { id: '07', title: 'El Carcacho no Sube (prolly end up in the River)', type: '3D Animation',      year: '2025', color: '#E42D3F', layout: 'normal', href: 'https://youtu.be/Bo2mO9kCTJY' },
    { id: '08', title: 'Nissan GTR',   type: 'Render',                  year: '2026', color: '#0063D3', layout: 'normal', href: 'https://youtu.be/DDoAQwEvza4' },
    { id: '09', title: 'Incredibugs',  type: 'Videojuego',               year: '2025', color: '#FF1132', layout: 'normal', href: 'https://github.com/Mael047/IncrediBugs_Game' },
    { id: '10', title: 'AntEater',     type: 'Simulación',              year: '2025', color: '#0077D3', layout: 'xwide', href: 'https://github.com/leunameek/AntEater' },
    { id: '11', title: 'Crazy Cowboy', type: 'Videojuego',               year: '2025', color: '#E42D3F', layout: 'normal', href: 'https://github.com/leunameek/crazycowboy' },
    { id: '12', title: 'Koin',         type: 'Sitio Web',                 year: '2026', color: '#0063D3', layout: 'normal', href: 'https://github.com/ElViejoH/Koinpage' },
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

<!-- Splash clip-path definitions — width/height 0 keeps it out of flow -->
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" aria-hidden="true" style="position:absolute;overflow:hidden">
  <defs>
    <clipPath id="sc-s1" clipPathUnits="objectBoundingBox">
      <path d="M0.1,0.15 C0,0 0.2,-0.06 0.35,0.03 C0.45,-0.01 0.58,0.06 0.7,-0.01 C0.84,-0.06 1,0.05 0.97,0.2 C1.06,0.32 0.97,0.47 1.03,0.57 C1.08,0.71 0.99,0.87 0.85,0.94 C0.71,1.05 0.53,0.97 0.42,1.04 C0.27,1.09 0.08,1.02 0.03,0.87 C-0.05,0.72 0.05,0.57 0,0.45 C-0.04,0.28 0.03,0.22 0.1,0.15Z"/>
    </clipPath>
    <clipPath id="sc-s2" clipPathUnits="objectBoundingBox">
      <path d="M0.06,0.28 C0,0.1 0.15,-0.02 0.3,0.04 C0.4,-0.04 0.55,0.06 0.67,-0.03 C0.8,-0.07 0.97,0.04 0.95,0.2 C1.05,0.3 0.97,0.46 1.03,0.55 C1.07,0.68 1,0.84 0.87,0.92 C0.74,1.03 0.56,0.97 0.45,1.03 C0.3,1.07 0.11,1.02 0.05,0.88 C-0.03,0.75 0.04,0.6 0,0.48 C-0.03,0.38 0.01,0.33 0.06,0.28Z"/>
    </clipPath>
    <clipPath id="sc-s3" clipPathUnits="objectBoundingBox">
      <path d="M0.04,0.22 C-0.06,0.06 0.12,-0.04 0.28,0.03 C0.4,-0.02 0.54,0.07 0.66,-0.01 C0.8,-0.05 0.98,0.06 0.96,0.22 C1.04,0.34 0.96,0.5 1.02,0.6 C1.06,0.73 0.98,0.89 0.85,0.96 C0.72,1.06 0.54,0.98 0.43,1.04 C0.28,1.09 0.09,1.02 0.04,0.88 C-0.04,0.73 0.03,0.58 -0.02,0.46 C-0.06,0.3 -0.01,0.27 0.04,0.22Z"/>
    </clipPath>
    <clipPath id="sc-s4" clipPathUnits="objectBoundingBox">
      <path d="M0.12,0.12 C0.04,-0.01 0.2,-0.06 0.34,0.02 C0.46,-0.03 0.6,0.05 0.72,-0.02 C0.86,-0.06 1.01,0.04 0.98,0.2 C1.07,0.3 0.98,0.46 1.04,0.56 C1.08,0.7 0.99,0.87 0.84,0.96 C0.68,1.08 0.48,0.97 0.36,1.06 C0.2,1.11 0.03,1.05 0.01,0.9 C-0.06,0.75 0.06,0.6 0.02,0.48 C-0.02,0.32 0.05,0.21 0.12,0.12Z"/>
    </clipPath>
    <clipPath id="sc-s5" clipPathUnits="objectBoundingBox">
      <path d="M0.1,0.18 C0.02,0.04 0.18,-0.04 0.32,0.04 C0.44,-0.01 0.57,0.07 0.69,-0.01 C0.83,-0.05 1,0.06 0.99,0.22 C1.08,0.32 1,0.47 1.06,0.57 C1.12,0.71 1.03,0.87 0.89,0.95 C0.75,1.06 0.56,0.97 0.44,1.03 C0.29,1.08 0.1,1.02 0.04,0.88 C-0.04,0.74 0.04,0.59 0,0.47 C-0.04,0.3 0.02,0.24 0.1,0.18Z"/>
    </clipPath>
    <clipPath id="sc-s6" clipPathUnits="objectBoundingBox">
      <path d="M0.07,0.25 C0,0.06 0.14,-0.04 0.3,0.03 C0.42,-0.04 0.56,0.08 0.68,-0.03 C0.82,-0.08 1,0.04 0.97,0.2 C1.06,0.3 0.97,0.44 1.04,0.54 C1.1,0.68 1.01,0.86 0.87,0.94 C0.73,1.06 0.53,0.96 0.4,1.05 C0.23,1.11 0.04,1.05 0.01,0.89 C-0.06,0.74 0.06,0.59 0.01,0.47 C-0.04,0.33 0,0.31 0.07,0.25Z"/>
    </clipPath>
  </defs>
</svg>

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
    font-family: "shantell-sans-bouncy", sans-serif;
    font-weight: 500;
    font-style: normal;
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
    font-family: "shantell-sans-bouncy", sans-serif;
    font-weight: 500;
    font-style: normal;
    font-size: 0.75rem;
    color: #bbb;
    letter-spacing: 0.05em;
  }

  .sh-headline {
    margin: 0 0 20px;
    font-family: "brushtones", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: clamp(3.5rem, 7vw, 7rem);
    line-height: 0.95;
    letter-spacing: -0.03em;
    color: #0a0a0a;
  }

  .sh-sub {
    margin: 0;
    font-family: "shantell-sans-bouncy", sans-serif;
    font-weight: 500;
    font-style: normal;
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
    background: var(--card-color);
    color: #fff;
    cursor: default;
    text-decoration: none;
    isolation: isolate;
    transform: translateZ(0);
    filter: drop-shadow(0 6px 18px rgba(0,0,0,0.18));
    transition:
      transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
      filter 0.45s ease;
  }

  /* Cycle through 6 splash clip-path shapes */
  .project-card:nth-child(6n+1) { clip-path: url(#sc-s1); }
  .project-card:nth-child(6n+2) { clip-path: url(#sc-s2); }
  .project-card:nth-child(6n+3) { clip-path: url(#sc-s3); }
  .project-card:nth-child(6n+4) { clip-path: url(#sc-s4); }
  .project-card:nth-child(6n+5) { clip-path: url(#sc-s5); }
  .project-card:nth-child(6n+6) { clip-path: url(#sc-s6); }

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

  /* Hover: lifted prism sheen — drop-shadow follows the splash outline */
  .project-card:hover {
    transform: perspective(900px) rotateX(3deg) rotateY(-4deg) translateY(-10px) scale(1.035);
    filter: saturate(1.16) contrast(1.04) drop-shadow(0 28px 40px rgba(0,0,0,0.28));
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
    font-family: "shantell-sans-bouncy", sans-serif;
    font-weight: 500;
    font-style: normal;
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
    font-family: "brushtones", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: clamp(1.6rem, 2.8vw, 2.4rem);
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
    font-family: "shantell-sans-bouncy", sans-serif;
    font-weight: 500;
    font-style: normal;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.75;
  }

  .card-year {
    font-family: "shantell-sans-bouncy", sans-serif;
    font-weight: 500;
    font-style: normal;
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
