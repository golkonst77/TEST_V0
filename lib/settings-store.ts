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

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function getSettings(): Promise<SiteSettings | null> {
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
