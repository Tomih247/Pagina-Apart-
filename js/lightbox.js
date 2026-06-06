document.addEventListener('DOMContentLoaded', () => {

  const galleries = {
    pileta:   ['assets/pileta1.jpg', 'assets/pileta2.jpg', 'assets/pileta3.jpg'],
    playa:    ['assets/rio1.jpg', 'assets/rio2.jpg', 'assets/rio3.jpg'],
    botes:    ['assets/botes1.jpg', 'assets/botes2.jpg', 'assets/botes3.jpg'],
    pesca:    ['assets/pesca1.jpg', 'assets/pesca2.jpg', 'assets/pesca3.jpg'],
    deportes: ['assets/futbol1.jpg', 'assets/futbol2.jpg', 'assets/futbol3.jpg'],
    juegos:   ['assets/juegos1.jpg', 'assets/juegos2.jpg'],
    parque:   ['assets/parque1.jpg', 'assets/parque2.jpg', 'assets/parque3.jpg'],
    laguna:   ['assets/lago1.jpg', 'assets/lago2.jpg', 'assets/lago3.jpg'],
  };

  const lb        = document.getElementById('lightbox');
  const lbImg     = lb.querySelector('.lb-img');
  const lbPh      = lb.querySelector('.lb-placeholder');
  const lbPhLabel = lb.querySelector('.lb-placeholder span');
  const lbCounter = lb.querySelector('.lb-counter');

  let current   = 0;
  let images    = [];
  let swapTimer = null;

  const FADE_OUT_MS = 300;

  function show(index) {
    current = (index + images.length) % images.length;
    const src = images[current];
    lbCounter.textContent = `${current + 1} / ${images.length}`;

    if (swapTimer) { clearTimeout(swapTimer); swapTimer = null; }

    lbImg.style.opacity = '0';

    let imgReady    = false;
    let fadeOutDone = false;

    function trySwap() {
      if (!imgReady || !fadeOutDone) return;
      lbImg.src = src;
      lbImg.style.display = 'block';
      lbPh.style.display  = 'none';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        lbImg.style.opacity = '1';
      }));
    }

    const test = new Image();
    test.onload  = () => { imgReady = true; trySwap(); };
    test.onerror = () => {
      lbImg.style.display = 'none';
      lbPh.style.display  = 'flex';
      lbPhLabel.textContent = src;
    };
    test.src = src;

    swapTimer = setTimeout(() => { fadeOutDone = true; trySwap(); }, FADE_OUT_MS);
  }

  function open(key) {
    images  = galleries[key] || [];
    current = 0;
    document.body.style.overflow = 'hidden';

    const src = images[0];
    lbCounter.textContent = `1 / ${images.length}`;

    // Precargar la primera imagen antes de abrir el lightbox
    // — así la animación de entrada la revela ya cargada, sin flash de fondo vacío
    const test = new Image();
    test.onload = () => {
      lbImg.src = src;
      lbImg.style.display  = 'block';
      lbImg.style.opacity  = '1';
      lbPh.style.display   = 'none';
      lb.classList.add('is-open');
    };
    test.onerror = () => {
      lbImg.style.display = 'none';
      lbPh.style.display  = 'flex';
      lbPhLabel.textContent = src;
      lb.classList.add('is-open');
    };
    test.src = src;
  }

  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      lbImg.src = '';
      lbImg.style.opacity = '0';
      lbImg.style.display = 'none';
    }, 460);
  }

  document.querySelectorAll('.predio-card[data-gallery]').forEach(card => {
    card.addEventListener('click', () => open(card.dataset.gallery));
  });

  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(current + 1));

  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  // Swipe táctil para mobile
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      diff > 0 ? show(current + 1) : show(current - 1);
    }
  }, { passive: true });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

});
