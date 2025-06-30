import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = form.get("name") as string;
  const phone = form.get("phone") as string;
  const email = form.get("email") as string;
  const question = form.get("question") as string;
  const files = form.getAll("files");

  let uploadedFiles = [];
  for (const file of files) {
    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const ab = await file.arrayBuffer();
      const ext = (file as any).name?.split(".").pop() || "bin";
      const path = `uploads/${email}_${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from("uploads").upload(path, ab, {
        contentType: (file as any).type || "application/octet-stream",
        upsert: true,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      const { data: publicUrlData } = supabase.storage.from("uploads").getPublicUrl(path);
      uploadedFiles.push({ url: publicUrlData.publicUrl, name: (file as any).name });
    }
  }

  // Получаем текущий профиль пользователя
  const { data: existingProfile } = await supabase
    .from("user_profiles")
    .select("files")
    .eq("email", email)
    .single();
  let allFiles = [];
  if (existingProfile && Array.isArray(existingProfile.files)) {
    allFiles = [...existingProfile.files];
  }
  allFiles.push(...uploadedFiles);

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert([
      { name, phone, email, question, files: allFiles }
    ], { onConflict: "email" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", email)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
} 