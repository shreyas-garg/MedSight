/**
 * Pre-demo preflight: confirms the Gemini key actually works and that the app's
 * model chain contains a model this key can call. Run `npm run check-api`
 * before presenting - a 403/404 here is exactly what the upload flow would hit.
 */
import { readFileSync } from 'node:fs'

const RESET = '\x1b[0m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const DIM = '\x1b[2m'

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY
  try {
    const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    const match = env.match(/^GEMINI_API_KEY=(.+)$/m)
    return match?.[1].trim()
  } catch {
    return undefined
  }
}

// Keep in sync with MODEL_CHAIN in app/api/analyze-report/route.ts
const MODEL_CHAIN = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-pro-latest',
]

const key = loadKey()
if (!key) {
  console.error(`${RED}FAIL${RESET} No GEMINI_API_KEY found in .env.local or the environment.`)
  console.error(`     Create .env.local with: GEMINI_API_KEY=your_key_here`)
  process.exit(1)
}
console.log(`${DIM}Using key ending ...${key.slice(-6)}${RESET}\n`)

let working = null
const diagnosis = new Set()
for (const model of MODEL_CHAIN) {
  process.stdout.write(`  ${model.padEnd(24)} `)
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Reply with: ok' }] }] }),
      }
    )
    if (res.ok) {
      console.log(`${GREEN}OK${RESET}`)
      working ??= model
    } else {
      const body = await res.json().catch(() => ({}))
      const msg = body?.error?.message ?? ''
      let hint = ''
      if (res.status === 403) hint = ' <- model not permitted for this project'
      else if (/limit: 0/.test(msg)) hint = ' <- no free-tier quota; needs billing'
      else if (res.status === 429) hint = ' <- quota exhausted, resets daily'
      else if (res.status === 404) hint = ' <- model retired'
      diagnosis.add(res.status === 403 ? 'blocked' : /limit: 0/.test(msg) ? 'billing' : 'quota')
      console.log(`${RED}${res.status}${RESET}${YELLOW}${hint}${RESET}`)
    }
  } catch (err) {
    console.log(`${RED}network error${RESET} ${DIM}${err.message}${RESET}`)
  }
}

console.log()
if (working) {
  console.log(`${GREEN}Ready.${RESET} Uploads will be analysed by "${working}".`)
  process.exit(0)
}

console.log(`${RED}Not ready - uploading a report will fail.${RESET}\n`)

if (diagnosis.has('billing')) {
  console.log(`${YELLOW}Diagnosis:${RESET} the pro models are permitted but have a free-tier`)
  console.log('quota of 0, and the free flash models are blocked for this project.\n')
  console.log('Either:')
  console.log('  a) Enable billing on this key\'s Google Cloud project (pennies for a demo), or')
  console.log('  b) Make a key on a DIFFERENT Google account at https://aistudio.google.com/apikey')
  console.log('     - a personal Gmail with no organisation policy usually has free flash quota')
} else if (diagnosis.has('blocked')) {
  console.log(`${YELLOW}Diagnosis:${RESET} this project is not permitted to use these models.`)
  console.log('Create a key on a different Google account at https://aistudio.google.com/apikey')
} else {
  console.log('Free-tier quota is exhausted. It resets daily - or enable billing.')
}
console.log('\nThen put it in .env.local, restart the dev server, and re-run this check.\n')
console.log(`${YELLOW}Models this key CAN use:${RESET}`)
try {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=200`)
  const data = await res.json()
  const usable = (data.models ?? [])
    .filter((m) => (m.supportedGenerationMethods ?? []).includes('generateContent'))
    .map((m) => m.name.replace('models/', ''))
  console.log(usable.length ? '  ' + usable.join('\n  ') : '  (none - the key itself is not valid)')
  if (usable.length) {
    console.log(`\n${DIM}If one of these works, put it first in MODEL_CHAIN in`)
    console.log(`app/api/analyze-report/route.ts${RESET}`)
  }
} catch {
  console.log('  (could not list models)')
}
process.exit(1)
