import { connectToDatabase } from '../mongodb'
import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  email: string
  name?: string
  password?: string
  isAdmin: boolean
  isActive: boolean
}

export async function getUserById(email: string): Promise<User | null> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<User>('users')

    const user = await collection.findOne({ email })
    return user
  } catch (error) {
    console.error('❌ getUserById 실패:', error)
    return null
  }
}
