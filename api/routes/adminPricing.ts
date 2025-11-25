import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import { requireAdmin } from '../middleware/adminAuth.js'
import productService from '../services/productService.js'

const router = express.Router()

const isAdmin = requireAdmin

interface SyncItem { quantity: number; price: number; is_active?: boolean }
interface SyncPayload { network: string; serviceType: string; region?: string; items: SyncItem[] }

router.post('/sync', isAdmin, async (req: Request, res: Response) => {
  try {
    let payloads: SyncPayload[] = Array.isArray(req.body) && req.body.length ? req.body : []
    if (!payloads.length) {
      const q = req.query || {}
      const itemsRaw = String(q.items || '')
      if (itemsRaw) {
        const items: SyncItem[] = itemsRaw.split(',').map(pair => {
          const [qs, ps] = pair.split(':')
          return { quantity: Number(qs), price: Number(ps), is_active: true }
        }).filter(i => Number.isFinite(i.quantity) && Number.isFinite(i.price))
        payloads = [{
          network: String(q.network || ''),
          serviceType: String(q.serviceType || ''),
          region: String(q.region || 'worldwide'),
          items
        }]
      }
    }
    const results: any[] = []

    for (const payload of payloads) {
      const { network, serviceType, region, items } = payload
      const existing = await productService.getProducts({ network, serviceType, region })

      for (const item of items) {
        try {
          const match = existing.find(p => p.quantity === item.quantity)
          if (match) {
            const updated = await productService.updateProduct(String(match.id), {
              price: item.price,
              is_active: item.is_active ?? true,
            } as any)
            results.push({ action: 'updated', id: match.id, quantity: item.quantity, price: item.price })
          } else {
            const created = await productService.createProduct({
              network: network.toLowerCase(),
              service_type: serviceType.toLowerCase(),
              region: (region || 'worldwide').toLowerCase(),
              quantity: item.quantity,
              price: item.price,
              is_active: item.is_active ?? true,
              name: `${network} ${serviceType} ${region || 'worldwide'} - ${item.quantity}`,
            } as any)
            results.push({ action: 'created', id: created.id, quantity: item.quantity, price: item.price })
          }
        } catch (e: any) {
          console.error('[adminPricing.sync] item error', e)
          results.push({ action: 'error', quantity: item.quantity, price: item.price, error: String(e?.message || e) })
        }
      }
    }

    res.json({ success: true, results })
  } catch (error) {
    console.error('[adminPricing.sync] error', error)
    res.status(500).json({ success: false, error: String((error as any)?.message || error) })
  }
})

export default router

router.post('/update-price', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = (req.body?.id as string) || (req.query.id as string)
    const priceRaw = (req.body?.price as any) || (req.query.price as any)
    if (!id || priceRaw === undefined) {
      return res.status(400).json({ error: 'missing id or price' })
    }
    const price = Number(priceRaw)
    const product = await productService.updateProduct(String(id), { price } as any)
    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, error: String((error as any)?.message || error) })
  }
})

router.post('/create', isAdmin, async (req: Request, res: Response) => {
  try {
    const q = req.query
    const body = req.body || {}
    const name = (body.name as string) || (q.name as string) || ''
    const network = ((body.network as string) || (q.network as string) || '').toLowerCase()
    const serviceType = ((body.serviceType as string) || (q.serviceType as string) || '').toLowerCase()
    const region = ((body.region as string) || (q.region as string) || 'worldwide').toLowerCase()
    const quantity = Number((body.quantity as any) ?? (q.quantity as any))
    const price = Number((body.price as any) ?? (q.price as any))
    if (!network || !serviceType || !quantity || !price) {
      return res.status(400).json({ error: 'missing required fields' })
    }
    const product = await productService.createProduct({
      name: name || `${network} ${serviceType} ${region} - ${quantity}`,
      network,
      service_type: serviceType,
      region,
      quantity,
      price,
      is_active: true,
      service_key: `${network}-${serviceType}-${region === 'worldwide' ? 'ww' : region}-${quantity}`
    } as any)
    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, error: String((error as any)?.message || error) })
  }
})
