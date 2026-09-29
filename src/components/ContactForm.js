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
 *
 * Attachments (RFPs, drawings, specs): picked or dropped into the form, then
 *   • config.formEndpoint set → the whole enquiry, files included, is POSTed
 *     there as multipart form data (Formspree, your own API…), or
 *   • the browser can share files (phones, Safari, recent Chrome) → "Send with
 *     attachments" hands the files and the message to the visitor's Mail app, or
 *   • otherwise the email opens as before and the files to attach are listed.
 *   (A mailto: link can never carry files; that's a browser rule.)
 *
 * @param {{ type?: 'engineer'|'project'|'rfp', nda?: boolean }} props  initial selections
 */
(() => {
  'use strict';
  const { html, icon, defineBehavior } = PP;

  const MAX_FILES = 10, MAX_MB = 25;
  const ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.rtf,.odt,.ods,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,.rar,.7z,.dwg,.dxf,.step,.stp,.iges,.igs,.stl,.sldprt,.sldasm,.x_t,.gbr,.kicad_pcb';
  const fmtSize = (b) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

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

          <div class="contact-form__files" id="rfp">
            <label class="dropzone" for="cf-files" data-dropzone>
              <span class="dropzone__icon">${icon('upload', { size: 22 })}</span>
              <span class="dropzone__text">
                <span class="dropzone__title">Attach an RFP, drawings or a specification</span>
                <span class="dropzone__hint">Drop files here or <u>browse</u>. PDF, Office, CAD, images or ZIP · up to ${MAX_FILES} files, ${MAX_MB} MB in total</span>
              </span>
              <input class="dropzone__input" id="cf-files" type="file" multiple accept="${ACCEPT}">
            </label>
            <ul class="file-list" data-file-list hidden></ul>
          </div>

          <label class="contact-form__check" id="nda">
            <input type="checkbox" name="nda" value="yes" ${nda ? 'checked' : ''}>
            <span>Send me an NDA before the first technical conversation</span>
          </label>

          <div class="contact-form__actions">
            <button class="btn btn-primary btn-pill btn-lg contact-form__submit" type="submit">
              ${icon('mail', { size: 18 })}<span>Send by email</span>
            </button>
            <p class="contact-form__note" data-note>${PP.config.formEndpoint ? 'Sent straight to our engineers, files included' : `Opens a ready-to-send email to ${to}`}</p>
          </div>
          <p class="contact-form__status" role="status" aria-live="polite" data-status></p>
        </form>

        <div class="contact-done" hidden tabindex="-1" data-done>
          <div class="contact-done__icon">${icon('mail', { size: 34, color: '#FFFFFF' })}</div>
          <h2 class="contact-done__title" data-done-title>Your email is ready.</h2>
          <p class="contact-done__text">We opened it in your mail app, addressed to <strong>${to}</strong>. Press send there and an engineer will reply.</p>
          <div class="contact-done__share" data-share hidden>
            <p>Your files can go with it: this opens your device’s share sheet. Choose Mail and check it’s addressed to <strong>${to}</strong>.</p>
            <button type="button" class="btn btn-primary btn-pill btn-md" data-share-btn>${icon('paperclip', { size: 16 })}<span>Send with attachments</span></button>
          </div>
          <div class="contact-done__attach" data-attach-note hidden>
            ${icon('paperclip', { size: 16 })}
            <div><span data-attach-title>Remember to attach your RFP or drawings before sending.</span><ul data-attach-list></ul></div>
          </div>

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
  function compose(form, files = []) {
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
    if (files.length) lines.push(`Attachments: ${files.map((f) => f.name).join(', ')}`);
    return { subject, body: lines.join('\n'), name, typeLabel, fields: { name, email: v('email'), company, phone: v('phone'), message: v('message'), nda: d.get('nda') ? 'Yes' : 'No' } };
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
    const endpoint = PP.config.formEndpoint;
    const form = wrap.querySelector('form');
    const status = form.querySelector('[data-status]');
    const done = wrap.querySelector('[data-done]');
    const copyBtn = wrap.querySelector('[data-copy]');
    const copyLabel = wrap.querySelector('[data-copy-label]');
    const submitBtn = form.querySelector('[type="submit"]');
    const drop = form.querySelector('[data-dropzone]');
    const picker = form.querySelector('#cf-files');
    const list = form.querySelector('[data-file-list]');
    const shareBox = wrap.querySelector('[data-share]');
    const shareBtn = wrap.querySelector('[data-share-btn]');
    let mail = null, copyTimer = 0, files = [];
    const offs = [];
    const on = (el, ev, fn) => { el.addEventListener(ev, fn); offs.push(() => el.removeEventListener(ev, fn)); };
    const say = (msg, kind = '') => { status.textContent = msg; status.dataset.kind = kind; };
    const canShareFiles = (fs) => { try { return !!(fs.length && navigator.canShare && navigator.canShare({ files: fs })); } catch (e) { return false; } };

    /* ---- Attachments ---- */
    const renderFiles = () => {
      list.hidden = !files.length;
      list.innerHTML = files.map((f, i) => `<li class="file-list__item">
          ${icon('paperclip', { size: 16 })}<span class="file-list__name">${PP.escapeHTML(f.name)}</span>
          <span class="file-list__size">${fmtSize(f.size)}</span>
          <button type="button" class="file-list__remove" data-remove="${i}" aria-label="Remove ${PP.escapeHTML(f.name)}">${icon('x', { size: 16 })}</button>
        </li>`).join('');
    };
    const addFiles = (incoming) => {
      const skipped = [];
      [...incoming].forEach((f) => {
        if (files.some((x) => x.name === f.name && x.size === f.size)) return;
        const total = files.reduce((n, x) => n + x.size, 0) + f.size;
        if (files.length >= MAX_FILES) skipped.push(`${f.name} (limit of ${MAX_FILES} files)`);
        else if (total > MAX_MB * 1024 * 1024) skipped.push(`${f.name} (over ${MAX_MB} MB in total)`);
        else files.push(f);
      });
      renderFiles();
      say(skipped.length ? `Not added: ${skipped.join(', ')}.` : '', skipped.length ? 'error' : '');
    };
    on(picker, 'change', () => { addFiles(picker.files); picker.value = ''; });
    on(list, 'click', (e) => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;
      files.splice(Number(btn.dataset.remove), 1); renderFiles(); picker.focus();
    });
    ['dragenter', 'dragover'].forEach((ev) => on(drop, ev, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
    ['dragleave', 'dragend'].forEach((ev) => on(drop, ev, () => drop.classList.remove('is-over')));
    on(drop, 'drop', (e) => { e.preventDefault(); drop.classList.remove('is-over'); if (e.dataTransfer && e.dataTransfer.files.length) addFiles(e.dataTransfer.files); });

    /* ---- Done panel ---- */
    const showDone = ({ sent = false } = {}) => {
      const first = mail.name ? mail.name.split(' ')[0] : '';
      const share = !sent && canShareFiles(files);
      const addr = `<strong>${PP.escapeHTML(to)}</strong>`;
      wrap.querySelector('[data-done-title]').textContent = sent ? `Thanks${first ? `, ${first}` : ''}. We have it.` : (first ? `Your email is ready, ${first}.` : 'Your email is ready.');
      wrap.querySelector('.contact-done__text').innerHTML = sent
        ? `Your enquiry${files.length ? ` and ${files.length === 1 ? 'file' : `${files.length} files`}` : ''} reached our engineers. A reply comes within one working day.`
        : share ? `It’s addressed to ${addr}, with your ${files.length === 1 ? 'file' : `${files.length} files`}. Send it below and an engineer will reply.`
          : `We opened it in your mail app, addressed to ${addr}. Press send there and an engineer will reply.`;
      wrap.querySelector('.contact-done__alt').hidden = sent;
      wrap.querySelector('.contact-done__label').textContent = share ? 'Or send the email without the files:' : 'Mail app didn’t open? Send the same email another way:';
      shareBox.hidden = !share;
      const note = wrap.querySelector('[data-attach-note]');
      const typeEl = form.querySelector('input[name="type"]:checked');
      note.hidden = sent || share || !(files.length || (typeEl && typeEl.value === 'rfp'));
      wrap.querySelector('[data-attach-title]').textContent = files.length
        ? 'Attach these files in your mail app before you press send:' : 'Remember to attach your RFP or drawings before sending.';
      wrap.querySelector('[data-attach-list]').innerHTML = files.map((f) => `<li>${PP.escapeHTML(f.name)} · ${fmtSize(f.size)}</li>`).join('');
      form.hidden = true; done.hidden = false; done.focus();
    };

    const prepareEmail = () => {
      const l = links(to, mail);
      wrap.querySelector('[data-send="mailto"]').href = l.mailto;
      wrap.querySelector('[data-send="gmail"]').href = l.gmail;
      wrap.querySelector('[data-send="outlook"]').href = l.outlook;
      wrap.querySelector('[data-preview-subject]').textContent = mail.subject;
      wrap.querySelector('[data-preview-body]').textContent = mail.body;
      return l;
    };

    async function sendToEndpoint() {
      const fd = new FormData();
      fd.append('_subject', mail.subject);
      fd.append('enquiry', mail.typeLabel);
      Object.entries(mail.fields).forEach(([k, v]) => { if (v) fd.append(k, v); });
      files.forEach((f) => fd.append('attachments', f, f.name));
      const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }

    const onSubmit = async (e) => {
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
      mail = compose(form, files);
      const l = prepareEmail();

      if (endpoint) {
        submitBtn.disabled = true; say(files.length ? 'Uploading your files…' : 'Sending…');
        try { await sendToEndpoint(); say(''); showDone({ sent: true }); return; }
        catch (err) { say('We could not send it from here, so it is ready as an email instead.', 'error'); }
        finally { submitBtn.disabled = false; }
        showDone(); return;
      }
      showDone();
      // With files the share sheet can carry them; otherwise hand off to the mail
      // app straight away (still inside the submit gesture, so browsers allow it).
      if (!canShareFiles(files)) window.location.href = l.mailto;
    };

    const onShare = async () => {
      if (!mail) return;
      try {
        await navigator.share({ title: mail.subject, text: `To: ${to}\nSubject: ${mail.subject}\n\n${mail.body}`, files });
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        shareBox.hidden = true;
        const note = wrap.querySelector('[data-attach-note]'); note.hidden = false;
        window.location.href = links(to, mail).mailto;
      }
    };

    const onCopy = async () => {
      if (!mail) return;
      const ok = await copyText(`To: ${to}\nSubject: ${mail.subject}\n\n${mail.body}`);
      copyLabel.textContent = ok ? 'Copied' : 'Copy failed';
      clearTimeout(copyTimer); copyTimer = setTimeout(() => { copyLabel.textContent = 'Copy email'; }, 2400);
    };

    const onAgain = () => { done.hidden = true; form.hidden = false; form.querySelector('#cf-message').focus(); };
    on(form, 'submit', onSubmit);
    on(shareBtn, 'click', onShare);
    on(copyBtn, 'click', onCopy);
    on(wrap.querySelector('[data-again]'), 'click', onAgain);
    return () => { clearTimeout(copyTimer); offs.forEach((f) => f()); };
  });

  Object.assign(PP, { ContactForm });
})();
