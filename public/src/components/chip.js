export function Chip({ text, color='#999' }) {
  const fg = '#fff';
  return `<span class="chip" style="display:inline-block;padding:6px 10px;border-radius:999px;background:${color};color:${fg};font-weight:700;font-size:12px;">${text}</span>`;
}
