// qc-dashboard.js - Follows same pattern as pistachio-home.js
import { Card } from '../components/card.js';
import { KpiTile } from '../components/kpi-tile.js';

export function QCDashboard(mount, options) {
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <h2 class="section">🔬 Quality Control Dashboard</h2>
        <p class="section-sub">Cross-factory quality overview</p>
      </div>
      
      <!-- Reuse your existing KPI layout -->
      <div class="grid grid-3">
        <div class="card factory-card">
          <div class="title">🥜 Pistachio QC</div>
          <div class="subtitle">Today: 12 inspections</div>
          ${KpiTile({ label: 'Pass Rate', value: '94%', state: 'ok' })}
        </div>
        
        <div class="card factory-card">
          <div class="title">🌰 Walnut QC</div>
          <div class="subtitle">Today: 8 inspections</div>
          ${KpiTile({ label: 'Pass Rate', value: '97%', state: 'ok' })}
        </div>
        
        <div class="card factory-card">
          <div class="title">🌿 Cardamom QC</div>
          <div class="subtitle">Today: 5 inspections</div>
          ${KpiTile({ label: 'Pass Rate', value: '91%', state: 'warn' })}
        </div>
      </div>
    </section>
  `;
}
