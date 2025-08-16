// counter.js - Counter component with increment/decrement buttons

export function Counter({ id, value = 0, step = 1, min = 0, max = 999999 }) {
  return `
    <div class="row" style="gap:8px" data-counter="${id}">
      <button class="ghost" aria-label="decrement" data-dec type="button">-</button>
      <input 
        id="${id}" 
        type="number" 
        inputmode="numeric" 
        min="${min}" 
        max="${max}" 
        step="${step}" 
        value="${value}" 
        style="inline-size:100px; padding:10px; border-radius:12px; border:1px solid #e5e7eb;" 
      />
      <button class="ghost" aria-label="increment" data-inc type="button">+</button>
    </div>
  `;
}

export function bindCounter(container) {
  container.addEventListener('click', (e) => {
    const wrap = e.target.closest('[data-counter]');
    if (!wrap) return;
    
    const input = wrap.querySelector('input');
    if (!input) return;
    
    const currentValue = Number(input.value || 0);
    const step = Number(input.step || 1);
    const min = Number(input.min || 0);
    const max = Number(input.max || 999999);
    
    if (e.target.hasAttribute('data-inc')) {
      input.value = Math.min(max, currentValue + step);
    }
    
    if (e.target.hasAttribute('data-dec')) {
      input.value = Math.max(min, currentValue - step);
    }
    
    // Trigger change event for form validation
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
