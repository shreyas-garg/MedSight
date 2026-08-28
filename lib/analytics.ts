export type TestResultEntry = {
  testName: string
  result: string
  value?: number | null
  unit?: string
  referenceRange?: string
  status?: string
}

export type ProgressionPoint = {
  date: string
  value: number
  status?: string
}

export type TestProgression = {
  testName: string
  unit: string
  referenceRange?: string
  points: ProgressionPoint[]
  trend: 'up' | 'down' | 'flat'
  latestStatus?: string
}

function parseNumericFromResult(result: string): number | null {
  const match = result.match(/-?\d+(\.\d+)?/)
  return match ? parseFloat(match[0]) : null
}

export function extractNumericValue(test: TestResultEntry): number | null {
  if (typeof test.value === 'number' && !Number.isNaN(test.value)) return test.value
  if (typeof test.result === 'string') return parseNumericFromResult(test.result)
  return null
}

/**
 * Groups test results by name across a patient's reports (oldest first) and
 * keeps only tests with 2+ dated data points, since a single reading has no trend.
 */
export function buildTestProgressions(
  reports: Array<{ createdAt: string; analysis: { testResults?: TestResultEntry[] } }>
): TestProgression[] {
  const byTest = new Map<string, TestProgression>()

  for (const report of reports) {
    for (const test of report.analysis?.testResults || []) {
      const value = extractNumericValue(test)
      if (value === null) continue

      if (!byTest.has(test.testName)) {
        byTest.set(test.testName, {
          testName: test.testName,
          unit: test.unit || '',
          referenceRange: test.referenceRange,
          points: [],
          trend: 'flat',
        })
      }
      byTest.get(test.testName)!.points.push({
        date: report.createdAt,
        value,
        status: test.status,
      })
    }
  }

  const progressions: TestProgression[] = []
  for (const progression of byTest.values()) {
    progression.points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    if (progression.points.length < 2) continue

    const first = progression.points[0].value
    const last = progression.points[progression.points.length - 1].value
    progression.trend = last > first ? 'up' : last < first ? 'down' : 'flat'
    progression.latestStatus = progression.points[progression.points.length - 1].status
    progressions.push(progression)
  }

  return progressions
}
