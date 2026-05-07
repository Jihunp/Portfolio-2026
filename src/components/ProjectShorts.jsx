"use client";

const projects = [
    {
        index: "01",
        title: "Book of Marks",
        category: "Full Stack",
        description: "Collaborative annotation tool. Highlight text, create personal notes, and share annotations in real time.",
        tech: ["React", "TypeScript", "Firebase"],
        live: "https://book-of-e994d.web.app/",
        github: "https://github.com/Jihunp",
    },
    {
        index: "02",
        title: "Jarvus AI",
        category: "AI · In Dev",
        description: "Personal AI-powered productivity assistant. Streaming GPT-4o responses with a full-stack architecture.",
        tech: ["React", "Node.js", "OpenAI"],
        live: null,
        github: "https://github.com/Jihunp",
    },
    {
        index: "03",
        title: "Tetris Clone",
        category: "Frontend · Game",
        description: "Fully playable Tetris built in pure React. Frame-perfect gameplay with advanced state management.",
        tech: ["React", "JavaScript", "CSS"],
        live: "https://tetris-kappa-blush.vercel.app/",
        github: "https://github.com/Jihunp",
    },
    {
        index: "04",
        title: "Wordle Clone",
        category: "Frontend · Game",
        description: "Pixel-perfect Wordle clone using React hooks for game logic, state, and keyboard interactions.",
        tech: ["React", "JavaScript", "Hooks"],
        live: "https://wordle-one-coral.vercel.app/",
        github: "https://github.com/Jihunp",
    },
];

function ProjectCard({ project }) {
    const href = project.live ?? project.github;

    return (
        /*
         * `group` — marks this element as the hover source.
         * Any descendant can now use `group-hover:` to react when THIS element
         * is hovered, without any JavaScript.
         */
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="
                group
                relative aspect-square
                rounded-lg overflow-hidden
                bg-surface no-underline cursor-pointer
                border border-white/[0.08] border-l-[3px] border-l-muted
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-2xl hover:border-l-accent
            ">
            <div className="
                absolute inset-0 p-5
                flex flex-col justify-between
                transition-opacity duration-200
                group-hover:opacity-0
            ">
                <div>
                    <span className="block text-[0.62rem] tracking-[0.28em] uppercase text-muted font-mono mb-2">
                        {project.index} — {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground tracking-tight leading-tight m-0">
                        {project.title}
                    </h3>
                </div>

                <div className="flex flex-wrap gap-1">
                    {project.tech.map((tag) => (
                        <span
                            key={tag}
                            className="text-[0.58rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full border border-muted/25 text-muted font-mono">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>


            <div className="
                absolute inset-0 bg-background p-5
                flex flex-col justify-end
                translate-y-full group-hover:translate-y-0
                transition-transform duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            ">
                <span className="text-[0.62rem] tracking-[0.28em] uppercase text-muted font-mono mb-1.5">
                    {project.category}
                </span>
                <h3 className="text-xl font-bold text-foreground tracking-tight leading-tight mb-3">
                    {project.title}
                </h3>
                <p className="text-[0.82rem] text-foreground/55 leading-relaxed mb-4">
                    {project.description}
                </p>
                <div className="inline-flex items-center gap-1.5 text-[0.67rem] tracking-[0.2em] uppercase text-accent font-mono font-semibold">
                    {project.live ? "View Live" : "View GitHub"}
                    <span>↗</span>
                </div>
            </div>
        </a>
    );
}

export default function ProjectShorts() {
    return (
        <section className="bg-background px-[clamp(1.5rem,6vw,6rem)] py-[clamp(4rem,10vh,8rem)]">

            <div className="mb-[clamp(2.5rem,6vh,4rem)]">
                <p className="text-[0.7rem] tracking-[0.3em] uppercase text-muted font-mono mb-2">
                    Quick look
                </p>
                <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-foreground tracking-tighter leading-none m-0">
                    Project Shorts
                </h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                {projects.map((project) => (
                    <ProjectCard key={project.index} project={project} />
                ))}
            </div>
        </section>
    );
}
