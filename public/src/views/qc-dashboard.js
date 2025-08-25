// qc-dashboard.js - Basic QC dashboard using your existing components
export function QCDashboard(mount, options) {
  // Mock QC data
  const qcData = {
    pistachio: { inspections: 12, passRate: 94.2, pending: 3, issues: 1 },
    walnut: { inspections: 8, passRate: 97.1, pending: 2, issues: 0 },
    cardamom: { inspections: 5, passRate: 91.8, pending: 1, issues: 0 }
  };
  
  const totalInspections = Object.values(qcData).reduce((sum, factory) => sum + factory.inspections, 0);
  const avgPassRate = Object.values(qcData).reduce((sum, factory) => sum + factory.passRate, 0) / 3;
  const totalPending = Object.values(qcData).reduce((sum, factory) => sum + factory.pending, 0);
  const totalIssues = Object.values(qcData).reduce((sum, factory) => sum + factory.issues, 0);

  mount.innerHTML = `
    <section class="grid">
      <!-- QC Overview Header -->
      <div class="card">
        <h2 class="section">🔬 Quality Control Dashboard</h2>
        <p class="section-sub">Cross-factory quality overview • ${new Date().toLocaleDateString()}</p>
        
        <!-- Overall Metrics -->
        <div class="grid grid-3" style="margin-top: 1rem;">
          <div class="kpi ${avgPassRate >= 95 ? 'ok' : avgPassRate >= 90 ? 'warn' : 'bad'}">
            <div class="label">Average Pass Rate</div>
            <div class="value">${avgPassRate.toFixed(1)}%</div>
          </div>
          <div class="kpi ${totalPending === 0 ? 'ok' : 'warn'}">
            <div class="label">Pending Tests</div>
            <div class="value">${totalPending}</div>
          </div>
          <div class="kpi ${totalIssues === 0 ? 'ok' : 'bad'}">
            <div class="label">Critical Issues</div>
            <div class="value">${totalIssues}</div>
          </div>
        </div>
      </div>

      <!-- Factory QC Status Cards -->
      <div class="card factory-card" onclick="alert('Pistachio QC details would open here')">
        <div class="title">🥜 Pistachio Quality Control</div>
        <div class="subtitle">Today: ${qcData.pistachio.inspections} inspections completed</div>
        
        <div class="grid grid-3" style="margin-top: 1rem;">
          <div class="kpi ${qcData.pistachio.passRate >= 95 ? 'ok' : 'warn'}">
            <div class="label">Pass Rate</div>
            <div class="value">${qcData.pistachio.passRate}%</div>
          </div>
          <div class="kpi ${qcData.pistachio.pending === 0 ? 'ok' : 'warn'}">
            <div class="label">Pending</div>
            <div class="value">${qcData.pistachio.pending}</div>
          </div>
          <div class="kpi ${qcData.pistachio.issues === 0 ? 'ok' : 'bad'}">
            <div class="label">Issues</div>
            <div class="value">${qcData.pistachio.issues}</div>
          </div>
        </div>
      </div>

      <div class="card factory-card" onclick="alert('Walnut QC details would open here')">
        <div class="title">🌰 Walnut Quality Control</div>
        <div class="subtitle">Today: ${qcData.walnut.inspections} inspections completed</div>
        
        <div class="grid grid-3" style="margin-top: 1rem;">
          <div class="kpi ${qcData.walnut.passRate >= 95 ? 'ok' : 'warn'}">
            <div class="label">Pass Rate</div>
            <div class="value">${qcData.walnut.passRate}%</div>
          </div>
          <div class="kpi ${qcData.walnut.pending === 0 ? 'ok' : 'warn'}">
            <div class="label">Pending</div>
            <div class="value">${qcData.walnut.pending}</div>
          </div>
          <div class="kpi ${qcData.walnut.issues === 0 ? 'ok' : 'bad'}">
            <div class="label">Issues</div>
            <div class="value">${qcData.walnut.issues}</div>
          </div>
        </div>
      </div>

      <div class="card factory-card" onclick="alert('Cardamom QC details would open here')">
        <div class="title">🌿 Cardamom Quality Control</div>
        <div class="subtitle">Today: ${qcData.cardamom.inspections} inspections completed</div>
        
        <div class="grid grid-3" style="margin-top: 1rem;">
          <div class="kpi ${qcData.cardamom.passRate >= 95 ? 'ok' : 'warn'}">
            <div class="label">Pass Rate</div>
            <div class="value">${qcData.cardamom.passRate}%</div>
          </div>
          <div class="kpi ${qcData.cardamom.pending === 0 ? 'ok' : 'warn'}">
            <div class="label">Pending</div>
            <div class="value">${qcData.cardamom.pending}</div>
          </div>
          <div class="kpi ${qcData.cardamom.issues === 0 ? 'ok' : 'bad'}">
            <div class="label">Issues</div>
            <div class="value">${qcData.cardamom.issues}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h3 class="title">⚡ Quick Actions</h3>
        <div class="row" style="gap: 1rem; margin-top: 1rem;">
          <button class="btn" onclick="alert('New inspection form would open here')">
            + New Inspection
          </button>
          <button class="ghost" onclick="alert('QC reports would open here')">
            📊 View Reports
          </button>
          <button class="ghost" onclick="alert('Pending inspections would open here')">
            ⏰ Pending Tests (${totalPending})
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <h3 class="title">📋 Recent QC Activity</h3>
        <div style="margin-top: 1rem;">
          <div style="padding: 0.75rem; background: #f8f9fa; border-radius: 0.5rem; margin-bottom: 0.5rem; border-left: 4px solid #22c55e;">
            <strong>14:30</strong> - Pistachio lot GH-240315-01: ✅ Passed inspection
          </div>
          <div style="padding: 0.75rem; background: #f8f9fa; border-radius: 0.5rem; margin-bottom: 0.5rem; border-left: 4px solid #ef4444;">
            <strong>13:15</strong> - Pistachio lot EX-240315-02: ❌ Failed - Size deviation
          </div>
          <div style="padding: 0.75rem; background: #f8f9fa; border-radius: 0.5rem; margin-bottom: 0.5rem; border-left: 4px solid #22c55e;">
            <strong>12:45</strong> - Walnut lot WN-240315-01: ✅ Passed inspection
          </div>
          <div style="padding: 0.75rem; background: #f8f9fa; border-radius: 0.5rem; margin-bottom: 0.5rem; border-left: 4px solid #f59e0b;">
            <strong>11:30</strong> - Cardamom lot CD-240315-01: ⚠️ Pass with warning - Moisture slightly high
          </div>
        </div>
      </div>
    </section>
  `;
}
