// stock-modal.js - Stock operation modal
export function StockModal({ sku, operation, item, onConfirm, onCancel }) {
  const isAdd = operation === 'add';
  const title = isAdd ? 'Add Stock' : 'Remove Stock';
  const buttonColor = isAdd ? 'var(--primary)' : '#ef4444';
  
  return `
    <div class="modal-overlay" onclick="closeStockModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>${title} - ${item.name}</h3>
          <button class="modal-close" onclick="closeStockModal()">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>SKU</label>
            <input type="text" value="${sku}" readonly style="background: #f8f9fa;">
          </div>
          
          <div class="form-group">
            <label>Quantity (${item.uom})</label>
            <input type="number" id="stockQuantity" min="1" step="1" placeholder="Enter quantity" autofocus>
          </div>
          
          <div class="form-group">
            <label>Reason</label>
            <select id="stockReason">
              ${isAdd ? `
                <option value="purchase_receipt">Purchase Receipt</option>
                <option value="production_output">Production Output</option>
                <option value="stock_adjustment">Stock Adjustment</option>
                <option value="return">Return</option>
              ` : `
                <option value="production_consumption">Production Consumption</option>
                <option value="sale">Sale</option>
                <option value="damage">Damage/Waste</option>
                <option value="stock_adjustment">Stock Adjustment</option>
              `}
              <option value="manual">Manual Entry</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Notes (Optional)</label>
            <textarea id="stockNotes" placeholder="Additional notes..." rows="2"></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="ghost" onclick="closeStockModal()">Cancel</button>
          <button class="btn" onclick="confirmStockOperation()" style="background: ${buttonColor};">
            ${title}
          </button>
        </div>
      </div>
    </div>
  `;
}

// Add modal styles
export const modalStyles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal-header h3 {
  margin: 0;
  color: var(--primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--muted);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(213, 163, 51, 0.2);
}
`;
