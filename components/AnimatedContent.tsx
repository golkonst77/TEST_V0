/**
 * @file: components/AnimatedContent.tsx
 * @description: Легкий анимированный wrapper с CSS (без GSAP) для предотвращения CLS
 * @dependencies: React, Intersection Observer
 * @created: 2024-06-13
 * @updated: 2025-11-29 - Заменено на CSS для улучшения производительности
 */

import { useRef, useEffect, ReactNode, useState } from 'react'

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
  animateOpacity = true,
  threshold = 0.1,
  delay = 0,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const el = ref.current
    if (!el) return

    // Используем Intersection Observer вместо GSAP
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [threshold])

  // Генерируем transform на основе направления
  const translateAxis = direction === 'horizontal' ? 'X' : 'Y'
  const translateValue = reverse ? -distance : distance

  return (
    <div
      ref={ref}
      style={{
        transform: isVisible ? 'translate3d(0, 0, 0)' : `translate${translateAxis}(${translateValue}px)`,
        opacity: isVisible ? 1 : (animateOpacity ? 0 : 1),
        transition: `transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, opacity ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

export default AnimatedContent 