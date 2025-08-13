import { t } from '../app.js';
import { Counter, bindCounter } from '../components/counter.js';
import { SimpleTable } from '../components/table.js';

const LS_MAT = 'materials_usage';

export function MaterialsView(mount){
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
        </div>
      </div>

      <div class="card" id="matTable"></div>
    </section>
  `;

  bindCounter(mount);
  renderTable();

  mount.querySelector('#addMat').addEventListener('click', ()=>{
    const bags = Number(document.getElementById('m_bags_add').value||0);
    const boxes = Number(document.getElementById('m_boxes_add').value||0);
    if (bags<=0 && boxes<=0) { alert('Enter a value.'); return; }
    const arr = JSON.parse(localStorage.getItem(LS_MAT) || '[]');
    arr.push({ ts:new Date().toISOString(), vacuum_bags_10kg:bags, packing_boxes:boxes });
    localStorage.setItem(LS_MAT, JSON.stringify(arr));
    document.getElementById('m_bags_add').value = 0;
    document.getElementById('m_boxes_add').value = 0;
    renderTable();
  });

  mount.querySelector('#exportCsv').addEventListener('click', exportCSV);
}

function renderTable(){
  const arr = JSON.parse(localStorage.getItem(LS_MAT) || '[]');
  const el = document.getElementById('matTable');
  el.innerHTML = SimpleTable({
    columns: [
      { key:'ts', label:'Timestamp', align:'start' },
      { key:'vacuum_bags_10kg', label:'Vacuum bags (10 kg)', align:'end' },
      { key:'packing_boxes', label:'Packing boxes', align:'end' }
    ],
    rows: arr
  });
}

function exportCSV(){
  const arr = JSON.parse(localStorage.getItem(LS_MAT) || '[]');
  const header = ['timestamp','vacuum_bags_10kg','packing_boxes'];
  const rows = arr.map(r=>[r.ts, r.vacuum_bags_10kg, r.packing_boxes]);
  const csv = [header.join(','), ...rows.map(r=>r.join(','))].join('\n');
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `materials_pistachio_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
