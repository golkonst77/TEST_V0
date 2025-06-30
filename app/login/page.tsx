"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMsg(error.message);
    else {
      setMsg("Успешный вход!");
      window.location.href = "/lk";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-white py-8 px-2">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="flex flex-col items-center gap-2 pb-0">
          <CardTitle className="text-center w-full">Вход</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={login} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10"
                type="email"
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />} Войти
            </Button>
            {msg && <div className={msg === "Успешный вход!" ? "text-green-600 text-xs text-center mt-2" : "text-red-500 text-xs text-center mt-2"}>{msg}</div>}
          </form>
        </CardContent>
        <CardFooter className="justify-center pt-0">
          <div className="text-xs text-muted-foreground">
            Нет аккаунта? <a href="/register" className="text-blue-600 hover:underline">Зарегистрироваться</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 