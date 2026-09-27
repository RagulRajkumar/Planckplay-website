(() => {
  'use strict';
  const { html, icon } = PP;

  /**
   * DemoFlowCard — an in-house demo shown as its data flow (sensor → … → app).
   * @param {{ item: { kind: string, title: string, summary: string, flow: string[], href: string }, n: number }} props
   */
  function DemoFlowCard({ item, n }) {
    const flow = item.flow || [];
    return html`
      <article class="pp-card demo-flow">
        <div class="demo-flow__head">
          <span class="demo-flow__kind">${item.kind}</span>
          <span class="demo-flow__n">D-${String(n).padStart(2, '0')}</span>
        </div>
        <h4 class="demo-flow__title">${item.title}</h4>
        <p class="demo-flow__summary">${item.summary}</p>
        <div class="demo-flow__steps" role="img" aria-label="Data flow: ${flow.join(' to ')}">
          ${flow.map((f, j) => html`
            <span class="demo-flow__step${j === flow.length - 1 ? ' is-last' : ''}">${f}</span>
            ${j < flow.length - 1 ? html`<span class="demo-flow__arrow" aria-hidden="true">${icon('arrowRight', { size: 16 })}</span>` : ''}`)}
        </div>
        <a class="link-mono" href="${item.href}">Ask to see this demo${icon('arrowRight', { size: 14 })}</a>
      </article>`;
  }

  Object.assign(PP, { DemoFlowCard });
})();
