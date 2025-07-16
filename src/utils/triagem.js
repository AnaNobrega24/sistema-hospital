// utils/triagem.js
export function getPriorityColor(priority) {
  switch (priority) {
    case 'alta': return 'red';
    case 'media': return 'yellow';
    case 'baixa': return 'green';
    default: return 'gray';
  }
}

export function getPriorityByReason(reason) {
  const lower = reason.toLowerCase();
  if (lower.includes('dor no peito') || lower.includes('desmaio') || lower.includes('sangramento') || lower.includes('queda')) return 'alta';
  if (lower.includes('febre') || lower.includes('vômito') || lower.includes('mal-estar')) return 'media';
  return 'baixa';
}
