"use client"

import type { ReactNode } from "react"
import { useHomepageSections } from "@/hooks/use-homepage-sections"
import { useDeviceType } from "@/hooks/use-device-type"

export function VisibilityGuard({
  sectionKey,
  children,
}: {
  sectionKey: string
  children: ReactNode
}) {
  const { isSectionVisible } = useHomepageSections()
  const deviceType = useDeviceType()
  const deviceTypeForVisibility = deviceType === "tablet" ? "desktop" : deviceType

  if (!isSectionVisible(sectionKey, deviceTypeForVisibility)) return null
  return <>{children}</>
}

