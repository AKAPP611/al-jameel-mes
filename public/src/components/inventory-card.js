// inventory-card.js - Inventory item card component
export function InventoryCard({ item, inventory, onStockChange }) {
  const stock = inventory.find(inv => inv.sku === item.sku);
  const currentQty = stock ? stock.qty : 0;
  const lowStock = currentQty <= (item.minStock || 0);
  
  return `
    <div class="card inventory-card" data-sku="${item.sku}">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <div>
          <h3 style="margin: 0; font-size: 1.1rem; color: var(--primary);">${item.name}</h3>
          <p style="margin: 0.25rem 0; color: var(--muted); font-size: 0.9rem;">${item.sku}</p>
          <span class="chip" style="background: ${getTypeColor(item.type)}; color: white; font-size: 0.75rem;">
            ${item.type.toUpperCase()}
          </span>
        </div>
        <div style="text-align: right;">
          <div class="kpi ${lowStock ? 'warn' : 'ok'}" style="margin: 0; padding: 0.5rem;">
            <div class="label">Current Stock</div>
            <div class="value">${currentQty} ${item.uom}</div>
          </div>
        </div>
      </div>
      
      ${lowStock ? `
        <div style="background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 0.5rem; border-radius: 0.25rem; margin-bottom: 1rem; font-size: 0.85rem;">
          ⚠️ Low stock warning! Minimum: ${item.minStock || 0} ${item.uom}
        </div>
      ` : ''}
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
        <button class="btn" onclick="showStockModal('${item.sku}', 'add')" style="font-size: 0.85rem; padding: 0.5rem;">
          ➕ Add Stock
        </button>
        <button class="ghost" onclick="showStockModal('${item.sku}', 'remove')" style="font-size: 0.85rem; padding: 0.5rem;">
          ➖ Remove Stock
        </button>
      </div>
      
      <div style="margin-top: 0.75rem; font-size: 0.8rem; color: var(--muted);">
        <div>Min: ${item.minStock || 0} ${item.uom} | Max: ${item.maxStock || 'N/A'} ${item.uom}</div>
        <div>Location: ${stock ? stock.location : 'Not stocked'}</div>
      </div>
    </div>
  `;
}

function getTypeColor(type) {
  const colors = {
    raw: '#8b5cf6',
    finished: '#22c55e', 
    packaging: '#f59e0b',
    byproduct: '#6b7280'
  };
  return colors[type] || '#6b7280';
}
