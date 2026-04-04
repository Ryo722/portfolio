import type { ReactNode, CSSProperties } from 'react'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

interface FadeInOnScrollProps {
  children: ReactNode
  className?: string
  /** Stagger delay in ms — useful for sequential items in a list */
  delay?: number
}

export function FadeInOnScroll({ children, className = '', delay = 0 }: FadeInOnScrollProps) {
  const { ref, isVisible } = useIntersectionObserver(0.1)

  const style: CSSProperties | undefined = delay > 0
    ? { transitionDelay: `${delay}ms` }
    : undefined

  return (
    <div
      ref={ref}
      style={style}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}
