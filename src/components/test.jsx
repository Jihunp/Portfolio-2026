"use client";
import {useState, useEffect, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";

const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

const ITEMS = [
    {
        year: 2018,
        num: "01",
        title: "CS Degree",
        type: "Education",
        stack: "UW Computer Science",
        role: "Student",
        desc: "Began studies in algorithms, data structures, and web development.",
    },
    {
        year: 2020,
        num: "02",
        title: "First Internship",
        type: "Experience",
        stack: "HTML, CSS, JS",
        role: "Dev Intern",
        desc: "Built internal dashboards at a local startup. Learned version control and team workflows.",
    },
    {
        year: 2022,
        num: "03",
        title: "E-Commerce App",
        type: "Project",
        stack: "React, Node.js, Stripe",
        role: "Full-stack",
        desc: "A complete e-commerce platform with cart, checkout, and Stripe payment integration.",
    },
    {
        year: 2023,
        num: "04",
        title: "UI Intern",
        type: "Experience",
        stack: "Next.js, Figma",
        role: "UI Engineering",
        desc: "Shipped client-facing interfaces and collaborated closely with designers.",
    },
    {
        year: 2024,
        num: "05",
        title: "Frontend Dev",
        type: "Experience",
        stack: "Next.js, Three.js",
        role: "Frontend Dev",
        desc: "Led migration to Next.js, reducing load time by 40%. Built animated pages.",
    },
    {
        year: 2025,
        num: "06",
        title: "Portfolio Site",
        type: "Project",
        stack: "Next.js, GLSL, Framer",
        role: "Design & Dev",
        desc: "Custom portfolio with interactive shader hero and scroll-driven animations.",
    },
];

// cards on left side of the line
const LEFT_YEARS = [2018, 2022, 2025];
// cards on right side of the line
const RIGHT_YEARS = [2020, 2023, 2024];

const SCROLL_YEARS = [2018, 2022, 2024];
const SCROLL_ITEMS = ITEMS.filter((i) => SCROLL_YEARS.includes(i.year));

function DecoCard({item, side}) {
    return (
        <div
            className={`w-[120px] border border-gray-100 rounded-md p-2 ${side === "left" ? "text-right" : "text-left"}`}>
            <p className="font-mono text-[8px] text-[var(--accent)] tracking-widest mb-1">
                {item.num}
            </p>
            <p className="text-[11px] font-medium text-gray-800 leading-tight">
                {item.title}
            </p>
            <p className="text-[8px] text-gray-400 mt-1">{item.type}</p>
        </div>
    );
}

function MetaRow({label, value}) {
    return (
        <div className="flex gap-4 font-mono text-[10px]">
            <span className="text-gray-300 uppercase tracking-widest min-w-[52px]">
                {label}
            </span>
            <span className="text-gray-700">{value}</span>
        </div>
    );
}

export default function Timeline() {
    const [active, setActive] = useState(0);
    const sectionRef = useRef(null);
    const rowRefs = useRef([]);

    // fill height updates based on active year position
    const activeYearIdx = YEARS.indexOf(SCROLL_ITEMS[active].year);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting)
                        setActive(Number(e.target.dataset.index));
                });
            },
            {threshold: 0.5},
        );
        section
            .querySelectorAll(".scroll-trigger")
            .forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-white">
            <div className="sticky top-0 h-screen flex flex-col justify-center px-8 md:px-20 z-10 bg-white">
                <div className="max-w-2xl mx-auto w-full flex gap-16 items-start">
                    {/* left column — vertical timeline */}
                    <div
                        className="relative flex flex-col"
                        style={{minWidth: 280}}>
                        {/* background line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 -translate-x-1/2" />

                        {/* animated fill line */}
                        <motion.div
                            className="absolute left-1/2 top-0 w-px bg-[var(--accent)] -translate-x-1/2 origin-top"
                            animate={{
                                height: `${(activeYearIdx / (YEARS.length - 1)) * 100}%`,
                            }}
                            transition={{duration: 0.6, ease: [0.4, 0, 0.2, 1]}}
                        />

                        {YEARS.map((yr, i) => {
                            const item = ITEMS.find((it) => it.year === yr);
                            const scrollIdx = SCROLL_ITEMS.findIndex(
                                (s) => s.year === yr,
                            );
                            const isScrollable = scrollIdx !== -1;
                            const isActive = SCROLL_ITEMS[active].year === yr;
                            const isLeft = item && LEFT_YEARS.includes(yr);
                            const isRight = item && RIGHT_YEARS.includes(yr);

                            return (
                                <div
                                    key={yr}
                                    ref={(el) => (rowRefs.current[i] = el)}
                                    className="grid items-center py-3"
                                    style={{
                                        gridTemplateColumns: "120px auto 120px",
                                    }}>
                                    {/* left card or empty */}
                                    <div className="flex justify-end pr-4">
                                        {isLeft && (
                                            <DecoCard item={item} side="left" />
                                        )}
                                    </div>

                                    {/* dot / badge + year */}
                                    <div className="flex flex-col items-center gap-1 z-10">
                                        {item ? (
                                            <button
                                                onClick={() =>
                                                    isScrollable &&
                                                    setActive(scrollIdx)
                                                }
                                                disabled={!isScrollable}
                                                className={`w-[32px] h-[32px] rounded-full border flex items-center justify-center font-mono text-[10px] transition-all duration-300 bg-white
                          ${isScrollable ? "cursor-pointer" : "cursor-default"}
                          ${
                              isActive
                                  ? "border-[var(--accent)] bg-[var(--accent)] text-white scale-110"
                                  : `border-gray-200 text-gray-400 ${isScrollable ? "hover:border-[var(--accent)]/50 hover:text-[var(--accent)]" : ""}`
                          }`}>
                                                {item.num}
                                            </button>
                                        ) : (
                                            <div className="w-[5px] h-[5px] rounded-full bg-gray-200" />
                                        )}
                                        <span
                                            className={`font-mono text-[9px] tracking-wide transition-colors duration-300
                      ${isActive ? "text-[var(--accent)]" : item ? "text-gray-400" : "text-gray-200"}`}>
                                            {yr}
                                        </span>
                                    </div>

                                    {/* right card or empty */}
                                    <div className="flex justify-start pl-4">
                                        {isRight && (
                                            <DecoCard
                                                item={item}
                                                side="right"
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* right column — info panel */}
                    <div className="flex-1 min-h-[300px] relative pt-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -8}}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.4, 0, 0.2, 1],
                                }}>
                                <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--accent)] mb-2">
                                    {SCROLL_ITEMS[active].num}
                                </p>
                                <h3 className="font-heading text-4xl text-gray-900 leading-tight tracking-tight mb-1">
                                    {SCROLL_ITEMS[active].title}
                                </h3>
                                <p className="font-mono text-[10px] text-gray-300 tracking-widest mb-6">
                                    {SCROLL_ITEMS[active].year}
                                </p>

                                <div className="w-6 h-px bg-[var(--accent)] mb-6" />

                                <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                                    {SCROLL_ITEMS[active].desc}
                                </p>

                                <div className="flex flex-col gap-2">
                                    <MetaRow
                                        label="Stack"
                                        value={SCROLL_ITEMS[active].stack}
                                    />
                                    <MetaRow
                                        label="Role"
                                        value={SCROLL_ITEMS[active].role}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* scroll triggers */}
            <div>
                {SCROLL_ITEMS.map((_, i) => (
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
