import { Card } from '../components/card.js';
import { Button } from '../components/button.js';
import { KpiTile } from '../components/kpi-tile.js';
import { Progress } from '../components/progress.js';
import { goTo, getText } from '../app.js';

export function FactorySelectView(mount, { t }) {
  mount.innerHTML = `
    <section class="grid" aria-labelledby="sectionTitle">
      <div class="row" style="justify-content:space-between; align-items:end;">
        <div>
          <h2 id="sectionTitle" class="section">${t('selectFactory')}</h2>
          <p style="margin:0;color:#6b7280">Tap a factory to view today’s performance.</p>
        </div>
      </div>
      <div id="factoryGrid" class="grid grid-3" role="list"></div>
    </section>
  `;

  Promise.all([
    fetch('./src/data/mock/factories.json').then(r=>r.json()),
    fetch('./src/data/mock/production_today.json').then(r=>r.json())
  ]).then(([factories, prod])=>{
    const grid = mount.querySelector('#factoryGrid');
    factories.forEach(f=>{
      const p = prod[f.key] || { actualKg:0, targetKg:0, efficiency:0, rejectRate:0 };
      const effClass = p.efficiency >= 95 ? 'ok' : (p.efficiency >= 90 ? 'warn' : 'bad');
      const progressPct = Math.min(100, Math.round((p.actualKg / Math.max(1,p.targetKg)) * 100));

      const emoji = f.key === 'Pistachio' ? '🥜' : f.key === 'Walnut' ? '🌰' : '🌿';

      const cardEl = Card({
        title: `${emoji} ${f.name}`,
        subtitle: `${getText('today')}: ${p.actualKg.toLocaleString()} kg`,
        content: `
          <div class="grid grid-3" aria-label="Key performance indicators">
            ${KpiTile({ label: getText('efficiency'), value: `${p.efficiency}%`, state: effClass })}
            ${KpiTile({ label: getText('rejectRate'), value: `${p.rejectRate}%`, state: p.rejectRate<2 ? 'ok' : (p.rejectRate<5?'warn':'bad') })}
            <div class="kpi" role="group" aria-label="Target progress">
              <div class="label">Target Progress</div>
              <div><strong>${progressPct}%</strong> &middot; ${p.actualKg.toLocaleString()} / ${p.targetKg.toLocaleString()} kg</div>
              ${Progress({ value: progressPct })}
            </div>
          </div>
        `,
        footer: Button({
          text: getText('view'),
          attrs: { 'data-factory': f.key, class: 'cta btn', 'aria-label': `Open ${f.name} dashboard` }
        })
      });
      cardEl.setAttribute('role','listitem');
      grid.appendChild(cardEl);
    });

    grid.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-factory]');
      if (!btn) return;
      const factory = btn.getAttribute('data-factory');
      goTo('#/dashboard', { factory });
    });
  }).catch(()=>{
    mount.innerHTML = `<div class="card"><p>Failed to load mock data. Check file paths.</p></div>`;
  });
}
