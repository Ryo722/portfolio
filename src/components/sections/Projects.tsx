import { projects } from '../../data/projects'
import { useLang } from '../../hooks/useLang'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'
import { ProjectCard } from '../ui/ProjectCard'

export function Projects() {
  const { lang } = useLang()
  const otherProjects = projects.filter((p) => !p.featured)

  if (otherProjects.length === 0) return null

  return (
    <section className="py-20 px-6">
      <FadeInOnScroll>
        <SectionHeading>{lang === 'ja' ? 'Other Projects' : 'Other Projects'}</SectionHeading>
      </FadeInOnScroll>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherProjects.map((project) => (
          <FadeInOnScroll key={project.slug}>
            <ProjectCard project={project} />
          </FadeInOnScroll>
        ))}
      </div>
    </section>
  )
}
