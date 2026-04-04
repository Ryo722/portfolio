export function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="text-3xl font-mono font-bold tracking-wider text-[var(--color-text)] mb-12 text-center flex items-center justify-center gap-4">
      <span className="block w-16 h-0.5 bg-[var(--color-accent)]/40" aria-hidden="true" />
      {children}
      <span className="block w-16 h-0.5 bg-[var(--color-accent)]/40" aria-hidden="true" />
    </h2>
  )
}
