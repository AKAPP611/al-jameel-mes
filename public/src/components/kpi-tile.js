export function KpiTile({ label, value, state='ok' }) {
  return `
    <div class="kpi ${state}" role="group" aria-label="${label}">
      <div class="label">${label}</div>
      <div class="value" aria-live="polite">${value}</div>
    </div>
  `;
}
