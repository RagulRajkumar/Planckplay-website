/**
 * Behaviors = the interactive half of a component.
 * A component renders data-behavior="name"; its file calls
 * defineBehavior('name', el => { …; return cleanup }). The router mounts
 * behaviors after each render and runs cleanups before the next page.
 */
(() => {
  'use strict';
  const registry = new Map();
  function defineBehavior(name, setup) { registry.set(name, setup); }
  function mountBehaviors(root) {
    const cleanups = [];
    root.querySelectorAll('[data-behavior]').forEach((el) => {
      el.dataset.behavior.split(/\s+/).filter(Boolean).forEach((name) => {
        const setup = registry.get(name);
        if (!setup) { console.warn(`[behaviors] no behavior "${name}"`); return; }
        try { const c = setup(el); if (typeof c === 'function') cleanups.push(c); }
        catch (err) { console.error(`[behaviors] "${name}" failed`, err); }
      });
    });
    return cleanups;
  }
  Object.assign(PP, { defineBehavior, mountBehaviors });
})();
