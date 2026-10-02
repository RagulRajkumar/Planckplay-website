/**
 * ApplyForm — job application on Careers: CV upload + four short questions
 * about what the engineer wants to work on. Sends the same way as ContactForm
 * (no server): config.formEndpoint → multipart POST with the CV; otherwise the
 * share sheet carries the CV, or a ready email opens and the CV is listed to attach.
 * Reuses the contact-form / dropzone / contact-done styles (forms.css).
 */
(() => {
  'use strict';
  const { html, icon, defineBehavior } = PP;
  const MAX_MB = 10, ACCEPT = '.pdf,.doc,.docx,.odt,.rtf,.txt';

  const TRACKS = [
    { value: 'role', label: 'Open role' },
    { value: 'trainee', label: 'Graduate trainee' },
    { value: 'internship', label: 'Internship' },
  ];
  const DISCIPLINES = ['Electronics and PCB', 'Embedded firmware', 'Mechanical and CAD', 'Software', 'QA and test automation', 'Not sure yet'];

  function ApplyForm({ track = 'role' } = {}) {
    const to = PP.site.company.careersEmail;
    return html`
      <div class="contact-form-wrap" data-behavior="apply-form">
        <form class="contact-form" novalidate>
          <fieldset class="contact-form__group">
            <legend class="eyebrow">Applying for</legend>
            <div class="seg contact-form__seg" role="radiogroup">
              ${TRACKS.map((t) => html`<label class="seg-opt"><input type="radio" name="track" value="${t.value}" ${t.value === track ? 'checked' : ''}>${t.label}</label>`)}
            </div>
          </fieldset>

          <div class="contact-form__grid">
            <div class="field"><label for="ap-name">Name *</label><input class="input" id="ap-name" name="name" autocomplete="name" maxlength="120" required></div>
            <div class="field"><label for="ap-email">Email *</label><input class="input" id="ap-email" name="email" type="email" autocomplete="email" maxlength="160" required></div>
            <div class="field"><label for="ap-phone">Phone</label><input class="input" id="ap-phone" name="phone" type="tel" autocomplete="tel" maxlength="40"></div>
            <div class="field"><label for="ap-discipline">Discipline *</label>
              <select class="input" id="ap-discipline" name="discipline" required>
                <option value="">Choose one</option>
                ${DISCIPLINES.map((d) => html`<option>${d}</option>`)}
              </select></div>
          </div>

          <div class="field">
            <label for="ap-intent">What kind of engineering problems do you want to work on, and why? *</label>
            <textarea class="input" id="ap-intent" name="intent" rows="3" maxlength="1200" required placeholder="A few lines is enough."></textarea>
          </div>
          <div class="field">
            <label for="ap-project">One project you are proud of, and what you did on it *</label>
            <textarea class="input" id="ap-project" name="project" rows="3" maxlength="1500" required placeholder="Hardware, code, drawings or a test report all count."></textarea>
          </div>
          <div class="contact-form__grid">
            <div class="field"><label for="ap-link">Portfolio, GitHub or LinkedIn</label><input class="input" id="ap-link" name="link" type="url" maxlength="300" placeholder="https://"></div>
            <div class="field"><label for="ap-start">When could you start?</label><input class="input" id="ap-start" name="start" maxlength="120"></div>
          </div>

          <div class="contact-form__files">
            <label class="dropzone" for="ap-cv" data-dropzone>
              <span class="dropzone__icon">${icon('upload', { size: 22 })}</span>
              <span class="dropzone__text">
                <span class="dropzone__title">Upload your CV *</span>
                <span class="dropzone__hint">Drop it here or <u>browse</u>. PDF or Word · up to ${MAX_MB} MB</span>
              </span>
              <input class="dropzone__input" id="ap-cv" type="file" accept="${ACCEPT}">
            </label>
            <ul class="file-list" data-file-list hidden></ul>
          </div>

          <div class="contact-form__actions">
            <button class="btn btn-primary btn-pill btn-lg contact-form__submit" type="submit">${icon('upload', { size: 18 })}<span>Send application</span></button>
            <p class="contact-form__note">${PP.config.formEndpoint ? 'Sent straight to our engineers, CV included' : `Goes to ${to}`}</p>
          </div>
          <p class="contact-form__status" role="status" aria-live="polite" data-status></p>
        </form>

        <div class="contact-done" hidden tabindex="-1" data-done>
          <div class="contact-done__icon">${icon('mail', { size: 34, color: '#FFFFFF' })}</div>
          <h2 class="contact-done__title" data-done-title>Your application is ready.</h2>
          <p class="contact-done__text" data-done-text></p>
          <div class="contact-done__share" data-share hidden>
            <p>Your CV can go with it: this opens your device’s share sheet. Choose Mail and check it’s addressed to <strong>${to}</strong>.</p>
            <button type="button" class="btn btn-primary btn-pill btn-md" data-share-btn>${icon('paperclip', { size: 16 })}<span>Send with CV</span></button>
          </div>
          <div class="contact-done__attach" data-attach-note hidden>
            ${icon('paperclip', { size: 16 })}<div><span>Attach your CV in your mail app before you press send:</span><ul data-attach-list></ul></div>
          </div>
          <div class="contact-done__alt" data-alt>
            <p class="contact-done__label">Mail app didn’t open? Send the same email another way:</p>
            <div class="contact-done__btns">
              <a class="btn btn-secondary btn-pill btn-md" data-send="mailto" href="#">${icon('mail', { size: 16 })}Mail app</a>
              <a class="btn btn-secondary btn-pill btn-md" data-send="gmail" href="#" target="_blank" rel="noopener">Gmail${icon('arrowUpRight', { size: 16 })}</a>
              <a class="btn btn-secondary btn-pill btn-md" data-send="outlook" href="#" target="_blank" rel="noopener">Outlook${icon('arrowUpRight', { size: 16 })}</a>
              <button type="button" class="btn btn-secondary btn-pill btn-md" data-copy>${icon('copy', { size: 16 })}<span data-copy-label>Copy email</span></button>
            </div>
          </div>
          <button type="button" class="link-mono link-mono--underline contact-done__edit" data-again>${icon('chevronLeft', { size: 14 })}Edit the application</button>
        </div>
      </div>`;
  }

  defineBehavior('apply-form', (wrap) => {
    const to = PP.site.company.careersEmail, endpoint = PP.config.formEndpoint;
    const q = (s) => wrap.querySelector(s);
    const form = q('form'), status = q('[data-status]'), done = q('[data-done]'), drop = q('[data-dropzone]');
    const picker = q('#ap-cv'), list = q('[data-file-list]'), submitBtn = q('[type="submit"]');
    let cv = null, mail = null, copyTimer = 0;
    const offs = [];
    const on = (el, ev, fn) => { el.addEventListener(ev, fn); offs.push(() => el.removeEventListener(ev, fn)); };
    const say = (msg, kind = '') => { status.textContent = msg; status.dataset.kind = kind; };
    const canShare = () => { try { return !!(cv && navigator.canShare && navigator.canShare({ files: [cv] })); } catch (e) { return false; } };

    const renderCv = () => {
      list.hidden = !cv;
      drop.removeAttribute('aria-invalid');
      list.innerHTML = cv ? `<li class="file-list__item">${icon('paperclip', { size: 16 })}<span class="file-list__name">${PP.escapeHTML(cv.name)}</span>
        <span class="file-list__size">${PP.fmtSize(cv.size)}</span>
        <button type="button" class="file-list__remove" data-remove aria-label="Remove ${PP.escapeHTML(cv.name)}">${icon('x', { size: 16 })}</button></li>` : '';
    };
    const setCv = (f) => {
      if (!f) return;
      if (f.size > MAX_MB * 1024 * 1024) { say(`${f.name} is over ${MAX_MB} MB.`, 'error'); return; }
      cv = f; renderCv(); say('');
    };
    on(picker, 'change', () => { setCv(picker.files[0]); picker.value = ''; });
    on(list, 'click', (e) => { if (e.target.closest('[data-remove]')) { cv = null; renderCv(); picker.focus(); } });
    ['dragenter', 'dragover'].forEach((ev) => on(drop, ev, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
    ['dragleave', 'dragend'].forEach((ev) => on(drop, ev, () => drop.classList.remove('is-over')));
    on(drop, 'drop', (e) => { e.preventDefault(); drop.classList.remove('is-over'); if (e.dataTransfer && e.dataTransfer.files.length) setCv(e.dataTransfer.files[0]); });

    const compose = () => {
      const d = new FormData(form), v = (k) => String(d.get(k) || '').trim();
      const trackEl = form.querySelector('input[name="track"]:checked');
      const track = trackEl ? trackEl.parentElement.textContent.trim() : 'Application';
      const fields = { track, name: v('name'), email: v('email'), phone: v('phone'), discipline: v('discipline'), intent: v('intent'), project: v('project'), link: v('link'), start: v('start') };
      const lines = ['Hello Planck Play team,', '', `I would like to apply: ${track}, ${fields.discipline}.`, '',
        'What I want to work on:', fields.intent, '', 'A project I am proud of:', fields.project, '', '———',
        `Name: ${fields.name}`, `Email: ${fields.email}`];
      if (fields.phone) lines.push(`Phone: ${fields.phone}`);
      if (fields.link) lines.push(`Portfolio: ${fields.link}`);
      if (fields.start) lines.push(`Can start: ${fields.start}`);
      if (cv) lines.push(`CV: ${cv.name}`);
      return { subject: `Job application · ${track} · ${fields.discipline} · ${fields.name}`, body: lines.join('\n'), fields };
    };

    const showDone = (sent) => {
      const first = mail.fields.name.split(' ')[0], share = !sent && canShare();
      const addr = `<strong>${PP.escapeHTML(to)}</strong>`;
      q('[data-done-title]').textContent = sent ? `Thanks, ${first}. We have your application.` : `Your application is ready, ${first}.`;
      q('[data-done-text]').innerHTML = sent ? 'Your answers and CV reached our engineers.'
        : share ? `It’s addressed to ${addr}, with your CV. Send it below.`
          : `We opened it in your mail app, addressed to ${addr}. Attach your CV and press send.`;
      q('[data-share]').hidden = !share;
      q('[data-alt]').hidden = sent;
      q('[data-attach-note]').hidden = sent || share;
      q('[data-attach-list]').innerHTML = cv ? `<li>${PP.escapeHTML(cv.name)} · ${PP.fmtSize(cv.size)}</li>` : '';
      form.hidden = true; done.hidden = false; done.focus();
    };

    const onSubmit = async (e) => {
      e.preventDefault();
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
      const invalid = [...form.querySelectorAll('[required]')].filter((el) => !el.value.trim() || !el.checkValidity());
      const linkEl = q('#ap-link');
      if (linkEl.value.trim() && !linkEl.checkValidity()) invalid.push(linkEl);
      if (invalid.length) {
        invalid.forEach((el) => el.setAttribute('aria-invalid', 'true')); invalid[0].focus();
        say('Please fill in the required fields.', 'error'); return;
      }
      if (!cv) { drop.setAttribute('aria-invalid', 'true'); picker.focus(); say('Please upload your CV.', 'error'); return; }
      say('');
      mail = compose();
      const l = PP.mailLinks(to, mail);
      ['mailto', 'gmail', 'outlook'].forEach((k) => { q(`[data-send="${k}"]`).href = l[k]; });
      if (endpoint) {
        submitBtn.disabled = true; say('Uploading your CV…');
        try {
          const fd = new FormData();
          fd.append('_subject', mail.subject);
          Object.entries(mail.fields).forEach(([k, v]) => { if (v) fd.append(k, v); });
          fd.append('cv', cv, cv.name);
          const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          say(''); showDone(true); return;
        } catch (err) { say('We could not send it from here, so it is ready as an email instead.', 'error'); }
        finally { submitBtn.disabled = false; }
      }
      showDone(false);
      if (!canShare()) window.location.href = l.mailto;
    };

    const onShare = async () => {
      try { await navigator.share({ title: mail.subject, text: `To: ${to}\nSubject: ${mail.subject}\n\n${mail.body}`, files: [cv] }); }
      catch (err) {
        if (err && err.name === 'AbortError') return;
        q('[data-share]').hidden = true; q('[data-attach-note]').hidden = false;
        window.location.href = PP.mailLinks(to, mail).mailto;
      }
    };
    const onCopy = async () => {
      const ok = await PP.copyText(`To: ${to}\nSubject: ${mail.subject}\n\n${mail.body}`);
      q('[data-copy-label]').textContent = ok ? 'Copied' : 'Copy failed';
      clearTimeout(copyTimer); copyTimer = setTimeout(() => { q('[data-copy-label]').textContent = 'Copy email'; }, 2400);
    };

    on(form, 'submit', onSubmit);
    on(q('[data-share-btn]'), 'click', onShare);
    on(q('[data-copy]'), 'click', onCopy);
    on(q('[data-again]'), 'click', () => { done.hidden = true; form.hidden = false; q('#ap-intent').focus(); });
    return () => { clearTimeout(copyTimer); offs.forEach((f) => f()); };
  });

  Object.assign(PP, { ApplyForm });
})();
