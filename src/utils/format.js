const numberFormatter = new Intl.NumberFormat('es-ES')

export function formatPopulation(value) {
  const population = Number(value)
  if (!Number.isFinite(population)) return '—'
  return `${(population / 1_000_000).toFixed(1)} M`
}

export function formatArea(value) {
  const area = Number(value)
  if (!Number.isFinite(area)) return '—'
  return `${numberFormatter.format(area)} km²`
}

export function formatNumber(value, maximumFractionDigits = 2) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits }).format(number)
}

export function formatList(value) {
  if (!Array.isArray(value) || value.length === 0) return '—'
  return value.filter(Boolean).join(', ')
}
