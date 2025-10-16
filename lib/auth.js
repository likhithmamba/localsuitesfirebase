import { v4 as uuidv4 } from 'uuid'
import { connectToDatabase, COLLECTIONS } from './mongodb'

// Demo authentication (replace with proper auth later)
export async function createUser(userData) {
  const { db } = await connectToDatabase()
  
  const user = {
    id: uuidv4(),
    email: userData.email,
    phone: userData.phone,
    name: userData.name,
    role: userData.role || 'OWNER',
    createdAt: new Date(),
    lastLogin: new Date()
  }
  
  await db.collection(COLLECTIONS.USERS).insertOne(user)
  return user
}

export async function getUserByEmail(email) {
  const { db } = await connectToDatabase()
  return await db.collection(COLLECTIONS.USERS).findOne({ email })
}

export async function getUserByPhone(phone) {
  const { db } = await connectToDatabase()
  return await db.collection(COLLECTIONS.USERS).findOne({ phone })
}

// Demo login - returns mock user
export const DEMO_USERS = {
  owner: {
    id: 'demo-owner-123',
    email: 'owner@shreeganesha.shop',
    name: 'Ramesh Kumar',
    phone: '+919876543210',
    role: 'OWNER',
    shopId: 'demo-shop-123'
  },
  staff: {
    id: 'demo-staff-456', 
    email: 'staff@shreeganesha.shop',
    name: 'Priya Sharma',
    phone: '+919876543211',
    role: 'STAFF',
    shopId: 'demo-shop-123'
  }
}