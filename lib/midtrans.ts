// Midtrans payment gateway integration
// Uses midtrans-client SDK

interface MidtransConfig {
  isProduction: boolean
  serverKey: string
  clientKey: string
}

// Lazy-load the client to avoid SSR issues
let midtransCore: any = null

function getMidtransClient() {
  if (!midtransCore) {
    const midtransClient = require('midtrans-client')
    const config: MidtransConfig = {
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    }
    midtransCore = new midtransClient.CoreApi(config)
  }
  return midtransCore
}

export interface CreateTransactionParams {
  orderId: string
  amount: number
  customer: {
    name: string
    email: string
    phone: string
  }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}

export async function createMidtransTransaction(
  params: CreateTransactionParams
) {
  const client = getMidtransClient()
  const { orderId, amount, customer, items } = params

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    item_details: items,
    customer_details: {
      first_name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
  }

  return await client.charge(parameter)
}

export const MIDTRANS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
