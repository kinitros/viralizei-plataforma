// Smoke test simples para validar rotas de checkout e endpoints de API em produção
// Uso: node scripts/smoke_test_prod.js --base=https://gramprovider.com

const DEFAULT_BASE = 'http://localhost:5173'

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (const a of args) {
    const m = a.match(/^--([^=]+)=(.*)$/)
    if (m) out[m[1]] = m[2]
  }
  return out
}

async function fetchText(url, { timeoutMs = 8000 } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    const text = await res.text()
    return { ok: res.ok, status: res.status, text }
  } catch (e) {
    return { ok: false, status: 0, text: String(e && e.message || e) }
  } finally {
    clearTimeout(t)
  }
}

async function fetchJson(url, { timeoutMs = 8000 } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    const text = await res.text()
    let json
    try { json = JSON.parse(text) } catch { json = null }
    return { ok: res.ok, status: res.status, json, raw: text }
  } catch (e) {
    return { ok: false, status: 0, json: null, raw: String(e && e.message || e) }
  } finally {
    clearTimeout(t)
  }
}

function contains(text, needle) {
  return (text || '').toLowerCase().includes(String(needle).toLowerCase())
}

async function run() {
  const { base = DEFAULT_BASE } = parseArgs()
  const results = []

  // 1) Checkout Instagram Start
  {
    const url = `${base}/checkout/instagram?key=instagram.followers.br&qty=500`
    const r = await fetchText(url)
    const pass = r.ok && r.status === 200 && !contains(r.text, 'no routes matched location') && contains(r.text, 'Resumo do Pedido')
    results.push({ name: 'Checkout Instagram (start)', url, ok: pass, status: r.status })
  }

  // 2) API Products mapping (followers br)
  {
    const url = `${base}/api/products?network=instagram&serviceType=followers&region=brazil&active=true`
    const r = await fetchJson(url)
    const list = Array.isArray(r.json) ? r.json : (Array.isArray(r.json?.data) ? r.json.data : [])
    const pass = r.ok && r.status === 200 && Array.isArray(list) && list.length > 0
    results.push({ name: 'API products (instagram followers br)', url, ok: pass, status: r.status, count: list.length })
  }

  // 3) API Products mapping (views reels)
  {
    const url = `${base}/api/products?network=instagram&serviceType=views&region=reels&active=true`
    const r = await fetchJson(url)
    const list = Array.isArray(r.json) ? r.json : (Array.isArray(r.json?.data) ? r.json.data : [])
    const pass = r.ok && r.status === 200 && Array.isArray(list) && list.length > 0
    results.push({ name: 'API products (instagram views reels)', url, ok: pass, status: r.status, count: list.length })
  }

  // 4) Generic checkout route (YouTube)
  {
    const url = `${base}/checkout/youtube?key=youtube.subscribers&qty=300&price=69.9`
    const r = await fetchText(url)
    const pass = r.ok && r.status === 200 && !contains(r.text, 'no routes matched location')
    results.push({ name: 'Checkout Genérico (YouTube)', url, ok: pass, status: r.status })
  }

  // 5) Redirect serverless function mapping (optional)
  {
    const url = `${base}/api/redirect-links/find?serviceKey=youtube.subscribers&quantity=300`
    const r = await fetchJson(url)
    const pass = r.ok && r.status === 200
    results.push({ name: 'API redirect-links (serverless)', url, ok: pass, status: r.status })
  }

  // 6) Admin login route
  {
    const url = `${base}/admin/login`
    const r = await fetchText(url)
    const pass = r.ok && r.status === 200 && !contains(r.text, 'no routes matched location')
    results.push({ name: 'Admin Login Page', url, ok: pass, status: r.status })
  }

  // 7) Admin produtos route
  {
    const url = `${base}/admin/produtos`
    const r = await fetchText(url)
    const pass = r.ok && r.status === 200 && !contains(r.text, 'no routes matched location')
    results.push({ name: 'Admin Produtos Page', url, ok: pass, status: r.status })
  }

  const failures = results.filter(x => !x.ok)
  console.log('Smoke Test Results:\n', JSON.stringify(results, null, 2))
  if (failures.length) {
    console.error(`Falharam ${failures.length} checagens`)
    process.exit(1)
  } else {
    console.log('✅ Smoke test aprovado')
    process.exit(0)
  }
}

run().catch(e => { console.error('Erro no smoke test:', e); process.exit(1) })
