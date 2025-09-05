// order-view.js - Order management interface
import { inventoryState } from '../data/inventory-state.js';
import { OrderManager } from '../data/order-models.js';

let orderManager;
let currentFactoryId = 'pistachio';

export function OrderView(mount, { t, factoryId = 'pistachio' }) {
  currentFactoryId = factoryId;
  orderManager = new OrderManager(factoryId);
  
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h2 class="section">📋 ${t('orders')} - ${factoryId.charAt(0).toUpperCase() + factoryId.slice(1)}</h2>
            <p class="section-sub">Order Management & Fulfillment</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="ghost" onclick="refreshOrders()">🔄 Refresh</button>
            <button class="btn" onclick="showCreateOrderModal()">➕ New Order</button>
          </div>
        </div>
        
        <div id="orderSummary" class="grid grid-3" style="margin-bottom: 2rem;">
          <!-- Order summary KPIs -->
        </div>
      </div>

      <!-- Order Filters -->
      <div class="card">
        <h3 class="title">Filter Orders</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div>
            <label>Status</label>
            <select id="statusFilter" onchange="filterOrders()">
              <option value="">All Orders</option>
              <option value="DRAFT">Draft</option>
              <option value="RESERVED">Reserved</option>
              <option value="FULFILLED">Fulfilled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label>Customer</label>
            <input type="text" id="customerFilter" placeholder="Search customer..." onkeyup="filterOrders()">
          </div>
          <div style="display: flex; align-items: end;">
            <button class="ghost" onclick="clearFilters()" style="width: 100%;">Clear Filters</button>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div id="ordersList">
        <!-- Orders will be populated here -->
      </div>

      <!-- Modals -->
      <div id="orderModal" style="display: none;"></div>
    </section>
  `;
  
  // Make functions globally available
  window.showCreateOrderModal = showCreateOrderModal;
  window.refreshOrders = renderOrders;
  window.filterOrders = filterOrders;
  window.clearFilters = clearFilters;
  window.reserveOrder = reserveOrder;
  window.fulfillOrder = fulfillOrder;
  window.cancelOrder = cancelOrder;
  window.viewOrderDetails = viewOrderDetails;
  
  // Load initial data
  loadOrderData();
}

async function loadOrderData() {
  try {
    await inventoryState.loadSeedIfEmpty(currentFactoryId);
    renderOrders();
  } catch (error) {
    console.error('Failed to load order data:', error);
  }
}

function renderOrders() {
  const orders = orderManager.getOrders();
  
  // Render summary
  renderOrderSummary(orders);
  
  // Render orders list
  const ordersList = document.getElementById('ordersList');
  
  if (orders.length === 0) {
    ordersList.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <h3>No Orders Yet</h3>
        <p>Create your first order to get started with order management.</p>
        <button class="btn" onclick="showCreateOrderModal()">Create First Order</button>
      </div>
    `;
    return;
  }
  
  ordersList.innerHTML = orders.map(order => renderOrderCard(order)).join('');
}

function renderOrderSummary(orders) {
  const draft = orders.filter(o => o.status === 'DRAFT').length;
  const reserved = orders.filter(o => o.status === 'RESERVED').length;
  const fulfilled = orders.filter(o => o.status === 'FULFILLED').length;
  const totalValue = orders.reduce((sum, o) => sum + o.totalValue, 0);
  
  document.getElementById('orderSummary').innerHTML = `
    <div class="kpi">
      <div class="label">Total Orders</div>
      <div class="value">${orders.length}</div>
    </div>
    <div class="kpi ${reserved > 0 ? 'warn' : 'ok'}">
      <div class="label">Pending Orders</div>
      <div class="value">${draft + reserved}</div>
    </div>
    <div class="kpi">
      <div class="label">Total Value</div>
      <div class="value">$${totalValue.toLocaleString()}</div>
    </div>
  `;
}

function renderOrderCard(order) {
  const statusColors = {
    DRAFT: '#6b7280',
    RESERVED: '#f59e0b',
    FULFILLED: '#22c55e',
    CANCELLED: '#ef4444'
  };
  
  return `
    <div class="card order-card" style="margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <div>
          <h3 style="margin: 0; color: var(--primary);">${order.id}</h3>
          <p style="margin: 0.25rem 0; color: var(--muted);">${order.customerName}</p>
          <span style="background: ${statusColors[order.status]}; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: bold;">
            ${order.status}
          </span>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.2rem; font-weight: bold; color: var(--primary);">$${order.totalValue.toFixed(2)}</div>
          <div style="font-size: 0.8rem; color: var(--muted);">${order.items.length} items</div>
        </div>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <strong>Items:</strong>
        <div style="margin-top: 0.5rem;">
          ${order.items.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.9rem;">
              <span>${item.sku}</span>
              <span>${item.quantity} units</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem;">
        ${getOrderActions(order)}
      </div>
      
      <div style="margin-top: 0.75rem; font-size: 0.8rem; color: var(--muted);">
        Created: ${new Date(order.createdAt).toLocaleDateString()}
        ${order.fulfilledAt ? ` | Fulfilled: ${new Date(order.fulfilledAt).toLocaleDateString()}` : ''}
      </div>
    </div>
  `;
}

