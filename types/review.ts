export interface Review {
  id: string
  name: string
  company?: string
  position?: string
  rating: number
  text: string
  source: string
  is_published: boolean
  is_featured: boolean
  created_at: string
  published_at?: string
} 