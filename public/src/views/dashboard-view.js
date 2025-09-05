// dashboard-view.js - Main inventory dashboard
import { inventoryState } from '../data/inventory-state.js';
import { InventoryWidget, OrdersWidget, RecentActivityWidget, AlertsWidget } from '../components/dashboard-widgets.js';

let currentFactoryId = 'pistachio';

export function DashboardView(mount, { t, factoryId = 'pistachio' }) {
  currentFactoryId = factoryId;
  
  // Load dashboard styles if not already loaded
  if (!document.getElementById('dashboard-styles')) {
    const link = document.createElement('link');
    link.id = 'dashboard-styles';
    link.rel = 'stylesheet';
    link.href = './src/styles/dashboard.css';
    document.head.appendChild(link);
  }
  
  mount.innerHTML = `
    <section>
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h2 class="section">📊 Dashboard - ${factoryId.charAt(0).toUpperCase() + factoryId.slice(1)}</h2>
            <p class="section-sub">Real-time inventory and order overview</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="ghost" onclick="refreshDashboard()">🔄 Refresh</button>
            <button class="btn" onclick="generateReport()">📄 Generate Report</button>
          </div>
        </div>
        
        <div id="dashboardSummary" class="grid grid-3" style="margin-bottom: 2rem;">
          <!-- Quick stats will be populated here -->
        </div>
      </div>

      <div id="dashboardWidgets" class="dashboard-grid">
        <!-- Widgets will be populated here -->
      </div>
    </section>
  `;
  
  // Make functions globally available
  window.refreshDashboard = loadDashboardData;
  window.generateReport = generateReport;
  
  // Load initial data
  loadDashboardData();
}

async function loadDashboardData() {
  try {
    await inventoryState.loadSeedIfEmpty(currentFactoryId);
    renderDashboard();
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    document.getElementById('dashboardWidgets').innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="color: #ef4444;">❌ Failed to load dashboard data</p>
        <button class="btn" onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }
}

function renderDashboard() {
  const state = inventoryState.getState(currentFactoryId);
  
  // Render quick summary stats
  renderQuickStats(state);
  
  // Render dashboard widgets
  const widgetsContainer = document.getElementById('dashboardWidgets');
  widgetsContainer.innerHTML = [
    InventoryWidget({ factoryId: currentFactoryId, state }),
    OrdersWidget({ factoryId: currentFactoryId, state }),
    RecentActivityWidget({ state }),
    AlertsWidget({ state })
  ].join('');
}

function renderQuickStats(state) {
  const totalItems = state.items.length;
  const totalInventoryValue = calculateTotalInventoryValue(state);
  const totalOrders = state.orders?.length || 0;
  const pendingOrders = state.orders?.filter(o => ['DRAFT', 'RESERVED'].includes(o.status)).length || 0;
  
  document.getElementById('dashboardSummary').innerHTML = `
    <div class="kpi">
      <div class="label">Active Items</div>
      <div class="value">${totalItems}</div>
    </div>
    <div class="kpi">
      <div class="label">Inventory Value</div>
      <div class="value">$${Math.round(totalInventoryValue).toLocaleString()}</div>
    </div>
    <div class="kpi ${pendingOrders > 0 ? 'warn' : 'ok'}">
      <div class="label">Pending Orders</div>
      <div class="value">${pendingOrders}/${totalOrders}</div>
    </div>
  `;
}

function calculateTotalInventoryValue(state) {
  return state.inventory.reduce((total, inv) => {
    const item = state.items.find(item => item.sku === inv.sku);
    if (item && item.unitCost) {
      return total + (inv.qty * item.unitCost);
    }
    return total;
  }, 0);
}

function generateReport() {
  const state = inventoryState.getState(currentFactoryId);
  
  // Create a comprehensive report
  const report = {
    factoryId: currentFactoryId,
    generatedAt: new Date().toISOString(),
    summary: {
      totalItems: state.items.length,
      totalInventoryValue: calculateTotalInventoryValue(state),
      totalOrders: state.orders?.length || 0,
      lowStockItems: getLowStockItems(state).length
    },
    inventory: state.inventory.map(inv => {
      const item = state.items.find(item => item.sku === inv.sku);
      return {
        sku: inv.sku,
        name: item?.name || 'Unknown',
        currentStock: inv.qty,
        minStock: item?.minStock || 0,
        maxStock: item?.maxStock || 0,
        value: (inv.qty * (item?.unitCost || 0)),
        status: item?.minStock && inv.qty <= item.minStock ? 'LOW_STOCK' : 'OK'
      };
    }),
    movements: state.movements.slice(-20), // Last 20 movements
    orders: state.orders || []
  };
  
  // Convert to downloadable JSON
  const dataStr = JSON.stringify(report, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventory-report-${currentFactoryId}-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  
  alert('Report generated and downloaded successfully!');
}

function getLowStockItems(state) {
  return state.inventory.filter(inv => {
    const item = state.items.find(item => item.sku === inv.sku);
    return item && item.minStock && inv.qty <= item.minStock;
  });
}
