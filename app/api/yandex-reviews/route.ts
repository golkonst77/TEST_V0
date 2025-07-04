import { NextRequest } from "next/server"
import * as cheerio from "cheerio"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const url = "https://yandex.ru/maps/org/prosto_byuro/180493814174/reviews/"
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    const reviews = $('.business-review-view__review').map((_, el) => {
      const $el = $(el)
      const name = $el.find('.business-review-view__author').text().trim() || "Гость"
      const text = $el.find('.business-review-view__body-text').text().trim() || ""
      const date = $el.find('.business-review-view__date').text().trim() || ""
      const rating = $el.find('.business-rating-badge-view__rating').text().trim() || "5"
      
      return {
        name,
        text,
        date,
        rating: Number(rating)
      }
    }).get()
    
    return new Response(JSON.stringify({ reviews }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return new Response(JSON.stringify({ 
      error: "Ошибка загрузки отзывов",
      details: error instanceof Error ? error.message : "Unknown error"
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
} 