// inventory-state.js - Central Inventory State Management
// Supports multi-factory with localStorage persistence

class InventoryState {
  constructor() {
    this.version = 'v1';
    this.listeners = {};
    this.cache = {};
  }

  // Generate storage key per factory
  getStorageKey(factoryId) {
    return `inv:${factoryId}:${this.version}`;
  }

  // Pure function: get state for factory
  getState(factoryId) {
    if (!factoryId) throw new Error('factoryId is required');
    
    // Return cached if available
    if (this.cache[factoryId]) {
      return { ...this.cache[factoryId] };
    }

    try {
      const key = this.getStorageKey(factoryId);
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache[factoryId] = parsed;
        return { ...parsed };
      }
    } catch (error) {
      console.warn(`Failed to load inventory state for ${factoryId}:`, error);
    }

    // No stored data - return empty state structure
    return this.getEmptyState(factoryId);
  }

  // Pure function: set state for factory
  setState(factoryId, nextState) {
    if (!factoryId) throw new Error('factoryId is required');
    if (!nextState || typeof nextState !== 'object') {
      throw new Error('nextState must be an object');
    }

    // Ensure factoryId matches
    const stateWithFactory = {
      ...nextState,
      factoryId,
      lastUpdated: new Date().toISOString()
    };

    try {
      const key = this.getStorageKey(factoryId);
      localStorage.setItem(key, JSON.stringify(stateWithFactory));
      
      // Update cache
      this.cache[factoryId] = stateWithFactory;
      
      // Notify listeners
      this.notify(factoryId, stateWithFactory);
      
      return true;
    } catch (error) {
      console.error(`Failed to save inventory state for ${factoryId}:`, error);
      return false;
    }
  }

  // Load seed data if empty
  async loadSeedIfEmpty(factoryId) {
    const currentState = this.getState(factoryId);
    
    // Check if already has data
    if (currentState.items && currentState.items.length > 0) {
      return currentState;
    }

    try {
      // Try to load seed data from JSON file
      const response = await fetch(`./src/data/inventory-data.json?t=${Date.now()}`);
      if (response.ok) {
        const seedData = await response.json();
        
        // Only use seed data if it matches the factory
        if (seedData.factoryId === factoryId) {
          this.setState(factoryId, seedData);
          console.log(`Loaded seed data for ${factoryId}`);
          return seedData;
        }
      }
    } catch (error) {
      console.warn(`Could not load seed data for ${factoryId}:`, error);
    }

    // Fallback: return empty state
    return currentState;
  }

  // Get empty state structure
  getEmptyState(factoryId) {
    return {
      factoryId,
      items: [],
      inventory: [],
      movements: [],
      orders: [],
      locations: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  }

  // Subscribe to state changes
  subscribe(factoryId, callback) {
    if (!this.listeners[factoryId]) {
      this.listeners[factoryId] = [];
    }
    this.listeners[factoryId].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[factoryId] = this.listeners[factoryId].filter(cb => cb !== callback);
    };
  }

  // Notify listeners of state changes
  notify(factoryId, newState) {
    if (this.listeners[factoryId]) {
      this.listeners[factoryId].forEach(callback => {
        try {
          callback(newState);
        } catch (error) {
          console.error('Listener error:', error);
        }
      });
    }
  }

  // CRUD Operations for Items
  addItem(factoryId, item) {
    const state = this.getState(factoryId);
    const newItem = {
      ...item,
      id: item.id || this.generateId(),
      createdAt: new Date().toISOString()
    };
    
    state.items.push(newItem);
    this.setState(factoryId, state);
    return newItem;
  }

  updateItem(factoryId, itemId, updates) {
    const state = this.getState(factoryId);
    const itemIndex = state.items.findIndex(item => item.id === itemId || item.sku === itemId);
    
    if (itemIndex === -1) return false;
    
    state.items[itemIndex] = {
      ...state.items[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.setState(factoryId, state);
    return state.items[itemIndex];
  }

  // CRUD Operations for Inventory
  updateInventory(factoryId, sku, updates) {
    const state = this.getState(factoryId);
    const invIndex = state.inventory.findIndex(inv => inv.sku === sku);
    
    if (invIndex === -1) {
      // Create new inventory record
      const newInv = {
        sku,
        qty: 0,
        ...updates,
        factoryId,
        lastUpdated: new Date().toISOString()
      };
      state.inventory.push(newInv);
    } else {
      // Update existing
      state.inventory[invIndex] = {
        ...state.inventory[invIndex],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
    }
    
    this.setState(factoryId, state);
    return true;
  }

  // Add inventory movement
  addMovement(factoryId, movement) {
    const state = this.getState(factoryId);
    const newMovement = {
      ...movement,
      id: this.generateId(),
      factoryId,
      timestamp: new Date().toISOString()
    };
    
    state.movements.push(newMovement);
    this.setState(factoryId, state);
    return newMovement;
  }

  // Stock Operations
  addStock(factoryId, sku, quantity, reason = 'manual_add') {
    const state = this.getState(factoryId);
    const invItem = state.inventory.find(inv => inv.sku === sku);
    
    if (!invItem) return false;
    
    const newQty = invItem.qty + quantity;
    this.updateInventory(factoryId, sku, { qty: newQty });
    
    this.addMovement(factoryId, {
      type: 'IN',
      sku,
      quantity,
      reason,
      fromQty: invItem.qty,
      toQty: newQty
    });
    
    return true;
  }

  removeStock(factoryId, sku, quantity, reason = 'manual_remove') {
    const state = this.getState(factoryId);
    const invItem = state.inventory.find(inv => inv.sku === sku);
    
    if (!invItem || invItem.qty < quantity) return false;
    
    const newQty = Math.max(0, invItem.qty - quantity);
    this.updateInventory(factoryId, sku, { qty: newQty });
    
    this.addMovement(factoryId, {
      type: 'OUT',
      sku,
      quantity,
      reason,
      fromQty: invItem.qty,
      toQty: newQty
    });
    
    return true;
  }

  transferStock(factoryId, sku, quantity, fromLocation, toLocation, reason = 'transfer') {
    const state = this.getState(factoryId);
    const invItem = state.inventory.find(inv => inv.sku === sku && inv.location === fromLocation);
    
    if (!invItem || invItem.qty < quantity) return false;
    
    // Reduce from source location
    this.updateInventory(factoryId, sku, { 
      qty: invItem.qty - quantity 
    });
    
    // Add to destination location
    const destItem = state.inventory.find(inv => inv.sku === sku && inv.location === toLocation);
    if (destItem) {
      this.updateInventory(factoryId, sku, { 
        qty: destItem.qty + quantity 
      });
    } else {
      // Create new location inventory
      state.inventory.push({
        sku,
        qty: quantity,
        location: toLocation,
        factoryId,
        lastUpdated: new Date().toISOString()
      });
    }
    
    this.addMovement(factoryId, {
      type: 'TRANSFER',
      sku,
      quantity,
      reason,
      fromLocation,
      toLocation
    });
    
    this.setState(factoryId, state);
    return true;
  }

  // Utility function to generate IDs
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all data for factory (for testing)
  clearFactory(factoryId) {
    try {
      const key = this.getStorageKey(factoryId);
      localStorage.removeItem(key);
      delete this.cache[factoryId];
      this.notify(factoryId, this.getEmptyState(factoryId));
      return true;
    } catch (error) {
      console.error(`Failed to clear factory ${factoryId}:`, error);
      return false;
    }
  }
}

// Create and export singleton instance
export const inventoryState = new InventoryState();

// Convenience exports
export const {
  getState,
  setState,
  loadSeedIfEmpty,
  subscribe,
  addItem,
  updateItem,
  updateInventory,
  addMovement,
  addStock,
  removeStock,
  transferStock,
  clearFactory
} = inventoryState;
