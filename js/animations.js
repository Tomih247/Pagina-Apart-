document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Hero word reveal ──────────────────────────────────────────────────────
  const heroTitle   = document.querySelector('.hero-title');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroDesc    = document.querySelector('.hero-desc');
  const heroButtons = document.querySelector('.hero-buttons');

  if (heroTitle) {
    // Sacar fade-in genérico — estas piezas tienen su propia animación
    [heroTitle, heroTagline, heroDesc, heroButtons].forEach(el => {
      if (el) el.classList.remove('fade-in');
    });

    // Partir el título en palabras, cada una dentro de un clip overflow:hidden
    const words = heroTitle.textContent.trim().split(/\s+/);
    heroTitle.textContent = '';
    words.forEach((word, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'hero-word-wrap';
      const inner = document.createElement('span');
      inner.className = 'hero-word';
      inner.textContent = word;
      inner.style.animationDelay = `${(0.08 + i * 0.11).toFixed(2)}s`;
      wrap.appendChild(inner);
      heroTitle.appendChild(wrap);
      if (i < words.length - 1) heroTitle.appendChild(document.createTextNode(' '));
    });

    // Tagline, desc y botones: slide-up encadenado al final del título
    const lastWordDelay = 0.08 + (words.length - 1) * 0.11;
    [
      [heroTagline, lastWordDelay + 0.18],
      [heroDesc,    lastWordDelay + 0.36],
      [heroButtons, lastWordDelay + 0.54],
    ].forEach(([el, delay]) => {
      if (!el) return;
      el.style.animation =
        `hero-fade-up .75s cubic-bezier(.16,1,.3,1) both ${delay.toFixed(2)}s`;
    });
  }

  // ── 2. Stats — contadores animados ──────────────────────────────────────────
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();
    const update   = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = Math.sin((progress * Math.PI) / 2);
      el.textContent = prefix + Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(update);
  }

  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]')
    .forEach(el => statsObs.observe(el));

  // ── 3. Parallax suave en el hero ────────────────────────────────────────────
  const hero = document.querySelector('.hero');
  if (hero) {
    const maxY = hero.offsetHeight * 1.5;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y <= maxY) {
        hero.style.backgroundPositionY = `calc(50% + ${(y * 0.32).toFixed(1)}px)`;
      }
    }, { passive: true });
  }

});
