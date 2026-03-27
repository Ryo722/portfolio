import type { ReactNode } from 'react'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

export function FadeInOnScroll({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, isVisible } = useIntersectionObserver(0.1)

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}
