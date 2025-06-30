"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Loader2, User, Mail, Phone as PhoneIcon, FileText, ImageOff } from "lucide-react";
import Image from "next/image";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LkPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imgErrors, setImgErrors] = useState<{[url: string]: boolean}>({});

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
      } else {
        setEmail(data.user.email || "");
        const res = await fetch(`/api/user/profile?email=${encodeURIComponent(data.user.email || "")}`);
        if (res.ok) {
          const { data: profile } = await res.json();
          if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
          if (profile.files) setFiles(profile.files);
        }
        setLoading(false);
      }
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setSaving(true);
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
    const res = await fetch("/api/user/profile", {
      method: "POST",
      body: form,
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Сохранено!");
      const profileRes = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
      if (profileRes.ok) {
        const { data: profile } = await profileRes.json();
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
        if (profile.files) setFiles(profile.files);
      }
    }
    else setError("Ошибка: " + (await res.text()));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[60vh] text-lg">Загрузка...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-white py-8 px-2">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="flex flex-col items-center gap-2 pb-0 relative">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarImage src={preview || avatarUrl || "/avatar-placeholder.png"} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
          <CardTitle className="text-center w-full">Личный кабинет</CardTitle>
          <Button
            onClick={logout}
            variant="ghost"
            className="absolute top-0 right-0 flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
            title="Выйти"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={save} encType="multipart/form-data" className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10"
                type="email"
                autoComplete="email"
                disabled
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Имя"
                value={name}
                onChange={e => setName(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Телефон"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <FileText className="absolute left-3 top-4 text-muted-foreground w-4 h-4" />
              <Textarea
                placeholder="Вопрос"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                className="pl-10"
                rows={3}
              />
            </div>
            <div>
              <Input
                type="file"
                multiple
                ref={fileRef}
                className="file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700"
                onChange={handleFileChange}
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold" disabled={saving}>
              {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Сохранить
            </Button>
            {msg && <div className="text-green-600 text-xs text-center mt-2">{msg}</div>}
            {error && <div className="text-red-500 text-xs text-center mt-2">{error}</div>}
          </form>
          <div className="mt-6">
            <div className="font-semibold mb-2 text-sm text-gray-700">Загруженные файлы:</div>
            {files && files.length > 0 ? (
              <div className="flex flex-col gap-2">
                {files.map((file, i) => {
                  const isImage = file.url && file.name && file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i);
                  const hasError = imgErrors[file.url];
                  return (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-purple-50 transition group max-w-full"
                      style={{textDecoration:'none'}}
                      title={file.name}
                    >
                      {isImage ? (
                        hasError ? (
                          <span className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded border"><ImageOff className="w-6 h-6 text-gray-400" /></span>
                        ) : (
                          <Image
                            src={file.url}
                            alt={file.name}
                            width={40}
                            height={40}
                            className="rounded border bg-white object-cover aspect-square"
                            onError={() => setImgErrors(e => ({...e, [file.url]: true}))}
                            style={{minWidth:40,minHeight:40,maxWidth:40,maxHeight:40,objectFit:'cover'}}
                          />
                        )
                      ) : (
                        <span className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded border">
                          <FileText className="w-6 h-6 text-gray-400" />
                          <span className="ml-1 text-xs text-gray-400">{file.name.split('.').pop()?.toUpperCase()}</span>
                        </span>
                      )}
                      <span className="truncate text-sm font-medium text-gray-800 group-hover:text-purple-700 max-w-[180px]" style={{lineHeight:'1.2'}}>{file.name}</span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-400">Нет загруженных файлов</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-end pt-0">
          {/* Кнопка выхода перенесена в CardHeader */}
        </CardFooter>
      </Card>
    </div>
  );
} 