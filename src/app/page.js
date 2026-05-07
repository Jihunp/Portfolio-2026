import About from '@/components/About'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Timeline from '@/components/Timeline'

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <About />
      <Timeline />
    </main>
  )
}