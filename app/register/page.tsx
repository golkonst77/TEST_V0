"use client";
import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { ReCAPTCHAComponent } from "@/components/recaptcha";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [msg, setMsg] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!email.includes('@')) newErrors.email = "Некорректный email";
    if (password.length < 6) newErrors.password = "Пароль должен быть не менее 6 символов";
    if (!name.trim()) newErrors.name = "Имя обязательно";
    if (!phone.trim()) newErrors.phone = "Телефон обязателен";
    if (!recaptchaToken) newErrors.recaptcha = "Пожалуйста, подтвердите, что вы не робот";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Проверяем reCAPTCHA
      const recaptchaResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: recaptchaToken })
      });

      const recaptchaData = await recaptchaResponse.json();
      
      if (!recaptchaData.success || !recaptchaData.isHuman) {
        setErrors({ recaptcha: 'Проверка reCAPTCHA не пройдена. Попробуйте еще раз.' });
        return;
      }

      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) return setMsg(error.message);
      
      // автологин
      await supabase.auth.signInWithPassword({ email, password });
      
      // запись профиля
      const form = new FormData();
      form.append("email", email);
      form.append("name", name);
      form.append("phone", phone);
      form.append("question", question);
      await fetch("/api/user/profile", { method: "POST", body: form });
      setMsg("Регистрация успешна!");
      window.location.href = "/lk";
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ recaptcha: 'Ошибка при регистрации. Попробуйте еще раз.' });
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Регистрация</h1>
      <form onSubmit={register}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          placeholder="Имя"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          placeholder="Телефон"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <textarea
          placeholder="Вопрос"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
          <ReCAPTCHAComponent onVerify={setRecaptchaToken} />
        </div>
        {errors.recaptcha && <div style={{ color: 'red', fontSize: '12px', marginBottom: 8, textAlign: 'center' }}>{errors.recaptcha}</div>}
        <button type="submit">Зарегистрироваться</button>
      </form>
      <div>{msg}</div>
      <div style={{ marginTop: 16 }}>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </div>
    </div>
  );
} 