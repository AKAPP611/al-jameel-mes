// chip.js - Chip component for displaying colored labels

export function Chip({ text, color = '#999' }) {
  const textColor = '#fff';
  return `<span class="chip" style="background:${color};color:${textColor};">${text}</span>`;
}
