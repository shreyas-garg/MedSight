export function todayString() {
  return new Date().toISOString().slice(0, 10)
}

/** Last 7 calendar days as YYYY-MM-DD strings, oldest first, ending today. */
export function last7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export function formatWeekday(dateStr: string) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
}
