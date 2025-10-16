import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URL
const dbName = process.env.DB_NAME || 'smartlocal_suite'

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  SHOPS: 'shops',
  PRODUCTS: 'products', 
  ORDERS: 'orders',
  PRICING_RULES: 'pricing_rules',
  CAMPAIGNS: 'campaigns',
  ANALYTICS: 'analytics',
  CASH_SESSIONS: 'cash_sessions',
  INVOICES: 'invoices'
}