import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'coupons.json')

// Интерфейс для купона
interface Coupon {
  id: number
  code: string
  phone: string
  discount: number
  createdAt: string
  used: boolean
  usedAt?: string
}

// Функция для чтения купонов из файла
async function readCoupons(): Promise<Coupon[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Если файл не существует, создаем пустой массив
    return []
  }
}

// Функция для записи купонов в файл
async function writeCoupons(coupons: Coupon[]): Promise<void> {
  // Создаем директорию data если её нет
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  
  await fs.writeFile(DATA_FILE, JSON.stringify(coupons, null, 2))
}

// POST - создание нового купона
export async function POST(request: NextRequest) {
  try {
    const { code, phone, discount } = await request.json()
    
    if (!code || !phone || !discount) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля: code, phone, discount' },
        { status: 400 }
      )
    }

    const coupons = await readCoupons()
    
    // Генерируем новый ID
    const newId = coupons.length > 0 ? Math.max(...coupons.map(c => c.id)) + 1 : 1
    
    const newCoupon: Coupon = {
      id: newId,
      code,
      phone,
      discount,
      createdAt: new Date().toISOString(),
      used: false
    }
    
    coupons.push(newCoupon)
    await writeCoupons(coupons)
    
    console.log('Новый купон сохранен:', newCoupon)
    
    return NextResponse.json({ success: true, coupon: newCoupon })
  } catch (error) {
    console.error('Ошибка при сохранении купона:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера при сохранении купона' },
      { status: 500 }
    )
  }
}

// GET - получение всех купонов
export async function GET() {
  try {
    const coupons = await readCoupons()
    return NextResponse.json({ coupons })
  } catch (error) {
    console.error('Ошибка при получении купонов:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера при получении купонов' },
      { status: 500 }
    )
  }
}

// PUT - отметить купон как использованный
export async function PUT(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { error: 'Отсутствует код купона' },
        { status: 400 }
      )
    }

    const coupons = await readCoupons()
    const couponIndex = coupons.findIndex(c => c.code === code)
    
    if (couponIndex === -1) {
      return NextResponse.json(
        { error: 'Купон не найден' },
        { status: 404 }
      )
    }
    
    coupons[couponIndex].used = true
    coupons[couponIndex].usedAt = new Date().toISOString()
    
    await writeCoupons(coupons)
    
    return NextResponse.json({ success: true, coupon: coupons[couponIndex] })
  } catch (error) {
    console.error('Ошибка при обновлении купона:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера при обновлении купона' },
      { status: 500 }
    )
  }
} 