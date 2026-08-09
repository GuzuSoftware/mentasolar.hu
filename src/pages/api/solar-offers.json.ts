import type { APIRoute } from 'astro'

type SolarOffer = {
  marketingName: string
  published: boolean
  offerType: 'new-system' | 'system-extension'
  systemType: 'grid' | 'off-grid'
  storageType: 'without-storage' | 'with-storage'
  roofType: 'tile' | 'trapezoid' | 'flat' | 'shingle' | 'metal-tile' | 'standing-seam' | 'ground' | 'any'
  extensionType: 'inverter-storage' | 'full-backup'
  image: string
  summary: string
  inverterBrand: string
  batteryBrand?: string
  panelBrand: string
  systemPower: string
  batteryCapacity?: string
  priceText?: string
  highlights?: string[]
  example?: boolean
  order: number
}

const offerModules = import.meta.glob<{ default: SolarOffer }>('../../data/solar-offers/*.json', { eager: true })

const offers = Object.entries(offerModules).map(([path, module]) => ({
  id: path.split('/').pop()?.replace(/\.json$/, '') ?? path,
  ...module.default,
}))

export const GET: APIRoute = ({ url }) => {
  const offerType = url.searchParams.get('offerType')
  const systemType = url.searchParams.get('systemType')
  const storageType = url.searchParams.get('storageType')
  const roofType = url.searchParams.get('roofType')
  const extensionType = url.searchParams.get('extensionType')

  const filteredOffers = offers
    .filter((offer) => offer.published && offer.offerType === offerType)
    .filter((offer) => offerType !== 'new-system' || offer.systemType === systemType)
    .filter((offer) => offerType !== 'new-system' || offer.storageType === storageType)
    .filter(
      (offer) =>
        offerType !== 'new-system' ||
        roofType === 'unknown' ||
        offer.roofType === 'any' ||
        offer.roofType === roofType,
    )
    .filter((offer) => offerType !== 'system-extension' || offer.extensionType === extensionType)
    .sort((first, second) => first.order - second.order || first.marketingName.localeCompare(second.marketingName, 'hu'))

  return new Response(JSON.stringify({ offers: filteredOffers }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
