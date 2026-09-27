(() => {
  'use strict';
  const { config } = PP;
  const prefersReducedMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  /** ?static=1 in the URL freezes all motion (screenshots / previews). */
  const isStaticMode = () => /[?&]static\b/.test(location.search);
  const motionEnabled = () => config.motion && !prefersReducedMotion() && !isStaticMode();
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  Object.assign(PP, {
    prefersReducedMotion, isStaticMode, motionEnabled, clamp, lerp,
    EASE_OUT: 'cubic-bezier(.2,.7,.2,1)', EASE_EXPO: 'cubic-bezier(.16,1,.3,1)',
  });
})();
