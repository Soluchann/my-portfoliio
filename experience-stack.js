document.addEventListener('DOMContentLoaded', () => {
  const stack = document.getElementById('experienceStack');
  if (!stack || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    stack.classList.add('stack-cards--static');
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

  const getStackScrollDistance = () => window.innerHeight * Math.max(total - 1, 1) * 0.85;

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

      gsap.set(card, { scale });
    });
  };

  ScrollTrigger.create({
    trigger: stack,
    start: 'top top',
    end: () => `+=${getStackScrollDistance()}`,
    scrub: 0.45,
    invalidateOnRefresh: true,
    onUpdate: (self) => updateCardScales(self.progress),
    onRefresh: (self) => updateCardScales(self.progress),
  });

  updateCardScales(0);

  window.addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });
});
