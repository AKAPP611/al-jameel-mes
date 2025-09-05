// master-inventory-view.js - Centralized inventory overview
import { inventoryState } from '../data/inventory-state.js';

const factories = [
  { id: 'pistachio', name: 'Pistachio Factory', icon: '🥜', color: '#8b5cf6' },
  { id: 'walnut', name: 'Walnut Factory', icon: '🌰', color: '#92400e' },
  { id: 'cardamom', name: 'Cardamom Factory', icon: '🌿', color: '#22c55e' },
  { id: 'almonds', name: 'Almonds Factory', icon: '🥥', color: '#f59e0b' }
];

export function MasterInventoryView(mount, { t }) {
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <h2 class="section">📦 Master Inventory Overview</h2>
            <p class="section-sub">Centralized warehouse management across all facilities</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="ghost" onclick="refreshMasterInventory()">🔄 Refresh All</button>
            <button class="btn" onclick="generateConsolidatedReport()">📄 Consolidated Report</button>
          </div>
        </div>
        
        <div id="masterSummary" class="grid grid-4" style="margin-bottom: 2rem;">
          <!-- Master KPIs will be populated here -->
        </div>
      </div>

      <!-- Factory Cards Grid -->
      <div id="factoryGrid" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
        <!-- Factory inventory cards will be populated here -->
      </div>

      <!-- Consolidated Tables -->
      <div class="card">
        <h3 class="title">Low Stock Alerts Across All Facilities</h3>
        <div id="lowStockTable" style="overflow-x: auto;">
          <!-- Low stock items from all factories -->
        </div>
      </div>

      <div class="card">
        <h3 class="title">Recent Stock Movements (All Factories)</h3>
        <div id="recentMovements" style="overflow-x: auto;">
          <!-- Recent movements from all factories -->
        </div>
      </div>
    </section>
  `;

  // Make functions globally available
  window.refreshMasterInventory = loadMasterInventoryData;
  window.generateConsolidatedReport = generateConsolidatedReport;
  window.navigateToFactory = navigateToFactory;

  // Load initial data
  loadMasterInventoryData();
}

async function loadMasterInventoryData() {
  try {
    const allFactoryData = {};
    
    // Load data for each factory
    for (const factory of factories) {
      await inventoryState.loadSeedIfEmpty(factory.id);
      allFactoryData[factory.id] = inventoryState.getState(factory.id);
    }
    
    renderMasterSummary(allFactoryData);
    renderFactoryCards(allFactoryData);
    renderLowStockTable(allFactoryData);
    renderRecentMovements(allFactoryData);
    
  } catch (error) {
    console.error('Failed to load master inventory data:', error);
  }
}

function renderMasterSummary(allFactoryData) {
  let totalItems = 0;
  let totalValue = 0;
  let lowStockCount = 0;
  let activeFactories = 0;

  Object.entries(allFactoryData).forEach(([factoryId, data]) => {
    if (data.items && data.items.length > 0) {
      activeFactories++;
      totalItems += data.items.length;
      
      // Calculate total value
      data.inventory.forEach(inv => {
        const item = data.items.find(item => item.sku === inv.sku);
        if (item && item.unitCost) {
          totalValue += inv.qty * item.unitCost;
        }
      });
      
      // Count low stock items
      data.inventory.forEach(inv => {
        const item = data.items.find(item => item.sku === inv.sku);
        if (item && item.minStock && inv.qty <= item.minStock) {
          lowStockCount++;
        }
      });
    }
  });

  document.getElementById('masterSummary').innerHTML = `
    <div class="kpi">
      <div class="label">Active Factories</div>
      <div class="value">${activeFactories}</div>
    </div>
    <div class="kpi">
      <div class="label">Total Items</div>
      <div class="value">${totalItems}</div>
    </div>
    <div class="kpi ${lowStockCount > 0 ? 'warn' : 'ok'}">
      <div class="label">Low Stock Alerts</div>
      <div class="value">${lowStockCount}</div>
    </div>
    <div class="kpi">
      <div class="label">Total Value</div>
      <div class="value">$${Math.round(totalValue).toLocaleString()}</div>
    </div>
  `;
}

function renderFactoryCards(allFactoryData) {
  const factoryGrid = document.getElementById('factoryGrid');
  
  const cards = factories.map(factory => {
    const data = allFactoryData[factory.id];
    const hasData = data && data.items && data.items.length > 0;
    
    if (!hasData) {
      return `
        <div class="card" style="border-left: 4px solid #6b7280; opacity: 0.6;">
          <div style="display: flex; align-items: center; margin-bottom: 1rem;">
            <span style="font-size: 2rem; margin-right: 1rem;">${factory.icon}</span>
            <div>
              <h3 style="margin: 0; color: var(--primary);">${factory.name}</h3>
              <p style="margin: 0; color: var(--muted); font-size: 0.9rem;">No data available</p>
            </div>
          </div>
          <div style="text-align: center; padding: 2rem; color: var(--muted);">
            <p>Inventory system not configured</p>
            <button class="ghost" onclick="navigateToFactory('${factory.id}')">Configure Inventory</button>
          </div>
        </div>
      `;
    }

    // Calculate factory metrics
    const totalItems = data.items.length;
    const totalValue = data.inventory.reduce((total, inv) => {
      const item = data.items.find(item => item.sku === inv.sku);
      return total + (item?.unitCost ? inv.qty * item.unitCost : 0);
    }, 0);
    
    const lowStockItems = data.inventory.filter(inv => {
      const item = data.items.find(item => item.sku === inv.sku);
      return item && item.minStock && inv.qty <= item.minStock;
    }).length;

    const recentMovements = (data.movements || []).slice(-3);

    return `
      <div class="card" style="border-left: 4px solid ${factory.color};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center;">
            <span style="font-size: 2.5rem; margin-right: 1rem;">${factory.icon}</span>
            <div>
              <h3 style="margin: 0; color: var(--primary);">${factory.name}</h3>
              <p style="margin: 0; color: var(--muted); font-size: 0.9rem;">Factory ID: ${factory.id}</p>
            </div>
          </div>
          <button class="btn" onclick="navigateToFactory('${factory.id}')" style="background: ${factory.color};">
            Manage →
          </button>
        </div>

        <div class="grid grid-3" style="gap: 1rem; margin-bottom: 1.5rem;">
          <div class="kpi">
            <div class="label">Items</div>
            <div class="value">${totalItems}</div>
          </div>
          <div class="kpi ${lowStockItems > 0 ? 'warn' : 'ok'}">
            <div class="label">Low Stock</div>
            <div class="value">${lowStockItems}</div>
          </div>
          <div class="kpi">
            <div class="label">Value</div>
            <div class="value">$${Math.round(totalValue).toLocaleString()}</div>
          </div>
        </div>

        ${lowStockItems > 0 ? `
          <div style="background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 1rem; font-size: 0.85rem;">
            ⚠️ ${lowStockItems} item${lowStockItems > 1 ? 's' : ''} running low on stock
          </div>
        ` : ''}

        <div style="margin-bottom: 1rem;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: var(--muted);">Recent Activity</h4>
          ${recentMovements.length > 0 ? recentMovements.map(movement => `
            <div style="font-size: 0.8rem; color: var(--muted); margin-bottom: 0.25rem;">
              ${movement.type === 'IN' ? '📥' : '📤'} ${movement.sku} • ${movement.quantity} units
            </div>
          `).join('') : '<div style="font-size: 0.8rem; color: var(--muted);">No recent activity</div>'}
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <button class="ghost" onclick="navigateToFactory('${factory.id}')" style="flex: 1; font-size: 0.85rem;">
            View Inventory
          </button>
          <button class="ghost" onclick="navigateToOrders('${factory.id}')" style="flex: 1; font-size: 0.85rem;">
            View Orders
          </button>
        </div>
      </div>
    `;
  }).join('');

  factoryGrid.innerHTML = cards;
}

function renderLowStockTable(allFactoryData) {
  const lowStockItems = [];
  
  Object.entries(allFactoryData).forEach(([factoryId, data]) => {
    if (data.items && data.inventory) {
      data.inventory.forEach(inv => {
        const item = data.items.find(item => item.sku === inv.sku);
        if (item && item.minStock && inv.qty <= item.minStock) {
          const factory = factories.find(f => f.id === factoryId);
          lowStockItems.push({
            factory: factory?.name || factoryId,
            factoryId,
            factoryIcon: factory?.icon || '🏭',
            item: item.name,
            sku: item.sku,
            currentStock: inv.qty,
            minStock: item.minStock,
            uom: item.uom,
            shortage: item.minStock - inv.qty
          });
        }
      });
    }
  });

  const tableContainer = document.getElementById('lowStockTable');
  
  if (lowStockItems.length === 0) {
    tableContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--muted);">
        ✅ No low stock alerts across all facilities
      </div>
    `;
    return;
  }

  // Sort by severity (shortage amount)
  lowStockItems.sort((a, b) => b.shortage - a.shortage);

  tableContainer.innerHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: var(--primary); color: white;">
          <th style="padding: 0.75rem; text-align: left;">Factory</th>
          <th style="padding: 0.75rem; text-align: left;">Item</th>
          <th style="padding: 0.75rem; text-align: left;">SKU</th>
          <th style="padding: 0.75rem; text-align: right;">Current</th>
          <th style="padding: 0.75rem; text-align: right;">Minimum</th>
          <th style="padding: 0.75rem; text-align: right;">Shortage</th>
          <th style="padding: 0.75rem; text-align: center;">Action</th>
        </tr>
      </thead>
      <tbody>
        ${lowStockItems.map(item => `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 0.75rem;">
              <div style="display: flex; align-items: center;">
                <span style="margin-right: 0.5rem;">${item.factoryIcon}</span>
                ${item.factory}
              </div>
            </td>
            <td style="padding: 0.75rem; font-weight: 600;">${item.item}</td>
            <td style="padding: 0.75rem; font-family: monospace;">${item.sku}</td>
            <td style="padding: 0.75rem; text-align: right; color: #ef4444; font-weight: bold;">
              ${item.currentStock} ${item.uom}
            </td>
            <td style="padding: 0.75rem; text-align: right;">${item.minStock} ${item.uom}</td>
            <td style="padding: 0.75rem; text-align: right; color: #ef4444; font-weight: bold;">
              ${item.shortage} ${item.uom}
            </td>
            <td style="padding: 0.75rem; text-align: center;">
              <button class="btn" onclick="navigateToFactory('${item.factoryId}')" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">
                Restock
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderRecentMovements(allFactoryData) {
  const allMovements = [];
  
  Object.entries(allFactoryData).forEach(([factoryId, data]) => {
    if (data.movements) {
      const factory = factories.find(f => f.id === factoryId);
      data.movements.forEach(movement => {
        allMovements.push({
          ...movement,
          factoryId,
          factoryName: factory?.name || factoryId,
          factoryIcon: factory?.icon || '🏭'
        });
      });
    }
  });

  // Sort by timestamp (newest first) and take last 10
  allMovements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recentMovements = allMovements.slice(0, 10);

  const container = document.getElementById('recentMovements');
  
  if (recentMovements.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--muted);">
        No recent stock movements recorded
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: var(--primary); color: white;">
          <th style="padding: 0.75rem; text-align: left;">Timestamp</th>
          <th style="padding: 0.75rem; text-align: left;">Factory</th>
          <th style="padding: 0.75rem; text-align: left;">Type</th>
          <th style="padding: 0.75rem; text-align: left;">SKU</th>
          <th style="padding: 0.75rem; text-align: right;">Quantity</th>
          <th style="padding: 0.75rem; text-align: left;">Reason</th>
        </tr>
      </thead>
      <tbody>
        ${recentMovements.map(movement => `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 0.75rem;">${new Date(movement.timestamp).toLocaleString()}</td>
            <td style="padding: 0.75rem;">
              <div style="display: flex; align-items: center;">
                <span style="margin-right: 0.5rem;">${movement.factoryIcon}</span>
                ${movement.factoryName}
              </div>
            </td>
            <td style="padding: 0.75rem;">
              <span style="background: ${movement.type === 'IN' ? '#22c55e' : '#ef4444'}; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem;">
                ${movement.type}
              </span>
            </td>
            <td style="padding: 0.75rem; font-family: monospace;">${movement.sku}</td>
            <td style="padding: 0.75rem; text-align: right; font-weight: bold;">${movement.quantity}</td>
            <td style="padding: 0.75rem;">${movement.reason.replace(/_/g, ' ')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function navigateToFactory(factoryId) {
  window.location.href = `index.html#/inventory/${factoryId}`;
}

function navigateToOrders(factoryId) {
  window.location.href = `index.html#/orders/${factoryId}`;
}

function generateConsolidatedReport() {
  // TODO: Implement consolidated reporting across all factories
  alert('Consolidated reporting across all factories - Coming soon!');
}
