export function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-[var(--color-text-faint)]">
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent mb-8" />
      <p>&copy; {new Date().getFullYear()} Ryo722. All rights reserved.</p>
    </footer>
  )
}
