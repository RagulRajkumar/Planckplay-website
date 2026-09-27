/**
 * ContactForm — enquiry / RFP form that sends through the visitor's own email.
 *
 * Nothing is sent from the website: no mail relay, no server, no third party.
 * On submit the form checks the fields, writes a ready-to-send email (subject
 * and a tidy body with every field) and:
 *   1. opens it in the visitor's default mail app (mailto:), and
 *   2. shows a "Your email is ready" panel with other ways to send the same
 *      email: Gmail, Outlook on the web, or copy it and paste it anywhere.
 * Works identically from file://, localhost and the live site.
 * Files (RFPs, drawings) are attached by the visitor in their mail app.
 *
 * @param {{ type?: 'engineer'|'project'|'rfp', nda?: boolean }} props  initial selections
 */
(() => {
  'use strict';
  const { html, icon, defineBehavior } = PP;

  const TYPES = [
    { value: 'engineer', label: 'Talk to an engineer' },
    { value: 'project', label: 'Describe a project' },
    { value: 'rfp', label: 'Submit an RFP' },
  ];

  function ContactForm({ type = 'project', nda = false } = {}) {
    const to = PP.site.company.email;
    return html`
      <div class="contact-form-wrap" data-behavior="contact-form">
        <form class="contact-form" novalidate>
          <fieldset class="contact-form__group">
            <legend class="eyebrow">What do you need?</legend>
            <div class="seg contact-form__seg" role="radiogroup">
              ${TYPES.map((t) => html`
                <label class="seg-opt"><input type="radio" name="type" value="${t.value}" ${t.value === type ? 'checked' : ''}>${t.label}</label>`)}
            </div>
          </fieldset>

          <div class="contact-form__grid">
            <div class="field"><label for="cf-name">Name *</label><input class="input" id="cf-name" name="name" autocomplete="name" maxlength="120" required></div>
            <div class="field"><label for="cf-email">Work email *</label><input class="input" id="cf-email" name="email" type="email" autocomplete="email" maxlength="160" required></div>
            <div class="field"><label for="cf-company">Company</label><input class="input" id="cf-company" name="company" autocomplete="organization" maxlength="160"></div>
            <div class="field"><label for="cf-phone">Phone</label><input class="input" id="cf-phone" name="phone" type="tel" autocomplete="tel" maxlength="40"></div>
          </div>

          <div class="field">
            <label for="cf-message">The technical problem *</label>
            <textarea class="input" id="cf-message" name="message" rows="6" maxlength="4000" required
              placeholder="What are you trying to build or fix, what constraints apply, and what would a working result measure?"></textarea>
          </div>

          <p class="contact-form__attach" id="rfp">
            ${icon('paperclip', { size: 18 })}
            <span>Have an RFP, drawings or a specification? Attach them to the email this form prepares for you.</span>
          </p>

          <label class="contact-form__check" id="nda">
            <input type="checkbox" name="nda" value="yes" ${nda ? 'checked' : ''}>
            <span>Send me an NDA before the first technical conversation</span>
          </label>

          <div class="contact-form__actions">
            <button class="btn btn-primary btn-pill btn-lg contact-form__submit" type="submit">
              ${icon('mail', { size: 18 })}<span>Send by email</span>
            </button>
            <p class="contact-form__note">Opens a ready-to-send email to ${to}</p>
          </div>
          <p class="contact-form__status" role="status" aria-live="polite" data-status></p>
        </form>

        <div class="contact-done" hidden tabindex="-1" data-done>
          <div class="contact-done__icon">${icon('mail', { size: 34, color: '#FFFFFF' })}</div>
          <h2 class="contact-done__title" data-done-title>Your email is ready.</h2>
          <p class="contact-done__text">We opened it in your mail app, addressed to <strong>${to}</strong>. Press send there and an engineer will reply.</p>
          <p class="contact-done__attach" data-attach-note hidden>${icon('paperclip', { size: 16 })}<span>Remember to attach your RFP or drawings before sending.</span></p>

          <div class="contact-done__alt">
            <p class="contact-done__label">Mail app didn’t open? Send the same email another way:</p>
            <div class="contact-done__btns">
              <a class="btn btn-secondary btn-pill btn-md" data-send="mailto" href="#">${icon('mail', { size: 16 })}Mail app</a>
              <a class="btn btn-secondary btn-pill btn-md" data-send="gmail" href="#" target="_blank" rel="noopener">Gmail${icon('arrowUpRight', { size: 16 })}</a>
              <a class="btn btn-secondary btn-pill btn-md" data-send="outlook" href="#" target="_blank" rel="noopener">Outlook${icon('arrowUpRight', { size: 16 })}</a>
              <button type="button" class="btn btn-secondary btn-pill btn-md" data-copy>${icon('copy', { size: 16 })}<span data-copy-label>Copy email</span></button>
            </div>
            <details class="contact-done__preview">
              <summary>Preview the email</summary>
              <dl>
                <dt>To</dt><dd>${to}</dd>
                <dt>Subject</dt><dd data-preview-subject></dd>
              </dl>
              <pre data-preview-body></pre>
            </details>
          </div>

          <button type="button" class="link-mono link-mono--underline contact-done__edit" data-again>${icon('chevronLeft', { size: 14 })}Edit the enquiry</button>
        </div>
      </div>`;
  }

  /** Subject + plain-text body built from the form. */
  function compose(form) {
    const d = new FormData(form);
    const v = (k) => String(d.get(k) || '').trim();
    const typeEl = form.querySelector('input[name="type"]:checked');
    const typeLabel = typeEl ? typeEl.parentElement.textContent.trim() : 'Enquiry';
    const name = v('name'), company = v('company');
    const subject = `${typeLabel}${company ? ` · ${company}` : ''} · ${name}`;
    const lines = [
      `Hello Planck Play team,`,
      '',
      v('message'),
      '',
      '———',
      `Enquiry: ${typeLabel}`,
      `Name: ${name}`,
      `Email: ${v('email')}`,
    ];
    if (company) lines.push(`Company: ${company}`);
    if (v('phone')) lines.push(`Phone: ${v('phone')}`);
    lines.push(`NDA requested: ${d.get('nda') ? 'Yes' : 'No'}`);
    return { subject, body: lines.join('\n'), name, typeLabel };
  }

  function links(to, { subject, body }) {
    const s = encodeURIComponent(subject), b = encodeURIComponent(body), t = encodeURIComponent(to);
    return {
      mailto: `mailto:${to}?subject=${s}&body=${b}`,
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${t}&su=${s}&body=${b}`,
      outlook: `https://outlook.office.com/mail/deeplink/compose?to=${t}&subject=${s}&body=${b}`,
    };
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* file:// or permission denied → fallback */ }
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.append(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove(); return ok;
  }

  defineBehavior('contact-form', (wrap) => {
    const to = PP.site.company.email;
    const form = wrap.querySelector('form');
    const status = form.querySelector('[data-status]');
    const done = wrap.querySelector('[data-done]');
    const copyBtn = wrap.querySelector('[data-copy]');
    const copyLabel = wrap.querySelector('[data-copy-label]');
    let mail = null, copyTimer = 0;
    const say = (msg, kind = '') => { status.textContent = msg; status.dataset.kind = kind; };

    const onSubmit = (e) => {
      e.preventDefault();
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
      const invalid = [...form.querySelectorAll('[required]')].filter((el) => !el.value.trim() || !el.checkValidity());
      if (invalid.length) {
        invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
        invalid[0].focus();
        const emailBad = invalid.some((el) => el.id === 'cf-email' && el.value.trim());
        say(emailBad ? 'Please enter a valid email address.' : 'Please fill in the required fields.', 'error');
        return;
      }
      say('');
      mail = compose(form);
      const l = links(to, mail);
      wrap.querySelector('[data-send="mailto"]').href = l.mailto;
      wrap.querySelector('[data-send="gmail"]').href = l.gmail;
      wrap.querySelector('[data-send="outlook"]').href = l.outlook;
      wrap.querySelector('[data-preview-subject]').textContent = mail.subject;
      wrap.querySelector('[data-preview-body]').textContent = mail.body;
      const typeEl = form.querySelector('input[name="type"]:checked');
      wrap.querySelector('[data-attach-note]').hidden = !(typeEl && typeEl.value === 'rfp');
      wrap.querySelector('[data-done-title]').textContent = mail.name ? `Your email is ready, ${mail.name.split(' ')[0]}.` : 'Your email is ready.';
      form.hidden = true; done.hidden = false; done.focus();
      // Still inside the submit gesture, so the browser allows handing off to the mail app.
      window.location.href = l.mailto;
    };

    const onCopy = async () => {
      if (!mail) return;
      const ok = await copyText(`To: ${to}\nSubject: ${mail.subject}\n\n${mail.body}`);
      copyLabel.textContent = ok ? 'Copied' : 'Copy failed';
      clearTimeout(copyTimer); copyTimer = setTimeout(() => { copyLabel.textContent = 'Copy email'; }, 2400);
    };

    const onAgain = () => { done.hidden = true; form.hidden = false; form.querySelector('#cf-message').focus(); };
    const again = wrap.querySelector('[data-again]');
    form.addEventListener('submit', onSubmit);
    copyBtn.addEventListener('click', onCopy);
    again.addEventListener('click', onAgain);
    return () => { clearTimeout(copyTimer); form.removeEventListener('submit', onSubmit); copyBtn.removeEventListener('click', onCopy); again.removeEventListener('click', onAgain); };
  });

  Object.assign(PP, { ContactForm });
})();
