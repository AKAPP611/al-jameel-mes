// SAFE FALLBACK VIEW: no imports, inline components, built-in mock data.
// Renders "Select Work Space" cards even if other modules are missing.

import { goTo, t as getText } from '../app.js';

// Minimal inline components
function KpiTile({ label, value, state='ok' }) {
  return `
    <div class="kpi ${state}" role="group" aria-label="${label}">
      <div class="label">${label}</div>
      <div class="value" aria-live="polite">${value}</div>
    </div>
  `;
}
function Progress({ value = 0 }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  return `
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${clamped}">
      <span style="inline-size:${clamped}%"></span>
    </div>
  `;
}
function Card({ title, subtitle, content, footer }) {
  return `
    <article class="card factory-card" role="listitem">
      <div>
        <div class="title">${title}</div>
        <div class="subtitle">${subtitle || ''}</div>
      </div>
      <div>${content || ''}</div>
      <div>${footer || ''}</div>
    </article>
  `;
}
function Button({ text, attrs = {} }) {
  const attrStr = Object.entries(attrs).map(([k,v]) => k==='class' ? '' : `${k}="${v}"`).join(' ');
  const cls = attrs.class ? attrs.class : 'btn';
  return `<button type="button" class="${cls}" ${attrStr} style="min-height:44px">${text}</button>`;
}

// Built-in fallback data (used if fetch fails)
const FALLBACK_FACTORIES = [
  { key:"Pistachio", name:"Pistachio" },
  { key:"Walnut", name:"Walnut" },
  { key:"Cardamom", name:"Cardamom" }
];
const FALLBACK_PROD = {
  Pistachio:{ actualKg:5600, targetKg:6000, efficiency:94, rejectRate:1.4 },
  Walnut:{ actualKg:7200, targetKg:7000, efficiency:97, rejectRate:2.1 },
  Cardamom:{ actualKg:3100, targetKg:4000, efficiency:78, rejectRate:0.9 }
};

export function FactorySelectView(mount) {
  // Shell with skeletons (so it's never blank)
  mount.innerHTML = `
    <section class="grid" aria-labelledby="sectionTitle">
      <div>
        <h2 id="sectionTitle" class="section">${getText('selectFactory')}</h2>
        <p class="section-sub">Pick a workspace to view today’s performance.</p>
      </div>
      <div id="factoryGrid" class="grid grid-3" role="list">
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
      </div>
    </section>
  `;

  // Try to load JSON; fall back to built-in data on any error
  Promise.allSettled([
    fetch('./src/data/mock/factories.json').then(r=>r.ok?r.json():Promise.reject()),
    fetch('./src/data/mock/production_today.json').then(r=>r.ok?r.json():Promise.reject())
  ]).then(([fRes, pRes])=>{
    const factories = fRes.status==='fulfilled' ? fRes.value : FALLBACK_FACTORIES;
    const prod = pRes.status==='fulfilled' ? pRes.value : FALLBACK_PROD;
    renderCards(mount.querySelector('#factoryGrid'), factories, prod);
  }).catch(()=>{
    renderCards(mount.querySelector('#factoryGrid'), FALLBACK_FACTORIES, FALLBACK_PROD);
  });
}

function renderCards(grid, factories, prod){
  const cards = factories.map(f=>{
    const p = prod[f.key] || { actualKg:0, targetKg:0, efficiency:0, rejectRate:0 };
    const effClass = p.efficiency >= 95 ? 'ok' : (p.efficiency >= 90 ? 'warn' : 'bad');
    const progressPct = Math.min(100, Math.round((p.actualKg / Math.max(1,p.targetKg)) * 100));
    const emoji = f.key === 'Pistachio' ? '🥜' : f.key === 'Walnut' ? '🌰' : '🌿';

    return Card({
      title: `${emoji} ${f.name}`,
      subtitle: `${getText('today')}: ${p.actualKg.toLocaleString()} kg`,
      content: `
        <div class="grid grid-3" aria-label="Key performance indicators">
          ${KpiTile({ label: getText('efficiency'), value: `${p.efficiency}%`, state: effClass })}
          ${KpiTile({ label: getText('rejectRate'), value: `${p.rejectRate}%`, state: p.rejectRate<2 ? 'ok' : (p.rejectRate<5?'warn':'bad') })}
          <div class="kpi" role="group" aria-label="Target progress">
            <div class="label">Target Progress</div>
            <div><strong>${progressPct}%</strong> · ${p.actualKg.toLocaleString()} / ${p.targetKg.toLocaleString()} kg</div>
            ${Progress({ value: progressPct })}
          </div>
        </div>
      `,
      footer: Button({
        text: getText('view'),
        attrs: { 'data-factory': f.key, class: 'cta btn', 'aria-label': `Open ${f.name} workspace` }
      })
    });
  }).join('');

  grid.innerHTML = cards;

  grid.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-factory]');
    if (!btn) return;
    const factory = btn.getAttribute('data-factory');
    // For now, route pistachio to the new workspace when you’re ready
    if (factory === 'Pistachio') {
      goTo('#/pistachio', { factory: 'Pistachio' });
    } else {
      goTo('#/dashboard', { factory }); // placeholder
    }
  });
}
