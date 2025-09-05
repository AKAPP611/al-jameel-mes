// factory-select.js - Factory selection view with QC integration
import { t as getText } from '../app.js';

// Inline components
function KpiTile({ label, value, state = 'ok' }) {
  return `
    <div class="kpi ${state}" role="group" aria-label="${label}">
      <div class="label">${label}</div>
      <div class="value" aria-live="polite">${value}</div>
    </div>
  `;
}

function Progress({ value = 0 }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  return `
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${clamped}">
      <span style="inline-size:${clamped}%"></span>
    </div>
  `;
}

function Card({ icon, title, href = '#/' }) {
  return `
    <article class="card factory-card" role="listitem" style="text-align: center; padding: 2rem;">
      <a class="card-link" href="${href}" style="display:block; color:inherit; text-decoration:none" aria-label="${title}">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
          <div style="font-size: 5rem; line-height: 1;">
            ${icon || ''}
          </div>
          <div class="title" style="font-size: 1.5rem; font-weight: 900; margin: 0;">
            ${title}
          </div>
        </div>
      </a>
    </article>
  `;
}

// Factory data
const factories = [
  { key: "Pistachio", name: "Pistachio" },
  { key: "Walnut", name: "Walnut" },
  { key: "Cardamom", name: "Cardamom" }
];

export function FactorySelectView(mount) {
  // First render the loading skeleton
  mount.innerHTML = `
    <section class="grid" aria-labelledby="sectionTitle">
      <div style="text-align:center">
        <img src="./logo.ico" alt="Al Jameel Logo" 
             style="width:64px; height:64px; margin-bottom:0.5rem;" 
             onerror="this.style.display='none'">
        <h2 id="sectionTitle" class="section">Al Jameel MES</h2>
        <p class="section-sub">Pick a workspace to get started.</p>
      </div>
      
      <!-- Master Inventory Overview Button -->
      <div style="text-align: center; margin: 2rem 0; padding: 1.5rem; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 1rem; border: 2px solid #22c55e;">
        <button class="btn" onclick="goTo('#/inventory/overview')" style="font-size: 1.2rem; padding: 1rem 2rem; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
          📦 Master Inventory Overview
        </button>
        <p style="margin: 0.75rem 0 0 0; color: var(--muted); font-size: 0.95rem; font-weight: 500;">
          Centralized warehouse management across all factories
        </p>
      </div>
      
      <div id="factoryGrid" class="grid grid-3" role="list">
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
      </div>
    </section>
  `;

  // Make goTo function available globally
  if (typeof window.goTo === 'undefined') {
    window.goTo = function(path) {
      if (path.startsWith('#/')) {
        window.location.hash = path;
      } else {
        window.location.href = path;
      }
    };
  }

  // Simulate loading delay then render cards
  setTimeout(() => {
    renderCards(mount.querySelector('#factoryGrid'), factories);
  }, 500);
}

function renderCards(grid, factories) {
  // Generate simplified factory cards with enlarged logos
  const factoryCards = factories.map(f => {
    // Determine href for each factory
    let href = '#/';
    if (f.key === 'Pistachio') {
      href = './pistachio.html';
    } else if (f.key === 'Walnut') {
      href = './walnut.html';
    } else if (f.key === 'Cardamom') {
      href = './cardamom.html';
    } else {
      href = `#/dashboard?factory=${encodeURIComponent(f.key)}`;
    }
    
    // Factory icons - enlarged for better visibility
    let iconMarkup = '';
    if (f.key === 'Pistachio') {
      iconMarkup = '<img src="src/assets/icons/pistachio.png" class="ws-icon pistachio-icon"
