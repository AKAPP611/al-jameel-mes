export function Progress({ value = 0 }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  return `
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${clamped}">
      <span style="inline-size:${clamped}%"></span>
    </div>
  `;
}
