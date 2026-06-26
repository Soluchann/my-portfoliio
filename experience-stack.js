(function () {
  function setHeaderHeight() {
    const header = document.querySelector('.header');
    if (!header) return;
    document.documentElement.style.setProperty(
      '--header-height',
      `${Math.ceil(header.getBoundingClientRect().height)}px`
    );
  }

  function enableStaticStack(stack) {
    stack.classList.add('stack-cards--static');
    document.documentElement.dataset.experienceStack = 'static';
  }

  function initExperienceStack() {
    const stack = document.getElementById('experienceStack');
    if (!stack) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      enableStaticStack(stack);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray('.stack-card', stack);
    const total = cards.length;
    if (!total) return;

    cards.forEach((card, index) => {
      card.style.setProperty('--stack-index', String(index));
      card.style.zIndex = String(index + 1);
    });

    const updateCardScales = (progress) => {
      cards.forEach((card, index) => {
        const targetScale = 1 - (total - index) * 0.05;
        const rangeStart = index * 0.25;
        let scale = 1;

        if (progress >= rangeStart) {
          const rangeSpan = Math.max(1 - rangeStart, 0.001);
          const localProgress = (progress - rangeStart) / rangeSpan;
          scale = 1 + localProgress * (targetScale - 1);
        }

        gsap.set(card, { scale, force3D: true });
      });
    };

    const headerOffset = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim() || '80px';

    ScrollTrigger.create({
      trigger: stack,
      start: `top top+=${headerOffset}`,
      end: 'bottom bottom',
      scrub: 0.45,
      invalidateOnRefresh: true,
      onUpdate: (self) => updateCardScales(self.progress),
      onRefresh: (self) => updateCardScales(self.progress),
    });

    updateCardScales(0);
    document.documentElement.dataset.experienceStack = 'ready';
  }

  function boot() {
    setHeaderHeight();
    initExperienceStack();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener('load', () => {
    setHeaderHeight();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, { once: true });

  window.addEventListener('resize', () => {
    setHeaderHeight();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, { passive: true });
})();
