// factory-select.js - Factory selection view (Clean version without extra text)
import { t as getText } from '../app.js';

// Inline components
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

// Factory data
const factories = [
  { key: "Pistachio", name: "Pistachio" },
  { key: "Walnut", name: "Walnut" },
  { key: "Cardamom", name: "Cardamom" }
];

const productionData = {
  Pistachio: { actualKg: 5600, targetKg: 6000, efficiency: 94, rejectRate: 1.4 },
  Walnut: { actualKg: 7200, targetKg: 7000, efficiency: 97, rejectRate: 2.1 },
  Cardamom: { actualKg: 3100, targetKg: 4000, efficiency: 78, rejectRate: 0.9 }
};

export function FactorySelectView(mount) {
  mount.innerHTML = `
    <section class="grid" aria-labelledby="sectionTitle">
      <div style="text-align:center">
        <div style="width:64px; height:64px; margin: 0 auto 1rem; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
          🏭
        </div>
        <h2 id="sectionTitle" class="section">Al Jameel MES</h2>
        <p class="section-sub">Pick a workspace to view today's performance.</p>
      </div>
      <div id="factoryGrid" class="grid grid-3" role="list">
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
      </div>
    </section>
  `;

  // Simulate loading delay then render cards
  setTimeout(() => {
    renderCards(mount.querySelector('#factoryGrid'), factories, productionData);
  }, 500);
}

function renderCards(grid, factories, prod) {
  const cards = factories.map(f => {
    const p = prod[f.key] || { actualKg: 0, targetKg: 0, efficiency: 0, rejectRate: 0 };
    const effClass = p.efficiency >= 95 ? 'ok' : (p.efficiency >= 90 ? 'warn' : 'bad');
    const progressPct = Math.min(100, Math.round((p.actualKg / Math.max(1, p.targetKg)) * 100));
    
    // Factory icons with clean implementation
    let iconMarkup = '';
    
    if (f.key === 'Pistachio') {
      // Use the pistachio image with clean fallback
      iconMarkup = `<img src="./src/assets/icons/pistachio.png" class="ws-icon pistachio-icon" alt="" onerror="this.outerHTML='🥜 '">`;
    } else if (f.key === 'Walnut') {
      iconMarkup = '🌰 ';
    } else if (f.key === 'Cardamom') {
      iconMarkup = '🌿 ';
    }

    // Navigation links
    const href = f.key === 'Pistachio'
      ? './pistachio.html'
      : `#/dashboard?factory=${encodeURIComponent(f.key)}`;

    return Card({
      title: `${iconMarkup}${f.name}`,
      subtitle: `${getText('today')}: ${p.actualKg.toLocaleString()} kg`,
      href,
      content: `
        <div class="grid grid-3" aria-label="Key performance indicators">
          ${KpiTile({ 
            label: getText('efficiency'), 
            value: `${p.efficiency}%`, 
            state: effClass 
          })}
          ${KpiTile({ 
            label: getText('rejectRate'), 
            value: `${p.rejectRate}%`, 
            state: p.rejectRate < 2 ? 'ok' : (p.rejectRate < 5 ? 'warn' : 'bad') 
          })}
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
}
