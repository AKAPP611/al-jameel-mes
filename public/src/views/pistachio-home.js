import { goTo } from '../app.js';

export function PistachioHome(mount, { t }) {
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <h2 class="section">🥜 ${t('pistachioWS')}</h2>
        <p class="section-sub">Golden Hill & Extra — sizes 18–21 / 21–25</p>
        <div class="row" style="gap:12px;margin-top:12px;">
          <button class="btn" id="goShift">${t('shiftEntry')}</button>
          <button class="ghost" id="goMaterials">${t('materials')}</button>
        </div>
      </div>

      <div class="card">
        <h3 class="title">What can you do here?</h3>
        <ul style="margin:8px 0 0 18px;">
          <li>Enter shift totals for **Huller Run** or **Repacking Only**.</li>
          <li>Track consumables: **10 kg vacuum bags** and **packing boxes**.</li>
          <li>Record reject byproducts with **color codes**.</li>
          <li>Export materials usage to **CSV**.</li>
        </ul>
      </div>
    </section>
  `;

  mount.querySelector('#goShift').addEventListener('click', ()=> goTo('#/shift/new', { factory: 'Pistachio' }));
  mount.querySelector('#goMaterials').addEventListener('click', ()=> goTo('#/materials', { factory: 'Pistachio' }));
}
