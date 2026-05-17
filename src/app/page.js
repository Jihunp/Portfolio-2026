import About from '@/components/About'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
// import ProjectShorts from '@/components/ProjectShorts'
import Timeline from '@/components/Timeline'
import GetInTouch from '@/components/GetInTouch'

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      {/* <ProjectShorts /> */}
      <About />
      <Timeline />
      <GetInTouch />
    </main>
  )
}