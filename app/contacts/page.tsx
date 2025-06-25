import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"

export default function ContactsPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Контакты</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Свяжитесь с нами удобным способом. Мы работаем в Калуге и по всей России
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Адрес офиса
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Калуга, ул. Дзержинского 37, офис 20</p>
              <Button variant="outline" asChild>
                <a
                  href="https://yandex.ru/maps/6/kaluga/search/%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%20%D0%B1%D1%8E%D1%80%D0%BE/?ll=36.236982%2C54.502884&sll=36.236215%2C54.437156&sspn=0.120163%2C0.040126&z=14"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Показать на карте
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Телефон
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600 mb-2">+7 953 330-17-77</p>
              <p className="text-gray-600">Звоните в рабочее время или оставьте заявку</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium mb-2">urist40@gmail.com</p>
              <p className="text-gray-600">Отвечаем на письма в течение 2 часов</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Режим работы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Понедельник - Пятница:</span>
                  <span className="font-medium">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Суббота:</span>
                  <span className="font-medium">10:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Воскресенье:</span>
                  <span className="font-medium">Выходной</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Социальные сети
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button variant="outline" asChild>
                  <a href="https://t.me/prostoburo" target="_blank" rel="noopener noreferrer">
                    Telegram
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://m.vk.com/buh_urist?from=groups" target="_blank" rel="noopener noreferrer">
                    VKontakte
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Как нас найти</CardTitle>
              <CardDescription>Наш офис находится в центре Калуги, удобная транспортная доступность</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?um=constructor%3A36.236982%2C54.502884&amp;source=constructor"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="rounded-lg"
                  title="Карта офиса ПростоБюро"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Наша команда</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                ЕГ
              </div>
              <CardTitle>Екатерина Голубева</CardTitle>
              <CardDescription>Основатель, главный бухгалтер</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                К
              </div>
              <CardTitle>Константин</CardTitle>
              <CardDescription>Юрист</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                Л
              </div>
              <CardTitle>Людмила</CardTitle>
              <CardDescription>Главный бухгалтер</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                Н
              </div>
              <CardTitle>Наталья</CardTitle>
              <CardDescription>Бухгалтер</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
