export function SkillBadge({ name }: { name: string }) {
  return (
    <span className="inline-block px-3 py-1 text-sm font-mono bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-md">
      {name}
    </span>
  )
}
