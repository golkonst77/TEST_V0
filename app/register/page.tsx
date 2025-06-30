"use client";
import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
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
    if (fileRef.current?.files) {
      for (const file of fileRef.current.files) {
        form.append("files", file);
      }
    }
    await fetch("/api/user/profile", { method: "POST", body: form });
    setMsg("Регистрация успешна!");
    window.location.href = "/lk";
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Регистрация</h1>
      <form onSubmit={register} encType="multipart/form-data">
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
        <input
          type="file"
          multiple
          ref={fileRef}
          style={{ marginBottom: 8 }}
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <div>{msg}</div>
      <div style={{ marginTop: 16 }}>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </div>
    </div>
  );
} 