function getOrderActions(order) {
  switch (order.status) {
    case 'DRAFT':
      return `
        <button class="btn" onclick="reserveOrder('${order.id}')" style="font-size: 0.8rem;">Reserve</button>
        <button class="ghost" onclick="viewOrderDetails('${order.id}')" style="font-size: 0.8rem;">Edit</button>
        <button class="ghost" onclick="cancelOrder('${order.id}')" style="font-size: 0.8rem; color: #ef4444;">Cancel</button>
      `;
    case 'RESERVED':
      return `
        <button class="btn" onclick="fulfillOrder('${order.id}')" style="font-size: 0.8rem;">Fulfill</button>
        <button class="ghost" onclick="viewOrderDetails('${order.id}')" style="font-size: 0.8rem;">View</button>
        <button class="ghost" onclick="cancelOrder('${order.id}')" style="font-size: 0.8rem; color: #ef4444;">Cancel</button>
      `;
    case 'FULFILLED':
      return `
        <button class="ghost" onclick="viewOrderDetails('${order.id}')" style="font-size: 0.8rem;">View Details</button>
      `;
    case 'CANCELLED':
      return `
        <button class="ghost" onclick="viewOrderDetails('${order.id}')" style="font-size: 0.8rem;">View Details</button>
      `;
    default:
      return '';
  }
}

function showCreateOrderModal() {
  const state = inventoryState.getState(currentFactoryId);
  const availableItems = state.items.filter(item => item.status === 'active');
  
  const modalContainer = document.getElementById('orderModal');
  modalContainer.innerHTML = `
    <div class="modal-overlay" onclick="closeOrderModal(event)">
      <div class="modal-content" style="max-width: 600px;" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Create New Order</h3>
          <button class="modal-close" onclick="closeOrderModal()">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Customer Name</label>
            <input type="text" id="customerName" placeholder="Enter customer name" required>
          </div>
          
          <div class="form-group">
            <label>Customer Email</label>
            <input type="email" id="customerEmail" placeholder="customer@example.com">
          </div>
          
          <div class="form-group">
            <label>Order Items</label>
            <div id="orderItems">
              <div class="order-item" style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                <select class="item-sku">
                  <option value="">Select item...</option>
                  ${availableItems.map(item => `
                    <option value="${item.sku}" data-price="${item.salePrice || item.unitCost || 0}">
                      ${item.name} (${item.sku})
                    </option>
                  `).join('')}
                </select>
                <input type="number" class="item-quantity" placeholder="Qty" min="1">
                <button type="button" onclick="removeOrderItem(this)" style="background: #ef4444; color: white; border: none; padding: 0.5rem; border-radius: 0.25rem;">×</button>
              </div>
            </div>
            <button type="button" onclick="addOrderItem()" class="ghost" style="margin-top: 0.5rem;">+ Add Item</button>
          </div>
          
          <div class="form-group">
            <label>Notes</label>
            <textarea id="orderNotes" placeholder="Additional notes..." rows="2"></textarea>
          </div>
          
          <div style="text-align: right; font-weight: bold; font-size: 1.1rem; margin-top: 1rem;">
            Total: $<span id="orderTotal">0.00</span>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="ghost" onclick="closeOrderModal()">Cancel</button>
          <button class="btn" onclick="createOrder()">Create Order</button>
        </div>
      </div>
    </div>
  `;
  
  modalContainer.style.display = 'block';
  
  // Make functions available
  window.closeOrderModal = function(event) {
    if (event && event.target !== event.currentTarget) return;
    modalContainer.style.display = 'none';
  };
  
  window.addOrderItem = addOrderItem;
  window.removeOrderItem = removeOrderItem;
  window.createOrder = createOrder;
  
  // Add change listeners for price calculation
  modalContainer.addEventListener('change', calculateOrderTotal);
  modalContainer.addEventListener('input', calculateOrderTotal);
}

