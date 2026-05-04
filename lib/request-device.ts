export type RequestDeviceHint = "mobile" | "desktop"

type HeaderBag = { get(name: string): string | null }

/**
 * Best-effort SSR device hint for visibility (desktop/tablet bucket vs mobile).
 * Client-side `useDeviceType` still refines after mount (including tablet).
 */
export function getRequestDeviceHint(headers: HeaderBag): RequestDeviceHint {
  const secMobile = headers.get("sec-ch-ua-mobile")
  if (secMobile === "?1") return "mobile"
  if (secMobile === "?0") return "desktop"

  const ua = headers.get("user-agent") ?? ""
  return /Mobile|Android|iPhone|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) ? "mobile" : "desktop"
}
