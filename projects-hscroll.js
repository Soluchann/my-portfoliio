document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('projectsHScroll');
  if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  const list = section.querySelector('.projects-hscroll__list');
  const labels = gsap.utils.toArray('.projects-hscroll__label', section);
  const panels = gsap.utils.toArray('.projects-hscroll__panel', section);
  const total = panels.length;

  if (!list || !total) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (prefersReducedMotion || isMobile) {
    section.classList.add('projects-hscroll--static');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const getScrollDistance = () => window.innerHeight * Math.max(total, 1);
  const segmentLength = 1 / total;

  gsap.to(list, {
    x: () => -(list.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${getScrollDistance()}`,
      scrub: 0.6,
      pin: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        labels.forEach((label, index) => {
          const panelStart = index * segmentLength;
          const localProgress = (self.progress - panelStart) / segmentLength;
          const clamped = Math.min(Math.max(localProgress, 0), 1);
          gsap.set(label, { x: 800 - clamped * 1600 });
        });
      },
    },
  });

  window.addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });
});
