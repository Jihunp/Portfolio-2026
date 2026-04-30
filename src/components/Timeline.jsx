"use client";
import {useEffect, useRef, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";

const timelineData = [
    {
        type: "Education",
        title: "B.Sc. Computer Science",
        sub: "University of Washington",
        date: "2020 — 2024",
        tags: ["Algorithms", "Web Dev", "Data Structures"],
    },
    {
        type: "Experience",
        title: "UI Engineer Intern",
        sub: "Tech Co.",
        date: "Summer 2022",
        tags: ["React", "Figma", "REST APIs"],
    },
    {
        type: "Project",
        title: "E-Commerce App",
        sub: "Personal Project",
        date: "2023",
        tags: ["React", "Node.js", "Stripe"],
    },
    {
        type: "Experience",
        title: "Frontend Developer",
        sub: "Acme Studio",
        date: "2024 — Present",
        tags: ["Next.js", "Three.js", "Tailwind"],
    },
    {
        type: "Project",
        title: "Portfolio Site",
        sub: "Personal Project",
        date: "2024",
        tags: ["Next.js", "GLSL", "Framer Motion"],
    },
];

export default function Timeline() {
    const [active, setActive] = useState(0);
    const sectionRef = useRef(null);

    // as user scrolls through the section, advance the active item
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // get the index from the data-index attribute
                        const index = Number(entry.target.dataset.index);
                        setActive(index);
                    }
                });
            },
            {
                root: null,
                // trigger when item is 40% into the viewport
                threshold: 0.4,
            },
        );

        // observe each scroll trigger element
        const triggers = section.querySelectorAll(".scroll-trigger");
        triggers.forEach((t) => observer.observe(t));

        return () => observer.disconnect();
    }, []);

    const item = timelineData[active];
    const isProject = item.type === "Project";

    return (
        <section ref={sectionRef} className="relative">
            {/* sticky panel — stays in view while user scrolls through triggers below */}
            <div className="sticky top-0 h-screen flex flex-col justify-center items-center px-8 z-10">
                {/* number track */}
                <div className="flex items-center gap-0 mb-10 relative">
                    {/* line behind the dots */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-[var(--muted)]/20" />

                    {timelineData.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className="relative flex flex-col items-center flex-1 min-w-[80px] cursor-pointer group">
                            <div
                                className={`w-9 h-9 rounded-full border flex items-center justify-center font-mono text-sm z-10 transition-all duration-300
                ${
                    active === i
                        ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10 scale-110"
                        : "border-[var(--muted)]/30 text-[var(--muted)]/50 bg-[var(--background)] group-hover:border-[var(--accent)]/50"
                }`}>
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            {/* type indicator dot */}
                            <div
                                className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                                    timelineData[i].type === "Project"
                                        ? "bg-[var(--muted)]"
                                        : "bg-[var(--accent)]"
                                }`}
                            />
                        </button>
                    ))}
                </div>

                {/* zoom panel */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{opacity: 0, scale: 0.92}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.95}}
                        transition={{duration: 0.3, ease: "easeOut"}}
                        className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--muted)]/15 rounded-2xl p-8 flex gap-8 items-center">
                        {/* big background number */}
                        <span className="font-mono font-bold text-[80px] leading-none text-[var(--accent)]/10 select-none flex-shrink-0">
                            {String(active + 1).padStart(2, "0")}
                        </span>

                        <div className="flex-1">
                            <p
                                className={`font-mono text-[10px] tracking-widest uppercase mb-2 ${
                                    isProject
                                        ? "text-[var(--muted)]"
                                        : "text-[var(--accent)]"
                                }`}>
                                {item.type}
                            </p>
                            <h3 className="font-heading text-2xl text-[var(--foreground)] mb-1">
                                {item.title}
                            </h3>
                            <p className="text-[var(--muted)] text-sm mb-1">
                                {item.sub}
                            </p>
                            <p className="font-mono text-xs text-[var(--muted)]/40 mb-4">
                                {item.date}
                            </p>

                            <div className="flex gap-2 flex-wrap">
                                {item.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="font-mono text-[10px] px-2 py-1 rounded border border-[var(--muted)]/20 text-[var(--muted)]/60">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* invisible scroll triggers — one per item, stacked vertically */}
            {/* scrolling through these drives the active state */}
            <div className="relative z-0">
                {timelineData.map((_, i) => (
                    <div
                        key={i}
                        data-index={i}
                        className="scroll-trigger h-screen"
                    />
                ))}
            </div>
        </section>
    );
}
