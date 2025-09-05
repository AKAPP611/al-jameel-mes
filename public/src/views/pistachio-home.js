// pistachio-home.js - Pistachio workspace home
import { goTo } from '../app.js';

export function PistachioHome(mount, { t }) {
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <h2 class="section">🥜 ${t('pistachioWS')}</h2>
        <p class="section-sub">Golden Hill & Extra — sizes 18–21 / 21–25</p>
       <div class="row" style="gap:12px;margin-top:12px;">
          <button class="btn" id="goDashboard">📊 Dashboard</button>
          <button class="btn" id="goInventory">📦 Inventory</button>
          <button class="btn" id="goOrders">📋 Orders</button>
        </div>
        <div class="row" style="gap:12px;margin-top:8px;">
          <button class="ghost" id="goShift">${t('shiftEntry')}</button>
          <button class="ghost" id="goMaterials">${t('materials')}</button>
        </div>
      </div>

      <div class="card">
        <h3 class="title">What can you do here?</h3>
        <ul style="margin:8px 0 0 18px;">
          <li>Enter shift totals for <strong>Huller Run</strong> or <strong>Repacking Only</strong>.</li>
          <li>Track consumables: <strong>10 kg vacuum bags</strong> and <strong>packing boxes</strong>.</li>
          <li>Record reject byproducts with <strong>color codes</strong>.</li>
          <li>Export materials usage to <strong>CSV</strong>.</li>
        </ul>
      </div>

      <div class="card">
        <h3 class="title">Production Overview</h3>
        <p>This workspace handles pistachio processing for two main brands:</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
          <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
            <h4 style="margin: 0 0 0.5rem; color: var(--primary);">Golden Hill</h4>
            <p style="margin: 0; font-size: 14px;">Premium brand with sizes 18-21 and 21-25</p>
          </div>
          <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
            <h4 style="margin: 0 0 0.5rem; color: var(--primary);">Extra</h4>
            <p style="margin: 0; font-size: 14px;">Standard quality with sizes 18-21 and 21-25</p>
          </div>
        </div>
      </div>
    </section>
  `;

  /// Event listeners
  const dashboardBtn = mount.querySelector('#goDashboard');
  const inventoryBtn = mount.querySelector('#goInventory');
  const ordersBtn = mount.querySelector('#goOrders');
  const shiftBtn = mount.querySelector('#goShift');
  const materialsBtn = mount.querySelector('#goMaterials');

  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', () => {
      goTo('#/dashboard/pistachio');
    });
  }

  if (inventoryBtn) {
    inventoryBtn.addEventListener('click', () => {
      goTo('#/inventory/pistachio');
    });
  }

  if (ordersBtn) {
    ordersBtn.addEventListener('click', () => {
      goTo('#/orders/pistachio');
    });
  }

  if (shiftBtn) {
    shiftBtn.addEventListener('click', () => {
      goTo('#/shift/new', { factory: 'Pistachio' });
    });
  }

  if (materialsBtn) {
    materialsBtn.addEventListener('click', () => {
      goTo('#/materials', { factory: 'Pistachio' });
    });
  }
}
