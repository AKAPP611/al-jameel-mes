export function Card({ title, subtitle, content, footer }) {
  const el = document.createElement('article');
  el.className = 'card factory-card';
  el.innerHTML = `
    <div>
      <div class="title">${title}</div>
      <div class="subtitle">${subtitle || ''}</div>
    </div>
    <div>${content || ''}</div>
    <div>${footer || ''}</div>
  `;
  return el;
}
