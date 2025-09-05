// dashboard-widgets.js - Dashboard widget components

export function InventoryWidget({ factoryId, state }) {
  const totalItems = state.items.length;
  const lowStockItems = state.inventory.filter(inv => {
    const item = state.items.find(item => item.sku === inv.sku);
    return item && item.minStock && inv.qty <= item.minStock;
  }).length;
  
  const totalValue = state.inventory.reduce((total, inv) => {
    const item = state.items.find(item => item.sku === inv.sku);
    if (item && item.unitCost) {
      return total + (inv.qty * item.unitCost);
    }
    return total;
  }, 0);
  
  return `
    <div class="widget-card">
      <div class="widget-header">
        <h3>📦 Inventory Overview</h3>
        <a href="#/inventory/${factoryId}" class="widget-link">View All →</a>
      </div>
      
      <div class="widget-stats">
        <div class="stat">
          <div class="stat-value">${totalItems}</div>
          <div class="stat-label">Total Items</div>
        </div>
        <div class="stat ${lowStockItems > 0 ? 'warning' : 'success'}">
          <div class="stat-value">${lowStockItems}</div>
          <div class="stat-label">Low Stock</div>
        </div>
        <div class="stat">
          <div class="stat-value">$${Math.round(totalValue).toLocaleString()}</div>
          <div class="stat-label">Total Value</div>
        </div>
      </div>
      
      ${lowStockItems > 0 ? `
        <div class="widget-alerts">
          <div class="alert warning">
            ⚠️ ${lowStockItems} item${lowStockItems > 1 ? 's' : ''} running low on stock
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function OrdersWidget({ factoryId, state }) {
  const orders = state.orders || [];
  const draftOrders = orders.filter(o => o.status === 'DRAFT').length;
  const reservedOrders = orders.filter(o => o.status === 'RESERVED').length;
  const fulfilledOrders = orders.filter(o => o.status === 'FULFILLED').length;
  
  const pendingValue = orders
    .filter(o => ['DRAFT', 'RESERVED'].includes(o.status))
    .reduce((sum, o) => sum + o.totalValue, 0);
  
  return `
    <div class="widget-card">
      <div class="widget-header">
        <h3>📋 Orders Status</h3>
        <a href="#/orders/${factoryId}" class="widget-link">View All →</a>
      </div>
      
      <div class="widget-stats">
        <div class="stat">
          <div class="stat-value">${orders.length}</div>
          <div class="stat-label">Total Orders</div>
        </div>
        <div class="stat ${reservedOrders > 0 ? 'warning' : 'success'}">
          <div class="stat-value">${draftOrders + reservedOrders}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat success">
          <div class="stat-value">${fulfilledOrders}</div>
          <div class="stat-label">Fulfilled</div>
        </div>
      </div>
      
      ${pendingValue > 0 ? `
        <div class="widget-info">
          <strong>Pending Value:</strong> $${pendingValue.toFixed(2)}
        </div>
      ` : ''}
    </div>
  `;
}

export function RecentActivityWidget({ state }) {
  const recentMovements = (state.movements || [])
    .slice(-5)
    .reverse()
    .map(movement => ({
      ...movement,
      type: movement.type,
      timestamp: movement.timestamp,
      sku: movement.sku,
      quantity: movement.quantity,
      reason: movement.reason
    }));
  
  return `
    <div class="widget-card">
      <div class="widget-header">
        <h3>📈 Recent Activity</h3>
      </div>
      
      <div class="activity-list">
        ${recentMovements.length === 0 ? `
          <div class="no-activity">No recent activity</div>
        ` : recentMovements.map(movement => `
          <div class="activity-item">
            <div class="activity-icon ${movement.type.toLowerCase()}">
              ${movement.type === 'IN' ? '📥' : '📤'}
            </div>
            <div class="activity-content">
              <div class="activity-title">
                ${movement.type === 'IN' ? 'Stock Added' : 'Stock Removed'}
              </div>
              <div class="activity-details">
                ${movement.sku} • ${movement.quantity} units • ${movement.reason.replace(/_/g, ' ')}
              </div>
              <div class="activity-time">
                ${formatTimeAgo(movement.timestamp)}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function AlertsWidget({ state }) {
  const alerts = [];
  
  // Low stock alerts
  state.inventory.forEach(inv => {
    const item = state.items.find(item => item.sku === inv.sku);
    if (item && item.minStock && inv.qty <= item.minStock) {
      alerts.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Low Stock Alert',
        message: `${item.name} is running low (${inv.qty} ${item.uom} remaining)`,
        action: `#/inventory/${state.factoryId}`
      });
    }
  });
  
  // Reserved stock alerts
  const reservedOrders = (state.orders || []).filter(o => o.status === 'RESERVED');
  if (reservedOrders.length > 0) {
    alerts.push({
      type: 'info',
      icon: '📋',
      title: 'Orders Awaiting Fulfillment',
      message: `${reservedOrders.length} reserved order${reservedOrders.length > 1 ? 's' : ''} ready to ship`,
      action: `#/orders/${state.factoryId}`
    });
  }
  
  return `
    <div class="widget-card">
      <div class="widget-header">
        <h3>🔔 Alerts & Notifications</h3>
      </div>
      
      <div class="alerts-list">
        ${alerts.length === 0 ? `
          <div class="no-alerts">
            <div style="text-align: center; padding: 2rem; color: var(--muted);">
              ✅ All systems running smoothly
            </div>
          </div>
        ` : alerts.map(alert => `
          <div class="alert ${alert.type}">
            <div class="alert-icon">${alert.icon}</div>
            <div class="alert-content">
              <div class="alert-title">${alert.title}</div>
              <div class="alert-message">${alert.message}</div>
              ${alert.action ? `
                <a href="${alert.action}" class="alert-action">View Details →</a>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Helper function
function formatTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
