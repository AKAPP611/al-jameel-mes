// table.js - Simple table component

export function SimpleTable({ columns = [], rows = [] }) {
  const thead = `<tr>${columns.map(c => 
    `<th style="text-align:${c.align || 'start'};padding:8px;border-bottom:1px solid #eee;">${c.label}</th>`
  ).join('')}</tr>`;
  
  const tbody = rows.map(r => `<tr>${columns.map(c => {
    const value = r[c.key];
    return `<td style="padding:8px;border-bottom:1px solid #f3f4f6;text-align:${c.align || 'start'}">${value}</td>`;
  }).join('')}</tr>`).join('');
  
  return `<table style="inline-size:100%;border-collapse:collapse">${thead}${tbody}</table>`;
}
