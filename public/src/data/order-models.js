// order-models.js - Order data models and operations
import { inventoryState } from './inventory-state.js';

export class OrderManager {
  constructor(factoryId) {
    this.factoryId = factoryId;
  }

  // Create new order
  createOrder(orderData) {
    const state = inventoryState.getState(this.factoryId);
    
    const newOrder = {
      id: this.generateOrderId(),
      factoryId: this.factoryId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      items: orderData.items || [],
      status: 'DRAFT',
      totalValue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: orderData.notes || ''
    };
    
    // Calculate total value
    newOrder.totalValue = this.calculateOrderValue(newOrder.items, state.items);
    
    state.orders.push(newOrder);
    inventoryState.setState(this.factoryId, state);
    
    return newOrder;
  }

  // Reserve stock for order
  reserveOrder(orderId) {
    const state = inventoryState.getState(this.factoryId);
    const order = state.orders.find(o => o.id === orderId);
    
    if (!order || order.status !== 'DRAFT') {
      return { success: false, error: 'Order not found or not in draft status' };
    }
    
    // Check stock availability
    for (const orderItem of order.items) {
      const inventoryItem = state.inventory.find(inv => inv.sku === orderItem.sku);
      const availableQty = inventoryItem ? (inventoryItem.qty - (inventoryItem.reserved || 0)) : 0;
      
      if (availableQty < orderItem.quantity) {
        return { 
          success: false, 
          error: `Insufficient stock for ${orderItem.sku}. Available: ${availableQty}, Required: ${orderItem.quantity}` 
        };
      }
    }
    
    // Reserve stock
    for (const orderItem of order.items) {
      const inventoryItem = state.inventory.find(inv => inv.sku === orderItem.sku);
      if (inventoryItem) {
        inventoryItem.reserved = (inventoryItem.reserved || 0) + orderItem.quantity;
      }
    }
    
    // Update order status
    order.status = 'RESERVED';
    order.reservedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    
    inventoryState.setState(this.factoryId, state);
    
    return { success: true, order };
  }

  // Fulfill order (ship and deduct stock)
  fulfillOrder(orderId, shipmentData = {}) {
    const state = inventoryState.getState(this.factoryId);
    const order = state.orders.find(o => o.id === orderId);
    
    if (!order || order.status !== 'RESERVED') {
      return { success: false, error: 'Order not found or not reserved' };
    }
    
    // Deduct stock and remove reservations
    for (const orderItem of order.items) {
      const inventoryItem = state.inventory.find(inv => inv.sku === orderItem.sku);
      if (inventoryItem) {
        inventoryItem.qty -= orderItem.quantity;
        inventoryItem.reserved = (inventoryItem.reserved || 0) - orderItem.quantity;
        
        // Add movement record
        state.movements.push({
          id: inventoryState.generateId(),
          type: 'OUT',
          sku: orderItem.sku,
          quantity: orderItem.quantity,
          reason: 'order_fulfillment',
          orderId: orderId,
          fromQty: inventoryItem.qty + orderItem.quantity,
          toQty: inventoryItem.qty,
          factoryId: this.factoryId,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Update order status
    order.status = 'FULFILLED';
    order.fulfilledAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    order.shipment = {
      trackingNumber: shipmentData.trackingNumber || '',
      carrier: shipmentData.carrier || '',
      shippedAt: new Date().toISOString()
    };
    
    inventoryState.setState(this.factoryId, state);
    
    return { success: true, order };
  }

  // Cancel order and release reservations
  cancelOrder(orderId, reason = '') {
    const state = inventoryState.getState(this.factoryId);
    const order = state.orders.find(o => o.id === orderId);
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    
    if (order.status === 'FULFILLED') {
      return { success: false, error: 'Cannot cancel fulfilled order' };
    }
    
    // Release reservations if order was reserved
    if (order.status === 'RESERVED') {
      for (const orderItem of order.items) {
        const inventoryItem = state.inventory.find(inv => inv.sku === orderItem.sku);
        if (inventoryItem) {
          inventoryItem.reserved = (inventoryItem.reserved || 0) - orderItem.quantity;
        }
      }
    }
    
    // Update order status
    order.status = 'CANCELLED';
    order.cancelledAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    order.cancellationReason = reason;
    
    inventoryState.setState(this.factoryId, state);
    
    return { success: true, order };
  }

  // Get orders with optional filtering
  getOrders(filters = {}) {
    const state = inventoryState.getState(this.factoryId);
    let orders = [...state.orders];
    
    if (filters.status) {
      orders = orders.filter(order => order.status === filters.status);
    }
    
    if (filters.customer) {
      orders = orders.filter(order => 
        order.customerName.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }
    
    // Sort by created date (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return orders;
  }

  // Helper methods
  generateOrderId() {
    const prefix = this.factoryId.toUpperCase().substring(0, 2);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  calculateOrderValue(orderItems, masterItems) {
    return orderItems.reduce((total, orderItem) => {
      const masterItem = masterItems.find(item => item.sku === orderItem.sku);
      const price = masterItem?.salePrice || masterItem?.unitCost || 0;
      return total + (orderItem.quantity * price);
    }, 0);
  }
}
