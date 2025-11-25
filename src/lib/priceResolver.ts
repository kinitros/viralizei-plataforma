import { productService } from '../services/productService'
import { getStaticPrice } from './staticPrices'

function mapRegion(region: string | undefined): string | undefined {
  if (!region) return undefined
  if (region === 'world') return 'worldwide'
  if (region === 'br') return 'brazil'
  return region
}

function parseServiceKey(serviceKey: string): { network?: string; service_type?: string; region?: string } {
  const parts = (serviceKey || '').split('.')
  return {
    network: parts[0],
    service_type: parts[1],
    region: mapRegion(parts[2])
  }
}

export async function resolveProductPrice(serviceKey: string, qty: number, fallbackPrice: number = 0): Promise<number> {
  const normalizedKey = serviceKey.replace('.world', '.worldwide').replace('.br', '.brazil')
  const { network, service_type, region } = parseServiceKey(serviceKey)
  let products = await productService.getProducts({ network, service_type, region, is_active: true })
  let match = products.find(p => p.quantity === qty && (p as any).is_active)
  if (match) return match.price

  products = await productService.getProducts({ network, service_type, is_active: true })
  match = products.find(p => p.quantity === qty && p.region?.toLowerCase() === 'worldwide' && (p as any).is_active)
  if (match) return match.price
  match = products.find(p => p.quantity === qty && (p as any).is_active)
  if (match) return match.price

  const byKey = await productService.getProductByServiceKey(serviceKey)
  if (byKey && (byKey as any).is_active && byKey.quantity === qty) return byKey.price

  const staticPrice = getStaticPrice(normalizedKey, qty)
  if (staticPrice !== undefined) return staticPrice

  return fallbackPrice
}
