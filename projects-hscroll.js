(function () {
  function setHeaderHeight() {
    const header = document.querySelector('.header');
    if (!header) return;
    document.documentElement.style.setProperty(
      '--header-height',
      `${Math.ceil(header.getBoundingClientRect().height)}px`
    );
  }

  function enableStaticProjects(wrap) {
    const panels = wrap.querySelectorAll('.projects-hscroll__panel');
    if (panels.length) {
      wrap.style.setProperty('--hscroll-panels', String(panels.length));
    }
    wrap.classList.add('projects-hscroll-wrap--static');
    document.documentElement.dataset.projectsHscroll = 'static';
  }

  function initProjectsHScroll() {
    const wrap = document.getElementById('projectsHScrollWrap');
    const section = wrap?.querySelector('.projects-hscroll');
    const list = wrap?.querySelector('.projects-hscroll__list');
    if (!wrap || !section || !list) return;

    const labels = wrap.querySelectorAll('.projects-hscroll__label');
    const panels = wrap.querySelectorAll('.projects-hscroll__panel');
    const total = panels.length;
    if (!total) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      enableStaticProjects(wrap);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    wrap.style.setProperty('--hscroll-panels', String(total));

    const headerOffset = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim() || '80px';
    const getScrollDistance = () => Math.max(list.scrollWidth - window.innerWidth, 0);
    const segmentLength = 1 / total;

    gsap.to(list, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: `top top+=${headerOffset}`,
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          labels.forEach((label, index) => {
            const panelStart = index * segmentLength;
            const localProgress = (self.progress - panelStart) / segmentLength;
            const clamped = Math.min(Math.max(localProgress, 0), 1);
            gsap.set(label, { x: 800 - clamped * 1600, force3D: true });
          });
        },
      },
    });
    document.documentElement.dataset.projectsHscroll = 'ready';
  }

  function boot() {
    setHeaderHeight();
    initProjectsHScroll();
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
