import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  const mongoUrl = process.env.MONGODB_URI
  if (!mongoUrl) {
    throw new Error('MONGODB_URI 환경변수가 설정되지 않았습니다')
  }

  try {
    client = new MongoClient(mongoUrl)
    await client.connect()
    db = client.db('tiktok-scout')
    console.log('✅ MongoDB 연결 성공')
    return { client, db }
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error)
    throw error
  }
}
