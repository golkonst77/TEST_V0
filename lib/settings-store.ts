import { createClient } from "@supabase/supabase-js"

// Общее хранилище настроек для всего приложения
export interface SiteSettings {
  siteName: string
  siteDescription: string
  phone: string
  email: string
  address: string
  telegram: string
  vk: string
  maintenanceMode: boolean
  analyticsEnabled: boolean
  quiz_mode?: "custom" | "external"
  quiz_url?: string
  // Время работы
  working_hours?: {
    monday_friday?: string
    saturday?: string
    sunday?: string
  }
}

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: any = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export async function getSettings(): Promise<SiteSettings | null> {
  if (!supabase) {
    console.warn("Supabase not configured - returning default settings")
    return {
      siteName: "ПростоБюро",
      siteDescription: "Профессиональная бухгалтерская компания",
      phone: "+7 953 330-17-77",
      email: "info@prostoburo.ru",
      address: "г. Москва",
      telegram: "https://t.me/prostoburo",
      vk: "https://vk.com/prostoburo",
      maintenanceMode: false,
      analyticsEnabled: true,
      quiz_mode: "custom",
      working_hours: {
        monday_friday: "09:00-18:00",
        saturday: "10:00-16:00",
        sunday: "выходной"
      }
    }
  }

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) {
    console.error("Error fetching settings from Supabase:", error);
    return null;
  }
  return data as SiteSettings;
}

export async function updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings | null> {
  if (!supabase) {
    console.warn("Supabase not configured - cannot update settings")
    return null;
  }

  // Обновляем строку с id=1
  const { data, error } = await supabase
    .from("settings")
    .upsert([{ id: 1, ...newSettings }], { onConflict: "id" });
  if (error) {
    console.error("Error updating settings in Supabase:", error);
    return null;
  }
  return data?.[0] as SiteSettings;
}
