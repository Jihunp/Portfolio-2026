'use client'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const projects = [
  {
    title: 'AI Developer Portfolio',
    description: 'Personal portfolio with a built-in AI assistant powered by Claude. Visitors can ask questions about my skills and availability.',
    tech: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Claude API'],
    github: 'https://github.com/yourusername/my-portfolio',
    live: 'https://yourname.vercel.app',
  },
  // ← add more projects here as you build them
]

export default function Projects() {
  return (
    <section id="projects"
      className="py-24 px-6 max-w-6xl mx-auto">
      <ScrollReveal>
        <h2 className="text-3xl font-bold text-center mb-16">
          Projects
        </h2>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <ScrollReveal key={project.title} delay={i * 0.07}>
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="h-full border border-gray-200 rounded-2xl p-6
                bg-white hover:shadow-xl transition-shadow cursor-pointer"
            >
              <h3 className="text-base font-semibold mb-2">
                {project.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tech.map((t) => (
                  <span key={t}
                    className="bg-blue-50 text-blue-700 text-xs
                      font-medium px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-sm">
                <a href={project.github}
                  className="text-gray-400 hover:text-gray-700 transition-colors">
                  GitHub →
                </a>
                <a href={project.live}
                  className="text-blue-600 font-medium hover:text-blue-700
                    transition-colors">
                  Live site →
                </a>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}