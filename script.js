// Auré — European Kitchen interactions & animations
document.addEventListener('DOMContentLoaded', function () {

  // --------------------------------------------------------------------------
  // 1. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  var revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Burger / Mobile Overlay Menu
  // --------------------------------------------------------------------------
  var burgerBtn = document.querySelector('[data-burger-toggle]');
  var overlayMenu = document.getElementById('overlay-menu');
  var closeBtns = document.querySelectorAll('[data-burger-close]');

  function openMenu() {
    if (!overlayMenu) return;
    overlayMenu.classList.add('is-open');
    overlayMenu.setAttribute('aria-hidden', 'false');
    if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!overlayMenu) return;
    overlayMenu.classList.remove('is-open');
    overlayMenu.setAttribute('aria-hidden', 'true');
    if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', openMenu);
  }

  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlayMenu && overlayMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // --------------------------------------------------------------------------
  // 3. Infinite Horizontal Menu Carousel
  // --------------------------------------------------------------------------
  var track = document.querySelector('[data-menu-track]');
  var prev = document.querySelector('[data-menu-prev]');
  var next = document.querySelector('[data-menu-next]');

  if (track) {
    // Duplicate children to enable seamless infinite scroll loop
    var originalItems = Array.from(track.children);
    originalItems.forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    function getScrollStep() {
      return Math.min(380, track.clientWidth * 0.8);
    }

    function checkLoopBoundaries() {
      var halfScroll = track.scrollWidth / 2;
      if (track.scrollLeft >= halfScroll) {
        track.style.scrollBehavior = 'auto';
        track.scrollLeft -= halfScroll;
        track.style.scrollBehavior = '';
      } else if (track.scrollLeft <= 0) {
        track.style.scrollBehavior = 'auto';
        track.scrollLeft += halfScroll;
        track.style.scrollBehavior = '';
      }
    }

    track.addEventListener('scroll', function () {
      checkLoopBoundaries();
    }, { passive: true });

    if (next) {
      next.addEventListener('click', function () {
        var step = getScrollStep();
        var halfScroll = track.scrollWidth / 2;
        if (track.scrollLeft >= halfScroll - 20) {
          track.style.scrollBehavior = 'auto';
          track.scrollLeft -= halfScroll;
          track.style.scrollBehavior = '';
        }
        track.scrollBy({ left: step, behavior: 'smooth' });
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        var step = getScrollStep();
        var halfScroll = track.scrollWidth / 2;
        if (track.scrollLeft <= 10) {
          track.style.scrollBehavior = 'auto';
          track.scrollLeft += halfScroll;
          track.style.scrollBehavior = '';
        }
        track.scrollBy({ left: -step, behavior: 'smooth' });
      });
    }

    // Touch & Mouse Drag to Scroll
    var isDragging = false;
    var startX = 0;
    var startScrollLeft = 0;

    track.addEventListener('mousedown', function (e) {
      isDragging = true;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      startScrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', function () {
      if (isDragging) {
        isDragging = false;
        track.classList.remove('is-dragging');
      }
    });

    track.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        track.classList.remove('is-dragging');
      }
    });

    track.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 1.5;
      track.scrollLeft = startScrollLeft - walk;
    });
  }

  // --------------------------------------------------------------------------
  // 4. Reservation Time Slots Selection
  // --------------------------------------------------------------------------
  var slots = document.querySelectorAll('[data-slots] .slot');
  slots.forEach(function (btn) {
    btn.addEventListener('click', function () {
      slots.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  });

});
