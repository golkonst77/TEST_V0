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
}

// Глобальное хранилище настроек
let globalSettings: SiteSettings = {
  siteName: "ПростоБюро",
  siteDescription: "Профессиональные бухгалтерские услуги",
  phone: "+7 953 330-17-77",
  email: "info@prostoburo.ru",
  address: "г. Москва, ул. Примерная, д. 1",
  telegram: "https://t.me/prostoburo",
  vk: "https://m.vk.com/buh_urist?from=groups",
  maintenanceMode: false,
  analyticsEnabled: true,
}

export function getSettings(): SiteSettings {
  return { ...globalSettings }
}

export function updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
  globalSettings = { ...globalSettings, ...newSettings }
  console.log("Settings updated in store:", globalSettings)
  return { ...globalSettings }
}
