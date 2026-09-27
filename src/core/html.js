/**
 * Planck Play namespace + tiny HTML templating.
 *
 * The site is built from plain <script> files (no ES modules) so index.html
 * opens straight from disk (file://) — no local server needed. Each file is
 * an IIFE that reads what it needs from window.PP and adds what it exports.
 *
 *   html`<p>${userText}</p>`   → values are HTML-escaped automatically
 *   html`<ul>${items.map(i => html`<li>${i}</li>`)}</ul>`  → arrays are joined
 *   raw(trustedMarkup)         → opt out of escaping (icons, nested templates)
 */
window.PP = window.PP || { site: {}, homeContent: {}, pages: {} };

(() => {
  'use strict';

  class SafeHTML {
    constructor(value) { this.value = value; }
    toString() { return this.value; }
  }
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

  function format(v) {
    if (v === null || v === undefined || v === false) return '';
    if (Array.isArray(v)) return v.map(format).join('');
    if (v instanceof SafeHTML) return v.value;
    return escapeHTML(v);
  }
  function html(strings, ...values) {
    let out = '';
    strings.forEach((s, i) => { out += s; if (i < values.length) out += format(values[i]); });
    return new SafeHTML(out);
  }
  const raw = (markup) => new SafeHTML(String(markup));
  const cx = (...names) => names.filter(Boolean).join(' ');
  /** True for a real, confirmed value; false for '', '#', null or a "[placeholder]". */
  const known = (v) => typeof v === 'string' ? v.trim() !== '' && v.trim() !== '#' && !/^\[.*\]$/.test(v.trim()) : v != null && v !== false;

  /** 7 → 'seven' (counts in headings stay correct when a list changes). */
  const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const numberWord = (n, cap = false) => { const w = WORDS[n] || String(n); return cap ? w[0].toUpperCase() + w.slice(1) : w; };

  Object.assign(PP, { SafeHTML, html, raw, cx, escapeHTML, known, numberWord });
})();
