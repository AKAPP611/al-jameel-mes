// inventory-view.js - Main inventory management view
import { inventoryState } from '../data/inventory-state.js';
import { InventoryCard } from '../components/inventory-card.js';
import { StockModal, modalStyles } from '../components/stock-modal.js';

let currentFactoryId = 'pistachio';
let currentModalData = null;

export function InventoryView(mount, { t, factoryId = 'pistachio' }) {
  currentFactoryId = factoryId;
  
  // Add modal styles if not already added
  if (!document.getElementById('modal-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'modal-styles';
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
  }
  
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h2 class="section">📦 ${t('inventory')} - ${factoryId.charAt(0).toUpperCase() + factoryId.slice(1)}</h2>
            <p class="section-sub">Stock levels and operations</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="ghost" onclick="refreshInventory()">🔄 Refresh</button>
            <button class="btn" onclick="showMovementHistory()">📋 Movement History</button>
          </div>
        </div>
        
        <div id="inventorySummary" class="grid grid-3" style="margin-bottom: 2rem;">
          <!-- Summary KPIs will be populated here -->
        </div>
      </div>

      <div id="inventoryGrid" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));">
        <!-- Inventory cards will be populated here -->
      </div>

      <!-- Movement History Modal (hidden initially) -->
      <div id="movementModal" style="display: none;"></div>
      
      <!-- Stock Operation Modal (hidden initially) -->
      <div id="stockModal" style="display: none;"></div>
    </section>
  `;
  
  // Make functions globally available
  window.showStockModal = showStockModal;
  window.closeStockModal = closeStockModal;
  window.confirmStockOperation = confirmStockOperation;
  window.refreshInventory = () => renderInventory();
  window.showMovementHistory = showMovementHistory;
  
  // Load and render initial data
  loadInventoryData();
}

async function loadInventoryData() {
  try {
    await inventoryState.loadSeedIfEmpty(currentFactoryId);
    renderInventory();
  } catch (error) {
    console.error('Failed to load inventory data:', error);
    document.getElementById('inventoryGrid').innerHTML = `
      <div class="card" style="grid-column: 1 / -1;">
        <p style="color: #ef4444;">❌ Failed to load inventory data</p>
        <button class="btn" onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }
}

function renderInventory() {
  const state = inventoryState.getState(currentFactoryId);
  const { items, inventory } = state;
  
  // Render summary
  renderSummary(state);
  
  // Render inventory cards
  const inventoryGrid = document.getElementById('inventoryGrid');
  if (items.length === 0) {
    inventoryGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <h3>No Items Found</h3>
        <p>No inventory items configured for this factory.</p>
      </div>
    `;
    return;
  }
  
  inventoryGrid.innerHTML = items.map(item => 
    InventoryCard({ item, inventory })
  ).join('');
}

function renderSummary(state) {
  const totalItems = state.items.length;
  const totalValue = calculateTotalValue(state);
  const lowStockItems = getLowStockCount(state);
  
  document.getElementById('inventorySummary').innerHTML = `
    <div class="kpi">
      <div class="label">Total Items</div>
      <div class="value">${totalItems}</div>
    </div>
    <div class="kpi ${lowStockItems > 0 ? 'warn' : 'ok'}">
      <div class="label">Low Stock Alerts</div>
      <div class="value">${lowStockItems}</div>
    </div>
    <div class="kpi">
      <div class="label">Total Value</div>
      <div class="value">$${totalValue.toLocaleString()}</div>
    </div>
  `;
}

function calculateTotalValue(state) {
  return state.inventory.reduce((total, inv) => {
    const item = state.items.find(item => item.sku === inv.sku);
    if (item && item.unitCost) {
      return total + (inv.qty * item.unitCost);
    }
    return total;
  }, 0);
}

function getLowStockCount(state) {
  return state.inventory.filter(inv => {
    const item = state.items.find(item => item.sku === inv.sku);
    return item && item.minStock && inv.qty <= item.minStock;
  }).length;
}

function showStockModal(sku, operation) {
  const state = inventoryState.getState(currentFactoryId);
  const item = state.items.find(item => item.sku === sku);
  
  if (!item) {
    alert('Item not found');
    return;
  }
  
  currentModalData = { sku, operation, item };
  
  const modalContainer = document.getElementById('stockModal');
  modalContainer.innerHTML = StockModal({ sku, operation, item });
  modalContainer.style.display = 'block';
  
  // Focus on quantity input
  setTimeout(() => {
    document.getElementById('stockQuantity')?.focus();
  }, 100);
}

function closeStockModal(event) {
  if (event && event.target !== event.currentTarget) return;
  
  document.getElementById('stockModal').style.display = 'none';
  currentModalData = null;
}

function confirmStockOperation() {
  if (!currentModalData) return;
  
  const quantity = parseInt(document.getElementById('stockQuantity').value);
  const reason = document.getElementById('stockReason').value;
  const notes = document.getElementById('stockNotes').value;
  
  if (!quantity || quantity <= 0) {
    alert('Please enter a valid quantity');
    return;
  }
  
  const { sku, operation } = currentModalData;
  
  let success = false;
  if (operation === 'add') {
    success = inventoryState.addStock(currentFactoryId, sku, quantity, reason);
  } else {
    success = inventoryState.removeStock(currentFactoryId, sku, quantity, reason);
  }
  
  if (success) {
    alert(`Stock ${operation === 'add' ? 'added' : 'removed'} successfully!`);
    closeStockModal();
    renderInventory();
  } else {
    alert(`Failed to ${operation} stock. Check quantity and try again.`);
  }
}

function showMovementHistory() {
  const state = inventoryState.getState(currentFactoryId);
  const movements = state.movements.slice().reverse(); // Show newest first
  
  const modalContainer = document.getElementById('movementModal');
  modalContainer.innerHTML = `
    <div class="modal-overlay" onclick="closeMovementModal(event)">
      <div class="modal-content" style="max-width: 800px;" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>📋 Stock Movement History</h3>
          <button class="modal-close" onclick="closeMovementModal()">&times;</button>
        </div>
        
        <div class="modal-body">
          ${movements.length === 0 ? `
            <p style="text-align: center; color: var(--muted); padding: 2rem;">
              No stock movements recorded yet.
            </p>
          ` : `
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: var(--primary); color: white;">
                    <th style="padding: 0.75rem; text-align: left;">Date</th>
                    <th style="padding: 0.75rem; text-align: left;">Type</th>
                    <th style="padding: 0.75rem; text-align: left;">SKU</th>
                    <th style="padding: 0.75rem; text-align: right;">Quantity</th>
                    <th style="padding: 0.75rem; text-align: left;">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  ${movements.map(movement => `
                    <tr style="border-bottom: 1px solid var(--border);">
                      <td style="padding: 0.75rem;">${new Date(movement.timestamp).toLocaleDateString()}</td>
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
            </div>
          `}
        </div>
        
        <div class="modal-footer">
          <button class="ghost" onclick="closeMovementModal()">Close</button>
        </div>
      </div>
    </div>
  `;
  modalContainer.style.display = 'block';
  
  // Make close function available
  window.closeMovementModal = function(event) {
    if (event && event.target !== event.currentTarget) return;
    modalContainer.style.display = 'none';
  };
}
