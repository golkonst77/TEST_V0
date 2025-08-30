import { createClient } from "@supabase/supabase-js"

// Явно загружаем переменные окружения из .env.local
if (typeof window === 'undefined') {
  require('dotenv').config({ path: '.env.local' })
}

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
  // Логотип
  logoType?: "text" | "image"
  logoImageUrl?: string
  logoText?: string
  logoShow?: boolean
}

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY

console.log("Supabase URL:", supabaseUrl ? "Configured" : "Not configured")
console.log("Supabase Key:", supabaseKey ? "Configured" : "Not configured")

let supabase: any = null
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log("Supabase client created successfully")
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    supabase = null
  }
} else {
  console.warn("Supabase environment variables not found - using local storage fallback")
}

// Временное хранилище для разработки (когда Supabase не настроен)
let localSettings: SiteSettings = {
  siteName: "Просто Бюро",
  siteDescription: "Бухгалтерские услуги",
  phone: "+7953 330-17-77",
  email: "urist40@gmail.com",
  address: "Калуга, Дзержинского 37, офис 20",
  telegram: "@prostoburo",
  vk: "vk.com/buh_urist",
  maintenanceMode: false,
  analyticsEnabled: true,
  quiz_mode: "custom",
  quiz_url: "#popup:marquiz_685a59bddc273b0019e372cd",
  working_hours: {
    monday_friday: "9:00 - 18:00",
    saturday: "По согласованию",
    sunday: "Выходной"
  },
  logoType: "text",
  logoImageUrl: "",
  logoText: "ПростоБюро",
  logoShow: true
}

// Функция для маппинга данных из базы в интерфейс
function mapDatabaseToSettings(dbData: any): SiteSettings {
  return {
    siteName: dbData.sitename ?? dbData.site_name ?? "Просто Бюро",
    siteDescription: dbData.sitedescription ?? dbData.site_description ?? "Бухгалтерские услуги",
    phone: dbData.phone ?? "+7953 330-17-77",
    email: dbData.email ?? "urist40@gmail.com",
    address: dbData.address ?? "Калуга, Дзержинского 37, офис 20",
    telegram: dbData.telegram ?? "@prostoburo",
    vk: dbData.vk ?? "vk.com/buh_urist",
    maintenanceMode: dbData.maintenance_mode ?? dbData.maintenancemode ?? false,
    analyticsEnabled: dbData.analytics_enabled ?? dbData.analyticsenabled ?? true,
    quiz_mode: dbData.quiz_mode ?? "custom",
    quiz_url: dbData.quiz_url ?? "#popup:marquiz_685a59bddc273b0019e372cd",
    working_hours: {
      monday_friday: dbData.working_hours?.monday_friday ?? "9:00 - 18:00",
      saturday: dbData.working_hours?.saturday === "?? ????????????" ? "По согласованию" : (dbData.working_hours?.saturday ?? "По согласованию"),
      sunday: dbData.working_hours?.sunday === "????????" ? "Выходной" : (dbData.working_hours?.sunday ?? "Выходной")
    },
    logoType: dbData.logo_type ?? "text",
    logoImageUrl: dbData.logo_image_url ?? "",
    logoText: dbData.logo_text ?? dbData.sitename ?? "ПростоБюро",
    logoShow: dbData.logo_show ?? true
  }
}

export async function getSettings(): Promise<any> {
  // Если Supabase не настроен, сразу возвращаем локальные настройки
  if (!supabase) {
    console.warn("Supabase not configured - returning local settings")
    return {
      ...localSettings,
      header: {
        logo: {
          show: localSettings.logoShow !== undefined ? localSettings.logoShow : true,
          type: localSettings.logoType || "text",
          imageUrl: localSettings.logoImageUrl || "",
          text: localSettings.logoText || localSettings.siteName || "ПростоБюро"
        }
      }
    }
  }

  try {
    console.log("Attempting to fetch settings from Supabase...")
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
        return {
          ...localSettings,
          header: {
            logo: {
              show: localSettings.logoShow !== undefined ? localSettings.logoShow : true,
              type: localSettings.logoType || "text",
              imageUrl: localSettings.logoImageUrl || "",
              text: localSettings.logoText || localSettings.siteName || "ПростоБюро"
            }
          }
        };
      }
      
      return {
        ...localSettings,
        header: {
          logo: {
            show: localSettings.logoShow !== undefined ? localSettings.logoShow : true,
            type: localSettings.logoType || "text",
            imageUrl: localSettings.logoImageUrl || "",
            text: localSettings.logoText || localSettings.siteName || "ПростоБюро"
          }
        }
      };
    }
    
    console.log("Settings fetched successfully from Supabase:", data);
    const settings = mapDatabaseToSettings(data);
    // Возвращаем с header.logo для совместимости с компонентом Logo
    return {
      ...settings,
      header: {
        logo: {
          show: settings.logoShow !== undefined ? settings.logoShow : true,
          type: settings.logoType || "text",
          imageUrl: settings.logoImageUrl || "",
          text: settings.logoText || settings.siteName || "ПростоБюро"
        }
      }
    }
  } catch (error) {
    console.error("Exception while fetching settings:", error);
    // Добавляем детальную информацию об ошибке для отладки
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    // Возвращаем локальные настройки с правильной структурой
    return {
      ...localSettings,
      header: {
        logo: {
          show: localSettings.logoShow !== undefined ? localSettings.logoShow : true,
          type: localSettings.logoType || "text",
          imageUrl: localSettings.logoImageUrl || "",
          text: localSettings.logoText || localSettings.siteName || "ПростоБюро"
        }
      }
    };
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
      working_hours: newSettings.working_hours,
      logo_type: newSettings.logoType,
      logo_image_url: newSettings.logoImageUrl,
      logo_text: newSettings.logoText,
      logo_show: newSettings.logoShow
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