function addOrderItem() {
  const state = inventoryState.getState(currentFactoryId);
  const availableItems = state.items.filter(item => item.status === 'active');
  
  const orderItems = document.getElementById('orderItems');
  const newItem = document.createElement('div');
  newItem.className = 'order-item';
  newItem.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr auto; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;';
  
  newItem.innerHTML = `
    <select class="item-sku">
      <option value="">Select item...</option>
      ${availableItems.map(item => `
        <option value="${item.sku}" data-price="${item.salePrice || item.unitCost || 0}">
          ${item.name} (${item.sku})
        </option>
      `).join('')}
    </select>
    <input type="number" class="item-quantity" placeholder="Qty" min="1">
    <button type="button" onclick="removeOrderItem(this)" style="background: #ef4444; color: white; border: none; padding: 0.5rem; border-radius: 0.25rem;">×</button>
  `;
  
  orderItems.appendChild(newItem);
}

function removeOrderItem(button) {
  button.closest('.order-item').remove();
  calculateOrderTotal();
}

function calculateOrderTotal() {
  let total = 0;
  const orderItems = document.querySelectorAll('.order-item');
  
  orderItems.forEach(item => {
    const skuSelect = item.querySelector('.item-sku');
    const quantityInput = item.querySelector('.item-quantity');
    
    if (skuSelect.value && quantityInput.value) {
      const price = parseFloat(skuSelect.selectedOptions[0]?.dataset.price || 0);
      const quantity = parseInt(quantityInput.value || 0);
      total += price * quantity;
    }
  });
  
  document.getElementById('orderTotal').textContent = total.toFixed(2);
}

function createOrder() {
  const customerName = document.getElementById('customerName').value;
  const customerEmail = document.getElementById('customerEmail').value;
  const notes = document.getElementById('orderNotes').value;
  
  if (!customerName.trim()) {
    alert('Customer name is required');
    return;
  }
  
  // Collect order items
  const items = [];
  const orderItems = document.querySelectorAll('.order-item');
  
  orderItems.forEach(item => {
    const sku = item.querySelector('.item-sku').value;
    const quantity = parseInt(item.querySelector('.item-quantity').value || 0);
    
    if (sku && quantity > 0) {
      items.push({ sku, quantity });
    }
  });
  
  if (items.length === 0) {
    alert('Please add at least one item to the order');
    return;
  }
  
  const orderData = {
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim(),
    items,
    notes: notes.trim()
  };
  
  const order = orderManager.createOrder(orderData);
  
  if (order) {
    alert('Order created successfully!');
    window.closeOrderModal();
    renderOrders();
  } else {
    alert('Failed to create order');
  }
}

function reserveOrder(orderId) {
  const result = orderManager.reserveOrder(orderId);
  
  if (result.success) {
    alert('Order reserved successfully! Stock has been allocated.');
    renderOrders();
  } else {
    alert(`Failed to reserve order: ${result.error}`);
  }
}

function fulfillOrder(orderId) {
  if (!confirm('Are you sure you want to fulfill this order? This will deduct stock and cannot be undone.')) {
    return;
  }
  
  const result = orderManager.fulfillOrder(orderId);
  
  if (result.success) {
    alert('Order fulfilled successfully! Stock has been deducted.');
    renderOrders();
  } else {
    alert(`Failed to fulfill order: ${result.error}`);
  }
}

function cancelOrder(orderId) {
  const reason = prompt('Enter cancellation reason (optional):') || '';
  
  if (!confirm('Are you sure you want to cancel this order?')) {
    return;
  }
  
  const result = orderManager.cancelOrder(orderId, reason);
  
  if (result.success) {
    alert('Order cancelled successfully!');
    renderOrders();
  } else {
    alert(`Failed to cancel order: ${result.error}`);
  }
}

function viewOrderDetails(orderId) {
  // Implementation for viewing order details
  alert('Order details view coming soon!');
}

function filterOrders() {
  const statusFilter = document.getElementById('statusFilter').value;
  const customerFilter = document.getElementById('customerFilter').value;
  
  const filters = {};
  if (statusFilter) filters.status = statusFilter;
  if (customerFilter) filters.customer = customerFilter;
  
  const filteredOrders = orderManager.getOrders(filters);
  
  // Re-render with filtered orders
  const ordersList = document.getElementById('ordersList');
  if (filteredOrders.length === 0) {
    ordersList.innerHTML = `
      <div class="card" style="text-align: center; padding: 2rem;">
        <p>No orders match the current filters.</p>
      </div>
    `;
  } else {
    ordersList.innerHTML = filteredOrders.map(order => renderOrderCard(order)).join('');
  }
  
  renderOrderSummary(filteredOrders);
}

function clearFilters() {
  document.getElementById('statusFilter').value = '';
  document.getElementById('customerFilter').value = '';
  renderOrders();
}
