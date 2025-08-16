// pistachio-shift.js - Shift entry form
import { t, getParams } from '../app.js';
import { Counter, bindCounter } from '../components/counter.js';
import { Chip } from '../components/chip.js';

// In-memory storage
let shiftData = [];

export function PistachioShift(mount) {
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <h2 class="section">🥜 ${t('shiftEntry')}</h2>
        <p class="section-sub">Record pistachio production for this shift.</p>

        <div class="grid">
          <!-- Run type -->
          <div class="row" style="gap:12px;align-items:center">
            <strong style="min-inline-size:120px">${t('runType')}</strong>
            <label style="display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="runType" value="huller" checked> ${t('hullerRun')}
            </label>
            <label style="display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="runType" value="repack"> ${t('repackingOnly')}
            </label>
          </div>

          <!-- Raw format -->
          <div class="row" style="gap:12px;align-items:center">
            <strong style="min-inline-size:120px">${t('rawFormat')}</strong>
            <select id="rawFormat" class="form-control" style="max-width: 300px;">
              <option value="big_bag">${t('bigBag')} (~998.7 kg)</option>
              <option value="carton">${t('carton')} (11.34 kg)</option>
              <option value="bag25">${t('bag25')} (25 kg)</option>
            </select>
          </div>

          <!-- Final goods selection -->
          <div class="grid">
            <strong>${t('finalGoods')}</strong>
            <div class="row" style="gap:12px;flex-wrap:wrap">
              <label style="display: flex; flex-direction: column; gap: 4px;">
                ${t('brand')}:
                <select id="brand" class="form-control" style="min-width: 150px;">
                  <option>Golden Hill</option>
                  <option>Extra</option>
                </select>
              </label>
              <label style="display: flex; flex-direction: column; gap: 4px;">
                ${t('size')}:
                <select id="size" class="form-control" style="min-width: 120px;">
                  <option>18-21</option>
                  <option>21-25</option>
                </select>
              </label>
              <label style="display: flex; flex-direction: column; gap: 4px;">
                ${t('qtyBags10kg')}:
                ${Counter({ id:'qtyBags', value:0, step:1, min:0 })}
              </label>
            </div>
          </div>

          <!-- Materials usage -->
          <div class="grid">
            <strong>${t('materials')}</strong>
            <div class="row" style="gap:20px;flex-wrap:wrap">
              <div>
                <label>${t('boxesUsed')}</label>
                ${Counter({ id:'boxesUsed', value:0, step:1 })}
              </div>
              <div>
                <label>${t('bagsUsed')}</label>
                ${Counter({ id:'bagsUsed', value:0, step:1 })}
              </div>
              <div>
                <label>${t('boxesWaste')}</label>
                ${Counter({ id:'boxesWaste', value:0, step:1 })}
              </div>
              <div>
                <label>${t('bagsWaste')}</label>
                ${Counter({ id:'bagsWaste', value:0, step:1 })}
              </div>
            </div>
            <p class="section-sub">Repacking Only mode: rejects section is hidden and not recorded.</p>
          </div>

          <!-- Rejects -->
          <div id="rejectBlock">
            <strong>${t('rejects')}</strong>
            <div id="rejectGrid" class="grid grid-3"></div>
          </div>

          <!-- Actions -->
          <div class="row" style="gap:12px;margin-top:8px">
            <button class="ghost" id="clearBtn">${t('clear')}</button>
            <button class="ghost" id="saveDraftBtn">${t('saveDraft')}</button>
            <button class="btn" id="submitBtn">${t('submit')}</button>
          </div>
        </div>
      </div>
    </section>
  `;

  bindCounter(mount);
  setupRejects(mount);
  setupEventHandlers(mount);
}

function setupRejects(mount) {
  const rejectTypes = [
    { key: 'non_split', name: 'Non-Split (Closed)', color: '#8b4513' },
    { key: 'light_stain', name: 'Light Stain', color: '#daa520' },
    { key: 'adhering_hull', name: 'Adhering Hull', color: '#cd853f' },
    { key: 'dark_stain', name: 'Dark Stain', color: '#654321' },
    { key: 'shell_split', name: 'Shell & Split', color: '#d2691e' },
    { key: 'undersize', name: 'Undersize 30/64', color: '#bc8f8f' },
    { key: 'loose_shell', name: 'Loose Shell', color: '#f4a460' },
    { key: 'loose_kernel', name: 'Loose Kernel', color: '#ffd700' },
    { key: 'dust', name: 'Dust', color: '#c0c0c0' }
  ];

  const grid = mount.querySelector('#rejectGrid');
  grid.innerHTML = rejectTypes.map(r => {
    return `
      <div class="card" style="padding:14px">
        <div class="row" style="justify-content:space-between;align-items:center">
          <div>${Chip({ text: r.name, color: r.color })}</div>
        </div>
        <div style="margin-top:8px">
          <small>kg (approx into big bags)</small>
          ${Counter({ id: `rej_${r.key}`, value: 0, step: 5 })}
        </div>
      </div>
    `;
  }).join('');
  
  bindCounter(grid);
}

function setupEventHandlers(mount) {
  // Toggle rejects visibility on run type change
  mount.addEventListener('change', (e) => {
    if (e.target.name === 'runType') {
      const isRepack = e.target.value === 'repack';
      const rejectBlock = mount.querySelector('#rejectBlock');
      if (rejectBlock) {
        rejectBlock.style.display = isRepack ? 'none' : 'block';
      }
    }
  });

  // Button handlers
  const clearBtn = mount.querySelector('#clearBtn');
  const saveDraftBtn = mount.querySelector('#saveDraftBtn');
  const submitBtn = mount.querySelector('#submitBtn');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => resetForm(mount));
  }

  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => saveDraft(mount));
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => submitShift(mount));
  }
}

function readValue(id) { 
  const el = document.getElementById(id); 
  return Number(el?.value || 0); 
}

function readText(id) { 
  const el = document.getElementById(id); 
  return el?.value || ''; 
}

function collectRejects() {
  const inputs = Array.from(document.querySelectorAll('[id^="rej_"]'));
  const obj = {};
  inputs.forEach(i => {
    const key = i.id.replace('rej_', '');
    obj[key] = Number(i.value || 0);
  });
  return obj;
}

function resetForm(mount) {
  mount.querySelectorAll('input[type="number"]').forEach(i => i.value = 0);
  alert('Form cleared');
}

function saveDraft(mount) {
  const runType = mount.querySelector('input[name="runType"]:checked')?.value || 'huller';
  const payload = buildPayload(runType);
  payload.status = 'draft';
  payload.timestamp = new Date().toISOString();
  
  shiftData.push(payload);
  alert('Draft saved locally');
}

function submitShift(mount) {
  const runType = mount.querySelector('input[name="runType"]:checked')?.value || 'huller';
  
  // Basic validation
  if (readValue('qtyBags') <= 0) { 
    alert('Enter final goods quantity (10 kg bags)'); 
    return; 
  }

  const payload = buildPayload(runType);
  payload.status = 'submitted';
  payload.timestamp = new Date().toISOString();
  payload.finishedKg = payload.finalGoods.qtyBags10kg * 10;
  payload.bags10 = payload.finalGoods.qtyBags10kg;
  payload.rejectsKg = Object.values(payload.rejects).reduce((sum, val) => sum + val, 0);
  
  shiftData.push(payload);
  
  alert('Shift submitted successfully!');
  resetForm(mount);
}

function buildPayload(runType) {
  const params = getParams();
  const factory = params.get('factory') || 'Pistachio';
  const rejects = (runType === 'repack') ? {} : collectRejects();
  
  return {
    factory,
    runType,
    rawFormat: readText('rawFormat'),
    finalGoods: {
      brand: readText('brand'),
      size: readText('size'),
      qtyBags10kg: readValue('qtyBags')
    },
    materials: {
      boxesUsed: readValue('boxesUsed'),
      bagsUsed: readValue('bagsUsed'),
      boxesWaste: readValue('boxesWaste'),
      bagsWaste: readValue('bagsWaste')
    },
    rejects
  };
}
