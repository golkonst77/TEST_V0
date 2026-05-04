"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { HomepageSectionsConfig } from "@/lib/visibility-store"
import type { RequestDeviceHint } from "@/lib/request-device"

export type SiteRuntimeBootstrap = {
  initialSectionsConfig: HomepageSectionsConfig
  initialDeviceHint: RequestDeviceHint
}

const SiteRuntimeContext = createContext<SiteRuntimeBootstrap | null>(null)

export function SiteRuntimeProvider({
  initialSectionsConfig,
  initialDeviceHint,
  children,
}: SiteRuntimeBootstrap & { children: ReactNode }) {
  return (
    <SiteRuntimeContext.Provider value={{ initialSectionsConfig, initialDeviceHint }}>
      {children}
    </SiteRuntimeContext.Provider>
  )
}

export function useSiteRuntimeBootstrap() {
  return useContext(SiteRuntimeContext)
}
