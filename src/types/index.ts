export type Lang = 'ja' | 'en'

/** 多言語対応可能なテキスト */
export type LocalizedText = {
  ja: string
  en?: string
}

export type Project = {
  slug: string
  name: LocalizedText
  category: string
  summary: LocalizedText
  description: LocalizedText
  techStack: string[]
  highlights: LocalizedText[]
  githubUrl: string | null
  demoUrl: string | null
  image: string | null
  visibility: 'public' | 'private'
  scale?: Record<string, string>
  featured?: boolean
}

export type SkillCategory = {
  name: LocalizedText
  skills: string[]
}

export type Profile = {
  name: string
  tagline: LocalizedText
  about: LocalizedText
  githubUrl: string
  email: string
}

export type BlogPost = {
  slug: string
  title: LocalizedText
  date: string
  tags: string[]
  excerpt: LocalizedText
  url?: string
}
