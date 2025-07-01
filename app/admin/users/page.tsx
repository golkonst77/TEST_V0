"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { UserPlus, Edit, Trash2, Mail, Phone, Calendar, User, Search } from "lucide-react"
import { useState } from "react"

export default function AdminUsersPage() {
  const [users] = useState([
    { 
      id: 1, 
      name: "Константин Голубев", 
      email: "golkonst@gmail.com", 
      phone: "+7 953 777 77 77",
      role: "admin", 
      status: "active", 
      avatar: "",
      lastLogin: "2024-01-15",
      created: "2024-01-01"
    },
    { 
      id: 2, 
      name: "Анна Иванова", 
      email: "anna@example.com", 
      phone: "+7 900 123 45 67",
      role: "user", 
      status: "active", 
      avatar: "",
      lastLogin: "2024-01-14",
      created: "2024-01-10"
    },
    { 
      id: 3, 
      name: "Петр Сидоров", 
      email: "petr@example.com", 
      phone: "+7 911 987 65 43",
      role: "user", 
      status: "inactive", 
      avatar: "",
      lastLogin: "2024-01-10",
      created: "2024-01-05"
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    return (
      <Badge 
        variant={status === "active" ? "default" : "secondary"}
        className={`text-xs ${
          status === "active" 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {status === "active" ? "Активен" : "Неактивен"}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    return (
      <Badge 
        variant="outline"
        className={`text-xs ${
          role === "admin" 
            ? "border-purple-200 text-purple-800 bg-purple-50" 
            : "border-blue-200 text-blue-800 bg-blue-50"
        }`}
      >
        {role === "admin" ? "Администратор" : "Пользователь"}
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout 
      title="Управление пользователями" 
      description="Администрирование учетных записей пользователей"
      actions={
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Добавить пользователя
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        {/* Поиск */}
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск пользователей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Список пользователей */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Список пользователей</span>
            </CardTitle>
            <CardDescription className="text-sm">Управление учетными записями пользователей</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 text-sm">{user.name}</h3>
                          {getStatusBadge(user.status)}
                          {getRoleBadge(user.role)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Вход: {user.lastLogin}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Статистика пользователей */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-xs text-gray-600">Всего пользователей</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</div>
              <div className="text-xs text-gray-600">Активных</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'admin').length}</div>
              <div className="text-xs text-gray-600">Администраторов</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'user').length}</div>
              <div className="text-xs text-gray-600">Пользователей</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
