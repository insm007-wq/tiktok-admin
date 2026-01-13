require('dotenv').config({ path: '.env.local' })
const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI

async function createAdmin() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ MongoDB 연결 성공')

    const db = client.db('tiktok-scout')
    const usersCollection = db.collection('users')

    // 해시된 비밀번호 (1234)
    const hashedPassword = '$2b$10$hlXQl3636S.N3ttsurn/ZOBxwda7VJ0025DUcX0ZDuZCTGyYkmlRu'

    const adminUser = {
      email: 'test1',
      password: hashedPassword,
      name: 'Test Admin',
      phone: '01012345678',
      provider: 'credentials',
      isAdmin: true,
      isActive: true,
      isBanned: false,
      isApproved: true,
      isVerified: true,
      marketingConsent: false,
      termsAcceptedAt: new Date(),
      dailyLimit: 999999,
      remainingLimit: 999999,
      todayUsed: 0,
      lastResetDate: new Date().toISOString().split('T')[0],
      isOnline: false,
      lastActive: new Date(),
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // 기존 계정 확인
    const existing = await usersCollection.findOne({ email: 'test1' })
    if (existing) {
      console.log('⚠️ test1 계정이 이미 존재합니다. 업데이트 중...')
      await usersCollection.updateOne(
        { email: 'test1' },
        { $set: adminUser }
      )
      console.log('✅ test1 계정 업데이트 완료')
    } else {
      console.log('⚠️ test1 계정을 새로 생성 중...')
      await usersCollection.insertOne(adminUser)
      console.log('✅ test1 계정 생성 완료')
    }

    console.log('\n📝 로그인 정보:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`이메일: test1`)
    console.log(`비밀번호: 1234`)
    console.log('권한: 관리자 (Admin)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━')
  } catch (error) {
    console.error('❌ 오류 발생:', error)
  } finally {
    await client.close()
  }
}

createAdmin()
