/**
 * DEV TEES - Vanilla JavaScript
 * Exclusivo para: (1) Menu Mobile Drawer e (2) Hero Slider
 * Sem bibliotecas externas, puro e performático.
 */

document.addEventListener('DOMContentLoaded', function () {
  /* ==========================================================================
     1. MENU MOBILE DRAWER & OVERLAY
     ========================================================================== */
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const openButtons = document.querySelectorAll('[data-drawer-open]');
  const closeButtons = document.querySelectorAll('[data-drawer-close]');

  function openDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.add('is-open');
    overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    openButtons.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
  }

  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-active');
    document.body.style.overflow = '';
    openButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openDrawer();
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      closeDrawer();
    });
  });

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  // Tecla Escape para acessibilidade
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  /* ==========================================================================
     2. HERO SLIDER (Apenas na página inicial ou onde existir o elemento)
     ========================================================================== */
  const heroSlider = document.querySelector('.hero');
  if (heroSlider) {
    const track = heroSlider.querySelector('.hero__track');
    const slides = heroSlider.querySelectorAll('.hero__slide');
    const dots = heroSlider.querySelectorAll('.hero__dot');
    const prevBtn = heroSlider.querySelector('[data-hero-prev]');
    const nextBtn = heroSlider.querySelector('[data-hero-next]');

    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoplayTimer = null;
    const autoplayDelay = 5500;

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('is-active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('is-active');
          dot.removeAttribute('aria-current');
        }
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoplay();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', function () {
        goToSlide(i);
        startAutoplay();
      });
    });

    // Pausar autoplay ao passar o cursor
    heroSlider.addEventListener('mouseenter', stopAutoplay);
    heroSlider.addEventListener('mouseleave', startAutoplay);

    // Suporte a swipe por toque (touch devices)
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlider.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      },
      { passive: true }
    );

    heroSlider.addEventListener(
      'touchend',
      function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        const threshold = 40; // Mínimo de pixels para swipe

        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        startAutoplay();
      },
      { passive: true }
    );

    // Iniciar autoplay
    startAutoplay();
  }
});
