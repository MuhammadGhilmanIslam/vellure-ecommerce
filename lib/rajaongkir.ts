// Raja Ongkir API integration for shipping cost calculation

const RAJAONGKIR_BASE_URL = 'https://api.rajaongkir.com/starter'

export interface Province {
  province_id: string
  province: string
}

export interface City {
  city_id: string
  province_id: string
  province: string
  type: string
  city_name: string
  postal_code: string
}

export interface ShippingCost {
  service: string
  description: string
  cost: Array<{
    value: number
    etd: string
    note: string
  }>
}

async function rajaOngkirFetch(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${RAJAONGKIR_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      key: process.env.RAJAONGKIR_API_KEY!,
      'content-type': 'application/x-www-form-urlencoded',
      ...options?.headers,
    },
  })
  const data = await res.json()
  return data.rajaongkir
}

export async function getProvinces(): Promise<Province[]> {
  const data = await rajaOngkirFetch('/province')
  return data.results
}

export async function getCities(provinceId: string): Promise<City[]> {
  const data = await rajaOngkirFetch(`/city?province=${provinceId}`)
  return data.results
}

export async function getShippingCost(params: {
  origin: string
  destination: string
  weight: number
  courier: string
}): Promise<ShippingCost[]> {
  const body = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    weight: params.weight.toString(),
    courier: params.courier,
  })

  const data = await rajaOngkirFetch('/cost', {
    method: 'POST',
    body: body.toString(),
  })

  return data.results[0]?.costs || []
}
