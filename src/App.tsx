import { useState, useEffect } from 'react'
import type { Lang } from './types'
import type { Theme } from './hooks/useTheme'
import { LangContext } from './hooks/useLang'
import { ThemeContext } from './hooks/useTheme'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { FeaturedProjects } from './components/sections/FeaturedProjects'
import { Skills } from './components/sections/Skills'
import { About } from './components/sections/About'
import { Projects } from './components/sections/Projects'
import { Notes } from './components/sections/Notes'
import { Contact } from './components/sections/Contact'

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'ja'
  })
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Header />
        <main>
          <Hero />
          <FeaturedProjects />
          <Skills />
          <About />
          <Projects />
          <Notes />
          <Contact />
        </main>
        <Footer />
      </ThemeContext.Provider>
    </LangContext.Provider>
  )
}
