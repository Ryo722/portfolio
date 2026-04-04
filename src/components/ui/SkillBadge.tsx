interface SkillBadgeProps {
  name: string
  /** Number of projects using this skill (0–max) */
  projectCount?: number
  /** Maximum project count across all skills (for normalization) */
  maxProjectCount?: number
}

export function SkillBadge({ name, projectCount = 0, maxProjectCount = 1 }: SkillBadgeProps) {
  // Normalize to 1–5 dots (at least 1 if projectCount > 0, otherwise 0)
  const maxDots = 5
  const filledDots = projectCount === 0
    ? 0
    : Math.max(1, Math.round((projectCount / Math.max(maxProjectCount, 1)) * maxDots))

  return (
    <span className="inline-flex flex-col gap-0.5 px-1 py-0.5 font-mono bg-transparent text-[var(--color-accent)]">
      <span className="text-sm">[{name}]</span>
      {maxProjectCount > 0 && (
        <span className="flex gap-px pl-0.5" aria-label={`Proficiency: ${filledDots} of ${maxDots}`}>
          {Array.from({ length: maxDots }, (_, i) => (
            <span
              key={i}
              className="inline-block w-1.5 h-1.5 rounded-sm"
              style={{
                backgroundColor: i < filledDots
                  ? 'var(--color-accent)'
                  : 'var(--color-border)',
              }}
            />
          ))}
        </span>
      )}
    </span>
  )
}
