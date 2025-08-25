// qc-dashboard.js - Enhanced QC dashboard with receiving inspection
import { ReceivingQCInspection } from './qc-receiving-inspection.js';

let currentView = 'dashboard';
let dashboardContainer = null;

export function QCDashboard(mount, options) {
  dashboardContainer = mount;
  
  // Enhanced QC data with more realistic metrics
  const qcData = {
    pistachio: { 
      inspections: 12, 
      passRate: 94.2, 
      pending: 3, 
      issues: 1,
      receivingInspections: 8,
      inProcessTests: 15
    },
    walnut: { 
      inspections: 8, 
      passRate: 97.1, 
      pending: 2, 
      issues: 0,
      receivingInspections: 5,
      inProcessTests: 12
    },
    cardamom: { 
      inspections: 5, 
      passRate: 91.8, 
      pending: 1, 
      issues: 0,
      receivingInspections: 3,
      inProcessTests: 8
    }
  };
  
  const totalInspections = Object.values(qcData).reduce((sum, factory) => sum + factory.inspections, 0);
  const avgPassRate = Object.values(qcData).reduce((sum, factory) => sum + factory.passRate, 0) / 3;
  const totalPending = Object.values(qcData).reduce((sum, factory) => sum + factory.pending, 0);
  const totalIssues = Object.values(qcData).reduce((sum, factory) => sum + factory.issues, 0);
  const totalReceiving = Object.values(qcData).reduce((sum, factory) => sum + factory.receivingInspections, 0);

  // Show dashboard view
  showDashboard();
  
  function showDashboard() {
    currentView = 'dashboard';
    
    mount.innerHTML = `
      <section class="grid">
        <!-- QC Overview Header -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <h2 class="section">🔬 Quality Control Dashboard</h2>
              <p class="section-sub">Cross-factory quality overview • ${new Date().toLocaleDateString()}</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn" onclick="showReceivingInspection()">📦 New Receiving Inspection</button>
              <button class="ghost" onclick="alert('QC Reports coming soon')">📊 Reports</button>
            </div>
          </div>
          
          <!-- Overall Metrics -->
          <div class="grid grid-3" style="margin-top: 1rem;">
            <div class="kpi ${avgPassRate >= 95 ? 'ok' : avgPassRate >= 90 ? 'warn' : 'bad'}">
              <div class="label">Average Pass Rate</div>
              <div class="value">${avgPassRate.toFixed(1)}%</div>
            </div>
            <div class="kpi ${totalPending === 0 ? 'ok' : totalPending < 5 ? 'warn' : 'bad'}">
              <div class="label">Pending Tests</div>
              <div class="value">${totalPending}</div>
            </div>
            <div class="kpi ${totalIssues === 0 ? 'ok' : 'bad'}">
              <div class="label">Critical Issues</div>
              <div class="value">${totalIssues}</div>
            </div>
          </div>

          <!-- Secondary Metrics -->
          <div class="grid grid-3" style="margin-top: 1rem;">
            <div class="kpi">
              <div class="label">Total Inspections Today</div>
              <div class="value">${totalInspections}</div>
            </div>
            <div class="kpi">
              <div class="label">Receiving Inspections</div>
              <div class="value">${totalReceiving}</div>
            </div>
            <div class="kpi ${avgPassRate >= 95 ? 'ok' : 'warn'}">
              <div class="label">Quality Score</div>
              <div class="value">${(avgPassRate * 1.05 - totalIssues * 2).toFixed(0)}/100</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Section -->
        <div class="card">
          <h3 class="title">⚡ Quick Actions</h3>
          <div class="grid grid-3" style="gap: 1rem; margin-top: 1rem;">
            <button class="btn" onclick="showReceivingInspection()" style="padding: 1rem; height: auto; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.5rem;">📦</span>
              <span>Receiving Inspection</span>
              <small style="opacity: 0.8;">New incoming materials</small>
            </button>
            <button class="ghost" onclick="alert('In-process inspection form coming soon')" style="padding: 1rem; height: auto; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.5rem;">⚙️</span>
              <span>In-Process Testing</span>
              <small style="opacity: 0.8;">Production line QC</small>
            </button>
            <button class="ghost" onclick="alert('Final product inspection coming soon')" style="padding: 1rem; height: auto; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.5rem;">✅</span>
              <span>Final Inspection</span>
              <small style="opacity: 0.8;">Finished goods QC</small>
            </button>
          </div>
        </div>

        <!-- Factory QC Status Cards -->
        <div class="card factory-card" onclick="showFactoryDetails('pistachio')">
          <div class="title">🥜 Pistachio Quality Control</div>
          <div class="subtitle">Today: ${qcData.pistachio.inspections} total inspections • ${qcData.pistachio.receivingInspections} receiving</div>
          
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

          <!-- Recent Activity Preview -->
          <div style="margin-top: 1rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; opacity: 0.8;">
              <span>Last receiving inspection:</span>
              <span>GH-240315-01 - ✅ Passed</span>
            </div>
          </div>
        </div>

        <div class="card factory-card" onclick="showFactoryDetails('walnut')">
          <div class="title">🌰 Walnut Quality Control</div>
          <div class="subtitle">Today: ${qcData.walnut.inspections} total inspections • ${qcData.walnut.receivingInspections} receiving</div>
          
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

          <div style="margin-top: 1rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; opacity: 0.8;">
              <span>Last receiving inspection:</span>
              <span>WN-240315-02 - ✅ Passed</span>
            </div>
          </div>
        </div>

        <div class="card factory-card" onclick="showFactoryDetails('cardamom')">
          <div class="title">🌿 Cardamom Quality Control</div>
          <div class="subtitle">Today: ${qcData.cardamom.inspections} total inspections • ${qcData.cardamom.receivingInspections} receiving</div>
          
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

          <div style="margin-top: 1rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; opacity: 0.8;">
              <span>Last receiving inspection:</span>
              <span>CD-240315-01 - ⚠️ Pass w/ warning</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity Log -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 class="title">📋 Recent QC Activity</h3>
            <button class="ghost" style="font-size: 0.8rem;" onclick="alert('Full activity log coming soon')">View All</button>
          </div>
          <div style="margin-top: 1rem;">
            <div class="qc-activity-item pass">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>14:30</strong> - Pistachio receiving inspection
                  <div style="font-size: 0.85rem; opacity: 0.8;">Lot GH-240315-01: Pecan Halves from ALPI USA</div>
                </div>
                <span style="color: #22c55e; font-weight: bold;">✅ ACCEPTED</span>
              </div>
            </div>
            
            <div class="qc-activity-item fail">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>13:15</strong> - Pistachio in-process test
                  <div style="font-size: 0.85rem; opacity: 0.8;">Lot EX-240315-02: Size deviation detected</div>
                </div>
                <span style="color: #ef4444; font-weight: bold;">❌ REJECTED</span>
              </div>
            </div>
            
            <div class="qc-activity-item pass">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>12:45</strong> - Walnut receiving inspection
                  <div style="font-size: 0.85rem; opacity: 0.8;">Lot WN-240315-01: All parameters within limits</div>
                </div>
                <span style="color: #22c55e; font-weight: bold;">✅ ACCEPTED</span>
              </div>
            </div>
            
            <div class="qc-activity-item warning">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>11:30</strong> - Cardamom final inspection
                  <div style="font-size: 0.85rem; opacity: 0.8;">Lot CD-240315-01: Moisture slightly elevated</div>
                </div>
                <span style="color: #f59e0b; font-weight: bold;">⚠️ ACCEPTED w/ WARNING</span>
              </div>
            </div>
          </div>
        </div>

        <!-- QC Performance Trends -->
        <div class="card">
          <h3 class="title">📈 Performance Trends</h3>
          <div style="margin-top: 1rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
              <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary);">7 days</div>
                <div style="font-size: 0.8rem; opacity: 0.8;">Avg response time</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary);">2.3%</div>
                <div style="font-size: 0.8rem; opacity: 0.8;">Rejection rate</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary);">156</div>
                <div style="font-size: 0.8rem; opacity: 0.8;">Tests this week</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary);">98.1%</div>
                <div style="font-size: 0.8rem; opacity: 0.8;">Week avg. pass rate</div>
              </div>
            </div>
            <div style="text-align: center; margin-top: 1rem;">
              <button class="ghost" onclick="alert('Detailed analytics dashboard coming soon')">📊 View Detailed Analytics</button>
            </div>
          </div>
        </div>
      </section>
    `;
    
    // Make functions globally available for onclick handlers
    window.showReceivingInspection = showReceivingInspection;
    window.showFactoryDetails = showFactoryDetails;
  }
  
  function showReceivingInspection() {
    currentView = 'receiving-inspection';
    
    // Clear the mount and show the receiving inspection form
    mount.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <button class="ghost" onclick="showDashboard()" style="margin-bottom: 1rem;">
          ← Back to QC Dashboard
        </button>
      </div>
    `;
    
    // Create a container for the inspection form
    const inspectionContainer = document.createElement('div');
    mount.appendChild(inspectionContainer);
    
    // Load the inspection form
    ReceivingQCInspection(inspectionContainer);
    
    // Make dashboard function globally available
    window.showDashboard = showDashboard;
  }
  
  function showFactoryDetails(factory) {
    alert(`Detailed ${factory} QC dashboard coming soon. This would show:\n\n• Historical pass/fail rates\n• Batch tracking\n• Specific test results\n• Corrective actions\n• Supplier performance\n• Trend analysis`);
  }
}

// Additional CSS for QC activity items (add to qc-styles.css)
const additionalStyles = `
.qc-activity-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid var(--border);
  transition: all 0.2s ease;
}

.qc-activity-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.qc-activity-item.pass {
  border-left-color: #22c55e;
  background: rgba(34, 197, 94, 0.05);
}

.qc-activity-item.warning {
  border-left-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
}

.qc-activity-item.fail {
  border-left-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}
`;

// Inject additional styles
if (!document.getElementById('qc-additional-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'qc-additional-styles';
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
}
