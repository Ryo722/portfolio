export function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-12 text-center">
      {children}
    </h2>
  )
}
