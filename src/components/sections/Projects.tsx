import { projects } from '../../data/projects'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'
import { ProjectCard } from '../ui/ProjectCard'

export function Projects() {
  return (
    <section id="projects" className="py-20 px-6 bg-slate-100/50 dark:bg-slate-800/30">
      <FadeInOnScroll>
        <SectionHeading>Projects</SectionHeading>
      </FadeInOnScroll>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <FadeInOnScroll key={project.slug}>
            <ProjectCard project={project} />
          </FadeInOnScroll>
        ))}
      </div>
    </section>
  )
}
