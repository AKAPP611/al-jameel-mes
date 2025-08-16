// SAFE FALLBACK VIEW (mobile-friendly): no external UI imports, built-in mock data.
// Renders "Select Work Space" cards that are full-card links (anchors) for reliable mobile routing.

import { t as getText } from '../app.js';

// --- Minimal inline components ---
function KpiTile({ label, value, state = 'ok' }) {
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

/** Card with a full-card anchor (better for touch). Pass an href to make entire card tappable. */
function Card({ title, subtitle, content, href = '#/' }) {
  return `
    <article class="card factory-card" role="listitem">
      <a class="card-link" href="${href}" style="display:block; color:inherit; text-decoration:none" aria-label="${title}">
        <div>
          <div class="title">${title}</div>
          <div class="subtitle">${subtitle || ''}</div>
        </div>
        <div>${content || ''}</div>
      </a>
    </article>
  `;
}

// --- Built-in fallback data (used if fetch fails) ---
const FALLBACK_FACTORIES = [
  { key: "Pistachio", name: "Pistachio", iconUrl: "src/assets/icon/pistachio.png" },
  { key: "Walnut",    name: "Walnut" },
  { key: "Cardamom",  name: "Cardamom" }
];

const FALLBACK_PROD = {
  Pistachio: { actualKg: 5600, targetKg: 6000, efficiency: 94, rejectRate: 1.4 },
  Walnut:    { actualKg: 7200, targetKg: 7000, efficiency: 97, rejectRate: 2.1 },
  Cardamom:  { actualKg: 3100, targetKg: 4000, efficiency: 78, rejectRate: 0.9 }
};

export function FactorySelectView(mount) {
  // Shell with skeletons (so it's never blank)
  // TIP: If your logo file name has a space, use only%20logo.ico; else rename to logo.ico and use ./logo.ico
  const logoSrc = './logo.ico'; // or './only%20logo.ico' if you kept the space

  mount.innerHTML = `
    <section class="grid" aria-labelledby="sectionTitle">
      <div style="text-align:center">
        <img src="${logoSrc}" alt="Al Jameel Logo"
             style="width:64px; height:64px; margin-bottom:0.5rem;">
        <h2 id="sectionTitle" class="section">Al Jameel MES</h2>
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
    fetch('./src/data/mock/factories.json').then(r => r.ok ? r.json() : Promise.reject()),
    fetch('./src/data/mock/production_today.json').then(r => r.ok ? r.json() : Promise.reject())
  ]).then(([fRes, pRes]) => {
    const factories = fRes.status === 'fulfilled' ? fRes.value : FALLBACK_FACTORIES;
    const prod      = pRes.status === 'fulfilled' ? pRes.value : FALLBACK_PROD;
    // ensure pistachio has an iconUrl even if JSON doesn’t provide it
const enriched = factories.map(f =>
  f.key === 'Pistachio' && !f.iconUrl
    ? { ...f, iconUrl: 'src/assets/icon/pistachio.png' }
    : f
);
renderCards(mount.querySelector('#factoryGrid'), enriched, prod);

  }).catch(() => {
    renderCards(mount.querySelector('#factoryGrid'), FALLBACK_FACTORIES, FALLBACK_PROD);
  });
}

function renderCards(grid, factories, prod) {
  const cards = factories.map(f => {
    const p = prod[f.key] || { actualKg: 0, targetKg: 0, efficiency: 0, rejectRate: 0 };
    const effClass    = p.efficiency >= 95 ? 'ok' : (p.efficiency >= 90 ? 'warn' : 'bad');
    const progressPct = Math.min(100, Math.round((p.actualKg / Math.max(1, p.targetKg)) * 100));
   const emoji = f.key === 'Pistachio' ? '🥜' : f.key === 'Walnut' ? '🌰' : '🌿';

// prefer image if provided; fall back to emoji
const iconUrl = f.iconUrl || (f.key === 'Pistachio' ? 'src/assets/icon/pistachio.png' : null);
const iconMarkup = iconUrl
  ? `<img src="${iconUrl}" class="ws-icon" alt="">`
  : `${emoji} `;

return Card({
  title: `${iconMarkup}${f.name}`,
  ...
});


    // Pistachio opens your standalone interface
    const href = f.key === 'Pistachio'
      ? './pistachio.html'
      : `#/dashboard?factory=${encodeURIComponent(f.key)}`;

    return Card({
      title: `${emoji} ${f.name}`,
      subtitle: `${getText('today')}: ${p.actualKg.toLocaleString()} kg`,
      href,
      content: `
        <div class="grid grid-3" aria-label="Key performance indicators">
          ${KpiTile({ label: getText('efficiency'), value: `${p.efficiency}%`, state: effClass })}
          ${KpiTile({ label: getText('rejectRate'), value: `${p.rejectRate}%`, state: p.rejectRate < 2 ? 'ok' : (p.rejectRate < 5 ? 'warn' : 'bad') })}
          <div class="kpi" role="group" aria-label="Target progress">
            <div class="label">Target Progress</div>
            <div><strong>${progressPct}%</strong> · ${p.actualKg.toLocaleString()} / ${p.targetKg.toLocaleString()} kg</div>
            ${Progress({ value: progressPct })}
          </div>
        </div>
      `
    });
  }).join('');

  grid.innerHTML = cards;
  // No JS click handler needed — anchors handle navigation (more reliable on mobile).
}
