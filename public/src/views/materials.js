// materials.js - Materials tracking view
import { t } from '../app.js';
import { Counter, bindCounter } from '../components/counter.js';
import { SimpleTable } from '../components/table.js';

// In-memory storage
let materialsData = [];

export function MaterialsView(mount) {
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <h2 class="section">📦 ${t('editMaterials')}</h2>
        <p class="section-sub">Track consumables for pistachio line (10 kg vacuum bags & boxes).</p>

        <div class="row" style="gap:20px;flex-wrap:wrap">
          <div>
            <label>${t('bagsUsed')}</label>
            ${Counter({ id:'m_bags_add', value:0, step:1 })}
          </div>
          <div>
            <label>${t('boxesUsed')}</label>
            ${Counter({ id:'m_boxes_add', value:0, step:1 })}
          </div>
        </div>

        <div class="row" style="gap:12px;margin-top:12px">
          <button class="btn" id="addMat">${t('add')}</button>
          <button class="ghost" id="exportCsv">${t('csvExport')}</button>
          <button class="ghost" id="clearAll">Clear All</button>
        </div>
      </div>

      <div class="card" id="matTable">
        <h3>Materials Usage Log</h3>
        <div id="tableContainer"></div>
      </div>

      <div class="card">
        <h3>Usage Summary</h3>
        <div id="summaryStats" class="grid grid-3">
          <div class="kpi">
            <div class="label">Total Vacuum Bags</div>
            <div class="value" id="totalBags">0</div>
          </div>
          <div class="kpi">
            <div class="label">Total Boxes</div>
            <div class="value" id="totalBoxes">0</div>
          </div>
          <div class="kpi">
            <div class="label">Total Entries</div>
            <div class="value" id="totalEntries">0</div>
          </div>
        </div>
      </div>
    </section>
  `;

  bindCounter(mount);
  setupEventHandlers(mount);
  renderTable();
  updateSummary();
}

function setupEventHandlers(mount) {
  const addBtn = mount.querySelector('#addMat');
  const exportBtn = mount.querySelector('#exportCsv');
  const clearBtn = mount.querySelector('#clearAll');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const bags = Number(document.getElementById('m_bags_add')?.value || 0);
      const boxes = Number(document.getElementById('m_boxes_add')?.value || 0);
      
      if (bags <= 0 && boxes <= 0) { 
        alert('Enter a value for bags or boxes'); 
        return; 
      }
      
      const entry = {
        timestamp: new Date().toISOString(),
        vacuum_bags_10kg: bags,
        packing_boxes: boxes
      };
      
      materialsData.push(entry);
      
      // Reset form
      const bagsInput = document.getElementById('m_bags_add');
      const boxesInput = document.getElementById('m_boxes_add');
      if (bagsInput) bagsInput.value = 0;
      if (boxesInput) boxesInput.value = 0;
      
      renderTable();
      updateSummary();
      alert('Materials entry added');
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', exportCSV);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all materials data? This cannot be undone.')) {
        materialsData = [];
        renderTable();
        updateSummary();
      }
    });
  }
}

function renderTable() {
  const container = document.getElementById('tableContainer');
  if (!container) return;

  if (materialsData.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">No materials entries yet.</p>';
    return;
  }

  const formattedData = materialsData.map(entry => ({
    timestamp: new Date(entry.timestamp).toLocaleString(),
    vacuum_bags_10kg: entry.vacuum_bags_10kg,
    packing_boxes: entry.packing_boxes
  })).reverse(); // Show newest first

  container.innerHTML = SimpleTable({
    columns: [
      { key: 'timestamp', label: 'Timestamp', align: 'start' },
      { key: 'vacuum_bags_10kg', label: 'Vacuum bags (10 kg)', align: 'end' },
      { key: 'packing_boxes', label: 'Packing boxes', align: 'end' }
    ],
    rows: formattedData
  });
}

function updateSummary() {
  const totalBags = materialsData.reduce((sum, entry) => sum + entry.vacuum_bags_10kg, 0);
  const totalBoxes = materialsData.reduce((sum, entry) => sum + entry.packing_boxes, 0);
  const totalEntries = materialsData.length;

  const bagsEl = document.getElementById('totalBags');
  const boxesEl = document.getElementById('totalBoxes');
  const entriesEl = document.getElementById('totalEntries');

  if (bagsEl) bagsEl.textContent = totalBags;
  if (boxesEl) boxesEl.textContent = totalBoxes;
  if (entriesEl) entriesEl.textContent = totalEntries;
}

function exportCSV() {
  if (materialsData.length === 0) {
    alert('No data to export');
    return;
  }

  const header = ['timestamp', 'vacuum_bags_10kg', 'packing_boxes'];
  const rows = materialsData.map(r => [
    r.timestamp,
    r.vacuum_bags_10kg,
    r.packing_boxes
  ]);
  
  const csv = [
    header.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `materials_pistachio_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
