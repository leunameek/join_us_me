<script>
  import logoMulti from '../assets/Logo_multi.png';
</script>

<section class="site-footer">

  <div class="footer-inner">

    <img
      class="footer-logo"
      src={logoMulti}
      alt="Ingeniería en Multimedia logo"
      draggable="false"
    />

    <div class="footer-credits">
      <p class="credit-university">Universidad Militar Nueva Granada</p>
      <p class="credit-names">
        <span>Zaid Erazo</span>
        <span class="separator">|</span>
        <span>Juan Diego Quintero</span>
        <span class="separator">|</span>
        <span>Emanuel Solarte</span>
      </p>
      <p class="credit-course">AUDIO Y VIDEO &mdash; 2026-1</p>
    </div>

  </div>

</section>

<style>
  .site-footer {
    position: relative;
    background:
      radial-gradient(circle at 50% 0%, rgba(228, 45, 63, 0.18), transparent 34%),
      linear-gradient(135deg, #050505 0%, #101010 54%, #2a060b 100%);
    padding: 72px 24px;
    border-top: 1px solid rgba(228, 45, 63, 0.22);
    overflow: hidden;
  }

  .site-footer::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 45%),
      radial-gradient(circle at 50% 100%, rgba(228, 45, 63, 0.16), transparent 36%);
    pointer-events: none;
  }

  .footer-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    max-width: 1120px;
    margin: 0 auto;
    text-align: center;
  }

  .footer-logo {
    width: auto;
    height: 112px;
    object-fit: contain;
    flex-shrink: 0;
    opacity: 0.92;
    filter:
      grayscale(1)
      brightness(0)
      invert(1)
      drop-shadow(0 8px 18px rgba(0, 0, 0, 0.28));
  }

  .footer-credits {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
  }

  .credit-university {
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
  }

  .credit-names {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    row-gap: 6px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: clamp(0.98rem, 1.5vw, 1.12rem);
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0;
    line-height: 1.4;
  }

  .separator {
    margin: 0 10px;
    color: #E42D3F;
    font-weight: 400;
    opacity: 0.88;
  }

  .credit-course {
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
  }

  @media (max-width: 640px) {
    .site-footer {
      padding: 64px 20px;
    }

    .footer-logo {
      height: 82px;
    }
  }
</style>
