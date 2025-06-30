"use client"

import Link from "next/link"
import { Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContactForm } from "@/hooks/use-contact-form"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { createClient } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Lock, User, Loader2, FileText } from "lucide-react"

interface SiteSettings {
  siteName: string
  phone: string
  telegram: string
  vk: string
}

function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const validateEmail = (v: string) => /.+@.+\..+/.test(v);
  const validatePassword = (v: string) => v.length >= 6;

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    let err: any = {};
    if (!validateEmail(email)) err.email = "Введите корректный email";
    if (!validatePassword(password)) err.password = "Минимум 6 символов";
    if (Object.keys(err).length) return setErrors(err);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMsg(error.message);
    else {
      setMsg("");
      onOpenChange(false);
      window.location.href = "/lk";
    }
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    let err: any = {};
    if (!validateEmail(email)) err.email = "Введите корректный email";
    if (!validatePassword(password)) err.password = "Минимум 6 символов";
    if (!name) err.name = "Введите имя";
    if (!phone) err.phone = "Введите телефон";
    if (Object.keys(err).length) return setErrors(err);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      return setMsg(error.message);
    }
    await supabase.auth.signInWithPassword({ email, password });
    const form = new FormData();
    form.append("email", email);
    form.append("name", name);
    form.append("phone", phone);
    form.append("question", question);
    if (fileRef.current?.files) {
      for (const file of fileRef.current.files) {
        form.append("files", file);
      }
    }
    await fetch("/api/user/profile", { method: "POST", body: form });
    setLoading(false);
    setMsg("");
    onOpenChange(false);
    window.location.href = "/lk";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl shadow-2xl border bg-white dark:bg-zinc-900">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex w-full">
            <TabsTrigger value="login" className="flex-1">Вход</TabsTrigger>
            <TabsTrigger value="register" className="flex-1">Регистрация</TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="login">
              <form onSubmit={login} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                  <Input id="login-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={errors.email ? "border-red-500" : ""} />
                  {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                </div>
                <div>
                  <Label htmlFor="login-password" className="flex items-center gap-2"><Lock className="w-4 h-4" /> Пароль</Label>
                  <Input id="login-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" className={errors.password ? "border-red-500" : ""} />
                  {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Войти
                </Button>
                {msg && <div className="text-xs text-red-500 mt-2 text-center">{msg}</div>}
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={register} encType="multipart/form-data" className="space-y-4">
                <div>
                  <Label htmlFor="reg-email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                  <Input id="reg-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={errors.email ? "border-red-500" : ""} />
                  {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                </div>
                <div>
                  <Label htmlFor="reg-password" className="flex items-center gap-2"><Lock className="w-4 h-4" /> Пароль</Label>
                  <Input id="reg-password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" className={errors.password ? "border-red-500" : ""} />
                  {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
                </div>
                <div>
                  <Label htmlFor="reg-name" className="flex items-center gap-2"><User className="w-4 h-4" /> Имя</Label>
                  <Input id="reg-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" className={errors.name ? "border-red-500" : ""} />
                  {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                </div>
                <div>
                  <Label htmlFor="reg-phone" className="flex items-center gap-2"><Phone className="w-4 h-4" /> Телефон</Label>
                  <Input id="reg-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 900 000-00-00" className={errors.phone ? "border-red-500" : ""} />
                  {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
                </div>
                <div>
                  <Label htmlFor="reg-question" className="flex items-center gap-2"><FileText className="w-4 h-4" /> Вопрос</Label>
                  <Textarea id="reg-question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ваш вопрос (необязательно)" />
                </div>
                <div>
                  <Label htmlFor="reg-files" className="flex items-center gap-2"><FileText className="w-4 h-4" /> Файлы</Label>
                  <Input id="reg-files" type="file" multiple ref={fileRef} />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Зарегистрироваться
                </Button>
                {msg && <div className="text-xs text-red-500 mt-2 text-center">{msg}</div>}
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export const Header = () => {
  const { openContactForm } = useContactForm()
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "ПростоБюро",
    phone: "+7 953 330-17-77",
    telegram: "https://t.me/prostoburo",
    vk: "https://m.vk.com/buh_urist?from=groups",
  })
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    fetchSettings()

    // Обновляем настройки каждые 5 секунд для демонстрации
    const interval = setInterval(fetchSettings, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchSettings = async () => {
    try {
      console.log("Header: Fetching settings...")
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        console.log("Header: Loaded settings:", data)
        setSettings({
          siteName: data.siteName,
          phone: data.phone,
          telegram: data.telegram,
          vk: data.vk,
        })
      } else {
        console.error("Header: Failed to fetch settings")
      }
    } catch (error) {
      console.error("Header: Error fetching settings:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">ПБ</span>
            </div>
            <span className="font-bold text-xl">{settings.siteName}</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <Link href="/services" className="hover:text-blue-600">
                Услуги
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-blue-600">
                Тарифы
              </Link>
            </li>
            <li>
              <Link href="/calculator" className="hover:text-blue-600">
                Калькулятор
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-blue-600">
                Блог
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-blue-600">
                Контакты
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right side widgets */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>{settings.phone}</span>
          </div>

          {/* Social links */}
          <div className="flex items-center space-x-2">
            <Link href={settings.telegram || "#"} className="p-2 rounded-full hover:bg-gray-100" aria-label="Telegram">
              <MessageCircle className="h-4 w-4" />
            </Link>
            <Link href={settings.vk || "#"} className="p-2 rounded-full hover:bg-gray-100" aria-label="VK">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.9-1.49.4v1.608c0 .432-.138.69-1.276.69-1.966 0-4.644-1.193-6.36-3.428C4.304 11.13 3.568 8.28 3.568 7.648c0-.414.138-.69.966-.69h1.744c.69 0 .966.276 1.241 1.172.69 2.07 1.863 3.428 2.346 3.428.276 0 .414-.138.414-.9V9.936c-.069-1.241-.725-1.345-.725-1.793 0-.345.276-.69.725-.69h2.76c.588 0 .795.276.795.966v2.898c0 .588.276.795.414.795.276 0 .588-.207 1.172-.795 1.241-1.379 2.139-3.566 2.139-3.566.138-.345.414-.69 1.103-.69h1.744c.828 0 1.01.414.828.966-.414 1.24-2.484 4.062-2.484 4.062-.276.414-.207.588 0 .966.207.276 1.103 1.103 1.655 1.793.552.69.966 1.379.69 1.793z" />
              </svg>
            </Link>
          </div>

          {/* CTA */}
          <Button
            onClick={openContactForm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Хочу на круиз без штрафов
          </Button>
          {/* Кнопка входа в ЛК */}
          <Button variant="outline" className="ml-2" onClick={() => setAuthOpen(true)}>
            Личный кабинет
          </Button>
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </div>
      </div>
    </header>
  )
}

export default Header
