// ── Transición de página ──────────────────────────────────────────────────────
const pt = document.getElementById('pageTransition');
if (pt) {
  // Fade out al entrar — el div ya está en el HTML, visible desde el primer render
  requestAnimationFrame(() => requestAnimationFrame(() => {
    pt.classList.add('is-hidden');
    pt.addEventListener('transitionend', () => pt.remove(), { once: true });
  }));
}

// Fade in al salir — nuevo div sin transición de entrada, navega a 380ms
document.addEventListener('click', e => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#') ||
      href.startsWith('mailto') || href.startsWith('tel') || href.includes('wa.me')) return;
  e.preventDefault();
  const leave = document.createElement('div');
  leave.className = 'page-transition';
  document.body.prepend(leave);
  setTimeout(() => { window.location = href; }, 380);
});

document.addEventListener('DOMContentLoaded', () => {

  // Navbar — aparece al scrollear, se oculta al detenerse
  const navbar = document.querySelector('.navbar');
  let navTimer;
  window.addEventListener('scroll', () => {
    navbar.classList.add('scrolled');
    clearTimeout(navTimer);
    navTimer = setTimeout(() => navbar.classList.remove('scrolled'), 600);
  }, { passive: true });

  // Mobile menu
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }

  // Scroll-reveal via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right')
    .forEach(el => observer.observe(el));

  // Underline animado en títulos de sección
  const lineObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('line-visible');
        lineObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.section-header h2')
    .forEach(h2 => lineObs.observe(h2));

  // WhatsApp form
  const fmtDate = d => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${parseInt(day)} de ${meses[parseInt(m)-1]}`;
  };
  document.querySelectorAll('.wa-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const g = f => (form.querySelector(`[data-field="${f}"]`) || {}).value || '';
      const nombre   = g('nombre');
      const checkin  = fmtDate(g('checkin'));
      const checkout = fmtDate(g('checkout'));
      const personas = g('personas');
      const consulta = g('consulta');
      let msg = `Hola! Quiero consultar disponibilidad en Apart Club San Pedro.`;
      if (nombre)   msg += `\n\nNombre: ${nombre}`;
      if (personas) msg += `\nPersonas: ${personas}`;
      if (checkin)  msg += `\nLlegada: ${checkin}`;
      if (checkout) msg += `\nSalida: ${checkout}`;
      if (consulta) msg += `\n\nConsulta: ${consulta}`;
      window.open(`https://wa.me/543329527052?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });

  // Parallax en page-hero (galería, contacto, preguntas)
  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    const bp = pageHero.style.backgroundPosition;
    const parts = bp.trim().split(/\s+/);
    const rawY = parts.length > 1 ? parts[1] : '50%';
    const initY = rawY.replace('center','50%').replace('top','0%').replace('bottom','100%');
    const maxY  = pageHero.offsetHeight * 2;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y <= maxY) {
        pageHero.style.backgroundPositionY = `calc(${initY} + ${(y * 0.3).toFixed(1)}px)`;
      }
    }, { passive: true });
  }

});
