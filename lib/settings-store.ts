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

console.log("Supabase URL:", supabaseUrl ? "Configured" : "Not configured")
console.log("Supabase Key:", supabaseKey ? "Configured" : "Not configured")

let supabase: any = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
  console.log("Supabase client created successfully")
} else {
  console.warn("Supabase environment variables not found - using local storage fallback")
}

// Временное хранилище для разработки (когда Supabase не настроен)
let localSettings: SiteSettings = {
  siteName: "ПростоБюро",
  siteDescription: "Профессиональная бухгалтерская компания",
  phone: "+7 953 330-17-77",
  email: "info@prostoburo.ru",
  address: "г. Калуга",
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

// Функция для маппинга данных из базы в интерфейс
function mapDatabaseToSettings(dbData: any): SiteSettings {
  return {
    siteName: dbData.sitename ?? dbData.site_name ?? "ПростоБюро",
    siteDescription: dbData.sitedescription ?? dbData.site_description ?? "Профессиональные бухгалтерские услуги",
    phone: dbData.phone ?? "+7 953 330-17-77",
    email: dbData.email ?? "info@prostoburo.ru",
    address: dbData.address ?? "г. Калуга",
    telegram: dbData.telegram ?? "https://t.me/prostoburo",
    vk: dbData.vk ?? "https://m.vk.com/buh_urist?from=groups",
    maintenanceMode: dbData.maintenance_mode ?? dbData.maintenancemode ?? false,
    analyticsEnabled: dbData.analytics_enabled ?? dbData.analyticsenabled ?? true,
    quiz_mode: dbData.quiz_mode ?? "custom",
    quiz_url: dbData.quiz_url ?? "",
    working_hours: dbData.working_hours ?? {
      monday_friday: "9:00 - 18:00",
      saturday: "10:00 - 15:00",
      sunday: "Выходной"
    }
  }
}

export async function getSettings(): Promise<SiteSettings | null> {
  if (!supabase) {
    console.warn("Supabase not configured - returning local settings")
    return localSettings
  }

  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();
    
    if (error) {
      console.error("Error fetching settings from Supabase:", error);
      
      // Если таблица не существует, возвращаем локальные настройки
      if (error.code === '42P01') {
        console.log("Settings table doesn't exist, returning local settings");
        return localSettings;
      }
      
      return localSettings;
    }
    
    console.log("Settings fetched successfully:", data);
    return mapDatabaseToSettings(data);
  } catch (error) {
    console.error("Exception while fetching settings:", error);
    return localSettings;
  }
}

export async function updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings | null> {
  if (!supabase) {
    console.warn("Supabase not configured - updating local settings")
    localSettings = { ...localSettings, ...newSettings }
    console.log("Local settings updated:", localSettings)
    return localSettings
  }

  try {
    console.log("Attempting to update settings with:", newSettings);
    
    // Маппинг полей для базы данных
    const dbSettings = {
      id: 1,
      sitename: newSettings.siteName,
      sitedescription: newSettings.siteDescription,
      phone: newSettings.phone,
      email: newSettings.email,
      address: newSettings.address,
      telegram: newSettings.telegram,
      vk: newSettings.vk,
      maintenance_mode: newSettings.maintenanceMode,
      analytics_enabled: newSettings.analyticsEnabled,
      quiz_mode: newSettings.quiz_mode,
      quiz_url: newSettings.quiz_url,
      working_hours: newSettings.working_hours
    }
    
    // Убираем undefined значения
    const cleanSettings = Object.fromEntries(
      Object.entries(dbSettings).filter(([_, value]) => value !== undefined)
    )
    
    console.log("Mapped settings for database:", cleanSettings);
    
    // Сначала пытаемся обновить существующую запись
    const { data: updateData, error: updateError } = await supabase
      .from("settings")
      .update(cleanSettings)
      .eq("id", 1)
      .select();
    
    if (updateError) {
      console.error("Error updating settings in Supabase:", updateError);
      
      // Если таблица не существует или запись не найдена, пытаемся создать
      if (updateError.code === '42P01' || updateError.code === 'PGRST116') {
        console.log("Table doesn't exist or record not found, trying to insert...");
        
        const { data: insertData, error: insertError } = await supabase
          .from("settings")
          .insert([cleanSettings])
          .select();
        
        if (insertError) {
          console.error("Error inserting settings in Supabase:", insertError);
          // Fallback to local storage
          localSettings = { ...localSettings, ...newSettings }
          return localSettings;
        }
        
        console.log("Settings inserted successfully:", insertData);
        return insertData?.[0] ? mapDatabaseToSettings(insertData[0]) : localSettings;
      }
      
      // Fallback to local storage
      localSettings = { ...localSettings, ...newSettings }
      return localSettings;
    }
    
    console.log("Settings updated successfully:", updateData);
    return updateData?.[0] ? mapDatabaseToSettings(updateData[0]) : localSettings;
  } catch (error) {
    console.error("Exception while updating settings:", error);
    // Fallback to local storage
    localSettings = { ...localSettings, ...newSettings }
    return localSettings;
  }
}
