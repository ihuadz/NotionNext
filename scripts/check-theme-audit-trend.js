#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const baselinePath = path.resolve(process.env.PERF_AUDIT_BASELINE || path.join(root, 'docs', 'performance', 'theme-audit-latest.json'))
const currentPath = path.resolve(process.env.PERF_AUDIT_CURRENT || path.join(root, '.perf', 'theme-audit', 'summary.json'))
const compareThemes = (process.env.THEME_AUDIT_THEMES || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

const maxMeanDropPercent = Number(process.env.THEME_AUDIT_MAX_MEAN_DROP_PCT || '3')
const maxThemeDropPercent = Number(process.env.THEME_AUDIT_MAX_THEME_DROP_PCT || '6')
const minPassRatePercent = Number(process.env.THEME_AUDIT_MIN_PASS_RATE_PCT || '95')
const failOnMissingTheme = process.env.THEME_AUDIT_FAIL_ON_MISSING === 'true'
const reportPath = path.join(root, '.perf', 'theme-audit', 'trend-report.json')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function toNumber(value) {
  if (value == null || Number.isNaN(Number(value))) return null
  return Number(value)
}

function round(value) {
  return Number(Number(value).toFixed(3))
}

function toMap(results) {
  return results.reduce((acc, item) => {
    if (item?.theme) acc[item.theme] = item
    return acc
  }, {})
}

function mean(items) {
  if (items.length === 0) return null
  const values = items.filter((item) => item != null && Number.isFinite(item))
  if (values.length === 0) return null
  return round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function compare() {
  if (!fs.existsSync(baselinePath)) {
    throw new Error(`Missing baseline report: ${baselinePath}`)
  }
  if (!fs.existsSync(currentPath)) {
    throw new Error(`Missing current report: ${currentPath}. Run theme audit first.`)
  }

  const baseline = readJson(baselinePath)
  const current = readJson(currentPath)
  if (!Array.isArray(baseline) || !Array.isArray(current)) {
    throw new Error('Theme audit reports must be arrays.')
  }

  const baselineMap = toMap(baseline)
  const currentMap = toMap(current)
  const themes = compareThemes.length > 0 ? compareThemes : baseline.map((item) => item.theme).filter(Boolean)

  const themeResults = []
  const missing = []

  for (const theme of themes) {
    const baselineItem = baselineMap[theme]
    const currentItem = currentMap[theme]

    if (!baselineItem || !currentItem) {
      missing.push({ theme, hasBaseline: !!baselineItem, hasCurrent: !!currentItem })
      continue
    }

    const baselinePerf = toNumber(baselineItem.scores?.performance)
    const currentPerf = toNumber(currentItem.scores?.performance)
    const currentPassRate = toNumber(currentItem.stability?.passRate)

    const delta = currentPerf != null && baselinePerf != null ? round(currentPerf - baselinePerf) : null
    themeResults.push({
      theme,
      baselinePerf,
      currentPerf,
      deltaPerf: delta,
      passRate: currentPassRate
    })
  }

  if (failOnMissingTheme && missing.length > 0) {
    missing.forEach((item) => {
      console.warn(`Missing baseline/current for theme "${item.theme}"`)
    })
  }

  const comparable = themeResults.filter((item) => item.baselinePerf != null && item.currentPerf != null)
  const baselineMean = mean(comparable.map((item) => item.baselinePerf))
  const currentMean = mean(comparable.map((item) => item.currentPerf))
  const meanDelta = baselineMean != null && currentMean != null ? round(currentMean - baselineMean) : null
  const meanDeltaPercent = baselineMean != null && currentMean != null && baselineMean !== 0
    ? round((meanDelta / baselineMean) * 100)
    : null

  const failedByTheme = comparable.filter(
    item => item.deltaPerf != null && item.deltaPerf < -maxThemeDropPercent
  )

  const failedByPassRate = comparable.filter(
    item => item.passRate != null && item.passRate < minPassRatePercent
  )

  const report = {
    generatedAt: new Date().toISOString(),
    thresholds: {
      maxMeanDropPercent,
      maxThemeDropPercent,
      minPassRatePercent
    },
    baselinePath: path.relative(root, baselinePath),
    currentPath: path.relative(root, currentPath),
    comparedThemes: comparable.length,
    baselineMean,
    currentMean,
    meanDelta,
    meanDeltaPercent,
    failures: {
      byThemeDrop: failedByTheme,
      byStability: failedByPassRate,
      missing
    },
    results: comparable.sort((a, b) => a.deltaPerf - b.deltaPerf)
  }

  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  console.log(`Theme trend report: ${path.relative(root, reportPath)}`)
  console.log(`Compared themes: ${comparable.length}`)
  if (meanDeltaPercent != null) {
    console.log(`Mean performance delta: ${meanDeltaPercent}% (${baselineMean} -> ${currentMean})`)
  }

  let failed = false
  if (meanDeltaPercent != null && meanDeltaPercent < -maxMeanDropPercent) {
    console.error(
      `Mean perf drop ${meanDeltaPercent}% exceeded limit (${maxMeanDropPercent}%).`
    )
    failed = true
  }

  if (failedByTheme.length > 0) {
    console.error('Themes with unexpected per-theme drop:')
    for (const item of failedByTheme) {
      console.error(`- ${item.theme}: ${item.baselinePerf} -> ${item.currentPerf} (delta ${item.deltaPerf})`)
    }
    failed = true
  }

  if (failedByPassRate.length > 0) {
    console.error('Themes with low stability pass rate:')
    for (const item of failedByPassRate) {
      console.error(`- ${item.theme}: pass rate ${item.passRate}%`)
    }
    failed = true
  }

  if (failOnMissingTheme && missing.length > 0) {
    console.error('Missing theme snapshots detected in baseline/current set and fail-on-missing is enabled.')
    failed = true
  }

  if (failed) process.exit(1)
  console.log('Theme trend check passed.')
}

try {
  compare()
} catch (err) {
  console.error(err.message || err)
  process.exit(1)
}
