import About from '@/components/About'
import Hero from '@/components/Hero'
import Timeline from '@/components/Timeline'
import ProjectScroll from '@/components/ProjectScroll'
import Simple from '@/components/Simple'

export default function Home() {
  return (
    <main>
      <Hero />
      <Simple />
      {/* <Timeline /> */}
      {/* <ProjectScroll /> */}
      <About />
    </main>
  )
}