// factory-select.js - Factory selection view with QC integration
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

function Card({ icon, title, subtitle, content, href = '#/' }) {
  return `
    <article class="card factory-card" role="listitem">
      <a class="card-link" href="${href}" style="display:block; color:inherit; text-decoration:none" aria-label="${title}">
        <div>
          <div class="title">
            ${icon || ''}
            <span>${title}</span>
          </div>
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

// QC data for Quality Control dashboard
const qcData = {
  todayInspections: 25,
  passRate: 94.2,
  pendingTests: 6,
  criticalIssues: 1
};

export function FactorySelectView(mount) {
  mount.innerHTML = `
    <section class="grid" aria-labelledby="sectionTitle">
      <div style="text-align:center">
       
<img src="./logo.ico" alt="Al Jameel Logo" 
     style="width:64px; height:64px; margin-bottom:0.5rem;" 
     onerror="this.style.display='none'">
     
        <h2 id="sectionTitle" class="section">Al Jameel MES</h2>
        <p class="section-sub">Pick a workspace to view today's performance.</p>
      </div>
      <div id="factoryGrid" class="grid grid-3" role="list">
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
      </div>
    </section>
  `;

  // Simulate loading delay then render cards with QC
  setTimeout(() => {
    renderCards(mount.querySelector('#factoryGrid'), factories, productionData, qcData);
  }, 500);
}

function renderCards(grid, factories, prod, qc) {
  // Generate factory cards
  const factoryCards = factories.map(f => {
    const p = prod[f.key] || { actualKg: 0, targetKg: 0, efficiency: 0, rejectRate: 0 };
    const effClass = p.efficiency >= 95 ? 'ok' : (p.efficiency >= 90 ? 'warn' : 'bad');
    const progressPct = Math.min(100, Math.round((p.actualKg / Math.max(1, p.targetKg)) * 100));
    
    // Keep only this href declaration
    const href = f.key === 'Pistachio'
      ? './pistachio.html'
      : (f.key === 'Walnut' 
         ? './walnut.html' 
         : (f.key === 'Cardamom' 
        ? './cardamom.html'
         : `#/dashboard?factory=${encodeURIComponent(f.key)}`);
    
    // Factory icons
    let iconMarkup = '';

    if (f.key === 'Pistachio') {
      iconMarkup = '<img src="src/assets/icons/pistachio.png" class="ws-icon pistachio-icon" alt="" style="width: 40px; height: 40px; margin-right: 8px;" onerror="this.outerHTML=\'🥜\'">';
    } else if (f.key === 'Walnut') {
      iconMarkup = '<img src="src/assets/icons/Walnut.png" class="ws-icon walnut-icon" alt="" style="width: 40px; height: 40px; margin-right: 8px;" onerror="this.outerHTML=\'🌰\'">';
    } else if (f.key === 'Cardamom') {
      iconMarkup = '🌿';
    }

    // REMOVED the second declaration of href

    return Card({
      icon: iconMarkup,
      title: f.name,
      subtitle: `${getText('today')}: ${p.actualKg.toLocaleString()} kg`,
      href,
      content: `
        <div class="grid grid-3" aria-label="Key performance indicators">
          <!-- Rest of the code -->
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
  });

  // Generate QC card
  const qcPassRateClass = qc.passRate >= 95 ? 'ok' : (qc.passRate >= 90 ? 'warn' : 'bad');
  const qcCard = Card({
    icon: '🔬',
    title: 'Quality Control',
    subtitle: `Today: ${qc.todayInspections} inspections`,
    href: './qc.html',
    content: `
      <div class="grid grid-3" aria-label="QC overview">
        ${KpiTile({ 
          label: 'Pass Rate', 
          value: `${qc.passRate}%`, 
          state: qcPassRateClass 
        })}
        ${KpiTile({ 
          label: 'Pending Tests', 
          value: `${qc.pendingTests}`, 
          state: qc.pendingTests === 0 ? 'ok' : 'warn' 
        })}
        ${KpiTile({ 
          label: 'Critical Issues', 
          value: `${qc.criticalIssues}`, 
          state: qc.criticalIssues === 0 ? 'ok' : 'bad' 
        })}
      </div>
    `
  });

  // Combine all cards and render
  const allCards = factoryCards.concat(qcCard);
  grid.innerHTML = allCards.join('');
}
