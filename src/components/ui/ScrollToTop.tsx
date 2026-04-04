import { useState, useEffect, useCallback } from 'react'

const SCROLL_THRESHOLD = 300

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed bottom-6 right-6 z-40
        px-4 py-2.5
        font-mono text-sm tracking-wider
        text-[var(--color-text-muted)] hover:text-[var(--color-accent)]
        bg-[var(--color-card)] border border-[var(--color-border)]
        hover:border-[var(--color-accent)]/50
        rounded-md cursor-pointer
        transition-all duration-300
        motion-safe:transition-all motion-reduce:transition-none
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      ▲ TOP
    </button>
  )
}
