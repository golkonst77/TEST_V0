import { useState, useEffect } from "react"
import { useSiteRuntimeBootstrap } from "@/components/site-runtime-provider"

type DeviceType = "mobile" | "tablet" | "desktop"

export function useDeviceType() {
  const bootstrap = useSiteRuntimeBootstrap()

  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    if (bootstrap?.initialDeviceHint === "mobile") return "mobile"
    return "desktop"
  })

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth

      if (width < 768) {
        setDeviceType("mobile")
      } else if (width < 1024) {
        setDeviceType("tablet")
      } else {
        setDeviceType("desktop")
      }
    }

    checkDeviceType()
    window.addEventListener("resize", checkDeviceType)

    return () => {
      window.removeEventListener("resize", checkDeviceType)
    }
  }, [])

  return deviceType
}
