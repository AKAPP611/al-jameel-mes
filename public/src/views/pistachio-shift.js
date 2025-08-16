// pistachio-shift.js - COMPLETE VERSION
import { t, getParams } from '../app.js';
import { Counter, bindCounter } from '../components/counter.js';
import { Chip } from '../components/chip.js';

const LS_KEY = 'pending_shifts';

export function PistachioShift(mount){
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <h2 class="section">🥜 ${t('shiftEntry')}</h2>
        <p class="section-sub">Record pistachio production for this shift.</p>

        <div class="grid">
          <!-- Run type -->
          <div class="row" style="gap:12px;align-items:center">
            <strong style="min-inline-size:120px">${t('runType')}</strong>
            <label><input type="radio" name="runType" value="huller" checked> ${t('hullerRun')}</label>
            <label><input type="radio" name="runType" value="repack"> ${t('repackingOnly')}</label>
          </div>

          <!-- Raw format (informational) -->
          <div class="row" style="gap:12px;align-items:center">
            <strong style="min-inline-size:120px">${t('rawFormat')}</strong>
            <select id="rawFormat" style="padding:10px;border:1px solid #e5e7eb;border-radius:12px">
              <option value="big_bag">${t('bigBag')} (~998.7 kg)</option>
              <option value="carton">${t('carton')} (11.34 kg)</option>
              <option value="bag25">${t('bag25')} (25 kg)</option>
            </select>
          </div>

          <!-- Final goods selection -->
          <div class="grid">
            <strong>${t('finalGoods')}</strong>
            <div class="row" style="gap:12px;flex-wrap:wrap">
              <label>${t('brand')}:
                <select id="brand" style="padding:10px;border:1px solid #e5e7eb;border-radius:12px">
                  <option>Golden Hill</option>
                  <option>Extra</option>
                </select>
              </label>
              <label>${t('size')}:
                <select id="size" style="padding:10px;border:1px solid #e5e7eb;border-radius:12px">
                  <option>18-21</option>
                  <option>21-25</option>
                </select>
              </label>
              <label>${t('qtyBags10kg')}:
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

          <!-- Rejects (hidden for repack mode) -->
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

  // Default reject types if fetch fails
  const defaultRejects = [
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

  // Load rejects & create counters
  fetch('./src/data/mock/pistachio_reject_types.json')
    .then(r => r.json())
    .catch(() => defaultRejects) // Use default if fetch fails
    .then(list => {
      const grid = mount.querySelector('#rejectGrid');
      grid.innerHTML = list.map(r => {
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
    });

  // Toggle rejects visibility on run type change
  mount.addEventListener('change', (e) => {
    if (e.target.name === 'runType') {
      const isRepack = e.target.value === 'repack';
      mount.querySelector('#rejectBlock').style.display = isRepack ? 'none' : 'block';
    }
  });

  // Buttons
  mount.querySelector('#clearBtn').addEventListener('click', () => resetForm(mount));
  mount.querySelector('#saveDraftBtn').addEventListener('click', () => saveDraft(mount));
  mount.querySelector('#submitBtn').addEventListener('click', () => submitShift(mount));
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
  inputs.forEach(i => obj[i.id.replace('rej_', '')] = Number(i.value || 0));
  return obj;
}

function resetForm(mount) {
  mount.querySelectorAll('input[type="number"]').forEach(i => i.value = 0);
}

function saveDraft(mount) {
  const runType = mount.querySelector('input[name="runType"]:checked').value;
  const payload = buildPayload(runType);
  const arr = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  arr.push({ ...payload, status: 'draft', ts: new Date().toISOString() });
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
  alert('Draft saved locally.');
}

function submitShift(mount) {
  const runType = mount.querySelector('input[name="runType"]:checked').value;
  // Basic validation
  if (readValue('qtyBags') <= 0) { 
    alert('Enter final goods quantity (10 kg bags).'); 
    return; 
  }

  const payload = buildPayload(runType);
  
  // Save to pistachio_records for integration with production system
  const records = JSON.parse(localStorage.getItem('pistachio_records') || '[]');
  records.push({
    ...payload,
    status: 'submitted',
    ts: new Date().toISOString(),
    finishedKg: payload.finalGoods.qtyBags10kg * 10,
    bags10: payload.finalGoods.qtyBags10kg,
    rejectsKg: Object.values(payload.rejects).reduce((sum, val) => sum + val, 0)
  });
  localStorage.setItem('pistachio_records', JSON.stringify(records));
  
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
