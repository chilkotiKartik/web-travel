function csvCell(value) {
  const str = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

/** columns: [{ key, label }]; rows: array of flat objects */
export function toCSV(columns, rows) {
  const header = columns.map((c) => csvCell(c.label)).join(',')
  const lines = rows.map((row) => columns.map((c) => csvCell(row[c.key])).join(','))
  return [header, ...lines].join('\n')
}

export function downloadCSV(filename, columns, rows) {
  const csv = toCSV(columns, rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
