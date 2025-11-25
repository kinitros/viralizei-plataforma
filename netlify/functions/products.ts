import type { Handler, HandlerEvent } from '@netlify/functions'
import { createErrorResponse, createSuccessResponse, handleCors } from './utils/auth.js'
import productService from '../../api/services/productService'

function norm(t?: string) {
  if (!t) return ''
  const v = String(t).trim()
  try { return decodeURIComponent(v) } catch { return v }
}

function isAdmin(event: HandlerEvent): boolean {
  const expected = norm(process.env.ADMIN_TOKEN || '+Gustavo99!')
  const headerToken = norm(event.headers['x-admin-token'] as any)
  const auth = ((Array.isArray(event.headers['authorization']) ? event.headers['authorization'][0] : event.headers['authorization']) || '') as string
  const bearer = norm(auth && auth.startsWith('Bearer ') ? auth.substring(7) : auth)
  const queryToken = norm((event.queryStringParameters || {}).admin_token as any)
  return [headerToken, bearer, queryToken].some(t => t === expected)
}

const handler: Handler = async (event) => {
  const cors = handleCors(event)
  if (cors) return cors

  try {
    const method = event.httpMethod
    const path = event.path || ''

    // GET /api/products or /api/products/:id
    if (method === 'GET') {
      const seg = path.split('/').filter(Boolean)
      const maybeId = seg[seg.length - 1]
      if (maybeId && maybeId !== 'products' && !maybeId.includes('functions')) {
        const id = maybeId
        const product = await productService.getProductById(id)
        if (!product) return createErrorResponse(404, 'Produto não encontrado')
        return createSuccessResponse({ data: product })
      }

      const q = event.queryStringParameters || {}
      const filters = {
        active: q.active !== undefined ? String(q.active).toLowerCase() === 'true' : undefined,
        network: q.network as any,
        serviceType: (q.serviceType || q.service_type) as any,
        region: q.region as any,
        serviceKey: q.serviceKey as any,
      }
      const data = await productService.getProducts(filters as any)
      return createSuccessResponse({ data })
    }

    // Admin required for mutations
    if (!isAdmin(event)) return createErrorResponse(403, 'Acesso negado. Token de admin inválido.')

    // POST /api/products
    if (method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {}
      const created = await productService.createProduct(body)
      return createSuccessResponse({ data: created }, 201)
    }

    // PUT /api/products/:id
    if (method === 'PUT') {
      const seg = (event.path || '').split('/').filter(Boolean)
      const id = seg[seg.length - 1]
      if (!id || id === 'products') return createErrorResponse(400, 'ID inválido')
      const body = event.body ? JSON.parse(event.body) : {}
      const updated = await productService.updateProduct(id, body)
      return createSuccessResponse({ data: updated })
    }

    // DELETE /api/products/:id
    if (method === 'DELETE') {
      const seg = (event.path || '').split('/').filter(Boolean)
      const id = seg[seg.length - 1]
      if (!id || id === 'products') return createErrorResponse(400, 'ID inválido')
      await productService.deleteProduct(id)
      return createSuccessResponse({ success: true })
    }

    return createErrorResponse(404, 'Endpoint não encontrado')
  } catch (error: any) {
    console.error('Erro na função products:', error)
    const msg = error?.message || 'Erro interno do servidor'
    return createErrorResponse(500, msg)
  }
}

export { handler }
