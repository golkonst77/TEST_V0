import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'coupons.json')

interface Coupon {
  id: number
  code: string
  phone: string
  discount: number
  createdAt: string
  used: boolean
  usedAt?: string
}

async function readCoupons(): Promise<Coupon[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// GET - проверка статуса купона
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json(
        { error: 'Отсутствует код купона' },
        { status: 400 }
      )
    }

    const coupons = await readCoupons()
    const coupon = coupons.find(c => c.code === code)
    
    if (!coupon) {
      return NextResponse.json(
        { error: 'Купон не найден', exists: false },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      exists: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        used: coupon.used,
        createdAt: coupon.createdAt,
        usedAt: coupon.usedAt
      }
    })
  } catch (error) {
    console.error('Ошибка при проверке купона:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера при проверке купона' },
      { status: 500 }
    )
  }
} 