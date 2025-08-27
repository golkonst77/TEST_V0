/**
 * @file: components/AnimatedContent.tsx
 * @description: Анимированный wrapper для появления контента при скролле (GSAP + ScrollTrigger)
 * @dependencies: gsap, gsap/ScrollTrigger, React
 * @created: 2024-06-13
 */

import { useRef, useEffect, ReactNode } from 'react'

interface AnimatedContentProps {
  children: ReactNode
  distance?: number
  direction?: 'vertical' | 'horizontal'
  reverse?: boolean
  duration?: number
  ease?: string
  initialOpacity?: number
  animateOpacity?: boolean
  scale?: number
  threshold?: number
  delay?: number
  onComplete?: () => void
}

function AnimatedContent({
  children,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Динамическая загрузка GSAP только на клиенте
    let gsap: any = null
    let ScrollTrigger: any = null
    
    try {
      gsap = require('gsap')
      ScrollTrigger = require('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
    } catch (error) {
      console.warn('GSAP не загружен:', error)
      return
    }
    
    if (!gsap || !ScrollTrigger) return
    
    const el = ref.current
    if (!el) return

    const axis = direction === 'horizontal' ? 'x' : 'y'
    const offset = reverse ? -distance : distance
    const startPct = (1 - threshold) * 100

    gsap.set(el, {
      [axis]: offset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1,
    })

    gsap.to(el, {
      [axis]: 0,
      scale: 1,
      opacity: 1,
      duration,
      ease,
      delay,
      onComplete,
      scrollTrigger: {
        trigger: el,
        start: `top ${startPct}%`,
        toggleActions: 'play none none none',
        once: true,
      },
    })

    return () => {
      if (ScrollTrigger && ScrollTrigger.getAll) {
        ScrollTrigger.getAll().forEach((t: any) => t.kill())
      }
      if (gsap && gsap.killTweensOf) {
        gsap.killTweensOf(el)
      }
    }
  }, [
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    onComplete,
  ])

  return <div ref={ref}>{children}</div>
}

export default AnimatedContent 