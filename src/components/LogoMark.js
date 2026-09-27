/**
 * LogoMark — the animated Planck Play mark. Replaces the line-art drawing that
 * previously sat in page heroes and CTA panels.
 *   • floats and slowly turns in 3D (CSS keyframes)
 *   • two orbit rings with travelling dots circle it
 *   • a glow breathes behind it
 *   • tilts toward the pointer (behavior "logo-mark")
 * @param {{ size?: 'sm'|'md'|'lg'|'xl', rings?: boolean, className?: string }} props
 */
(() => {
  'use strict';
  const { html, defineBehavior, motionEnabled, clamp } = PP;

  function LogoMark({ size = 'lg', rings = true, className = '' } = {}) {
    return html`
      <div class="logo-mark logo-mark--${size} ${className}" data-behavior="logo-mark" aria-hidden="true">
        <div class="logo-mark__glow"></div>
        ${rings ? html`
          <div class="logo-mark__rings">
            <div class="logo-mark__ring logo-mark__ring--a"><span></span></div>
            <div class="logo-mark__ring logo-mark__ring--b"><span></span></div>
          </div>` : ''}
        <div class="logo-mark__tilt"><div class="logo-mark__float">
          <img class="logo-mark__img" src="assets/images/brand/pp-mark.png" alt="" draggable="false">
        </div></div>
      </div>`;
  }

  defineBehavior('logo-mark', (el) => {
    if (!motionEnabled() || !window.matchMedia('(hover: hover)').matches) return;
    const tilt = el.querySelector('.logo-mark__tilt');
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
      ty = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      raf = 0;
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      tilt.style.transform = `rotateY(${(cx * 22).toFixed(2)}deg) rotateX(${(-cy * 16).toFixed(2)}deg)`;
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  });

  /** Brand lockup for nav/footer: animated mark + wordmark image. */
  const Brand = ({ className = '' } = {}) => html`
    <span class="brand ${className}">
      <img class="brand__mark" src="assets/images/brand/pp-mark-240.png" alt="">
      <img class="brand__word" src="assets/images/brand/pp-wordmark-white.png" alt="Planck Play">
    </span>`;

  Object.assign(PP, { LogoMark, Brand });
})();
