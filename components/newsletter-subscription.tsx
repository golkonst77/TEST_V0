"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function NewsletterSubscription() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error("Введите email адрес")
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        setSubscribed(true)
        setEmail("")
        toast.success("Подписка успешно оформлена!")
      } else {
        toast.error(data.error || "Ошибка при подписке")
      }
    } catch (error) {
      console.error('Ошибка подписки:', error)
      toast.error("Ошибка при подписке. Попробуйте позже.")
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-100" />
          <h3 className="text-2xl font-bold mb-2">Спасибо за подписку!</h3>
          <p className="text-green-100 max-w-2xl mx-auto">
            Вы успешно подписались на нашу рассылку. Теперь вы будете получать актуальные новости и полезные материалы.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <CardContent className="p-8 text-center">
        <Mail className="w-12 h-12 mx-auto mb-4 text-blue-100" />
        <h3 className="text-2xl font-bold mb-4">Подпишитесь на наши новости</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Получайте свежие статьи о бухгалтерии, изменениях в законодательстве и полезные советы для бизнеса
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-gray-900 border-0 flex-1"
            disabled={loading}
            required
          />
          <Button 
            type="submit" 
            variant="secondary" 
            className="bg-white text-blue-600 hover:bg-gray-100 min-w-[140px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Подписка...
              </>
            ) : (
              "Подписаться"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 