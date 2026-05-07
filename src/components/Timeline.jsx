"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "./ScrollReveal";

const events = [
    {
        year: "2017",
        type: "Education",
        title: "BA in Sociology",
        org: "University of Washington · Seattle",
        description:
            "Started college studying people, systems, and how communities are shaped. Built the habit of asking why before how — a lens I still bring to every product I build.",
    },
    {
        year: "2019",
        type: "Work",
        title: "Computer Vet Technician",
        org: "UW IT Learning Technologies · Seattle",
        description:
            "First technical role. Supported 65,000+ UW affiliates with hardware and software issues. Where I discovered I was good at solving technical problems under pressure — and that I wanted to go deeper.",
    },
    {
        year: "2021",
        type: "Education",
        title: "Software Engineering Immersive",
        org: "General Assembly · Seattle",
        description:
            "Made the full pivot. Graduated with my Sociology degree in June and enrolled in bootcamp by November. Six months of intensive full-stack training that turned curiosity into a skill set.",
    },
    {
        year: "2022",
        type: "Work",
        title: "Software Developer",
        org: "Basil Tech · Seattle",
        description:
            "First professional engineering role. Built Book of Marks end-to-end — React, TypeScript, Firebase. Collaborated with designers via Figma, shipped real features to real users, and ran Agile sprints on a real team.",
    },
    {
        year: "2023",
        type: "Education",
        title: "Graduate Certificate, Software Design & Development",
        org: "University of Washington Bothell",
        description:
            "Went back to formalize the craft. Focused on software architecture, systems design, and engineering principles — the foundations that self-teaching skips over.",
    },
    {
        year: "2025",
        type: "Work",
        title: "Front-End Web Developer",
        org: "World Relief · Remote",
        description:
            "10+ customer-facing pages shipped across high-visibility nonprofit campaigns. Supporting $1M+ in annual donations through thoughtful, performant front-end work on a cross-functional team.",
        current: true,
    },
];

export default function Timeline() {
    const containerRef = useRef(null);
    const progressLineRef = useRef(null);
    const dotRefs = useRef([]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // The progress line grows from scaleY 0 → 1 tied directly to scroll.
            // scrub: 1 means it follows scroll with a 1-second lag (feels smooth, not snappy).
            // transformOrigin "top" makes it grow downward from the first entry.
            gsap.fromTo(
                progressLineRef.current,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: 1,
                    },
                }
            );

            // Each dot lights up as the scroll reaches it
            dotRefs.current.forEach((dot, i) => {
                if (!dot || events[i]?.current) return;
                ScrollTrigger.create({
                    trigger: dot,
                    start: "top center+=100",
                    onEnter: () =>
                        gsap.to(dot, { backgroundColor: "#171717", scale: 1.4, duration: 0.3, ease: "power2.out" }),
                    onLeaveBack: () =>
                        gsap.to(dot, { backgroundColor: "#d4d4d4", scale: 1, duration: 0.2 }),
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="journey" className="pt-40 pb-[50vh] px-6 bg-white">
            <div className="max-w-6xl mx-auto">

                {/* Eyebrow — matches About.jsx exactly */}
                <ScrollReveal>
                    <p className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-neutral-400 mb-6">
                        Journey
                    </p>
                </ScrollReveal>

                {/* Headline */}
                <ScrollReveal>
                    <h2
                        className="font-serif font-normal leading-[1.05] tracking-tight text-neutral-900 mb-24"
                        style={{fontSize: "clamp(3rem, 7vw, 6.5rem)"}}>
                        How I got
                        <br />
                        <em className="text-neutral-400">here.</em>
                    </h2>
                </ScrollReveal>

                {/* Timeline */}
                <div className="relative" ref={containerRef}>

                    {/* Base vertical rule — static grey, full height */}
                    <div className="absolute left-[7.5rem] top-0 bottom-0 w-px bg-neutral-200 hidden md:block" />

                    {/* Progress line — dark overlay that grows with scroll via GSAP scaleY */}
                    {/* transformOrigin "top" makes it grow downward, not from center */}
                    <div
                        ref={progressLineRef}
                        className="absolute hidden md:block"
                        style={{
                            left: "7.5rem",
                            top: 0,
                            width: 1,
                            height: "100%",
                            background: "#171717",
                            transformOrigin: "top",
                            transform: "scaleY(0)",
                        }}
                    />

                    <div>
                        {events.map((event, i) => (
                            <ScrollReveal key={i} delay={i * 0.07}>
                                <div className="relative flex flex-col md:flex-row md:gap-16 py-14 border-b border-neutral-100 last:border-0">

                                    {/* Left column — year, right-aligned up to the rule */}
                                    <div className="hidden md:flex w-28 flex-shrink-0 items-start justify-end pr-10 pt-1">
                                        <span className="font-mono text-[0.68rem] tracking-[0.2em] text-neutral-400">
                                            {event.year}
                                        </span>
                                    </div>

                                    {/* Dot sitting on the vertical rule */}
                                    <div
                                        className="absolute hidden md:block top-[3.6rem]"
                                        style={{left: "calc(7.5rem - 4px)"}}>
                                        {event.current ? (
                                            // Pulsing green dot for the current role — always stays green
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                            </span>
                                        ) : (
                                            // Grey dot — GSAP turns it dark when progress line reaches it
                                            <div
                                                ref={(el) => (dotRefs.current[i] = el)}
                                                className="h-2 w-2 rounded-full bg-neutral-300"
                                            />
                                        )}
                                    </div>

                                    {/* Right column — all the content */}
                                    <div className="flex-1 min-w-0">

                                        {/* Year on mobile */}
                                        <span className="font-mono text-[0.65rem] tracking-[0.2em] text-neutral-400 md:hidden block mb-3">
                                            {event.year}
                                        </span>

                                        {/* Type pill + Current badge */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 border border-neutral-200 px-2.5 py-1 rounded-sm">
                                                {event.type}
                                            </span>
                                            {event.current && (
                                                <span className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-green-500 border border-green-200 px-2.5 py-1 rounded-sm">
                                                    Current
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className="font-serif font-normal text-neutral-900 leading-tight mb-2"
                                            style={{fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)"}}>
                                            {event.title}
                                        </h3>

                                        {/* Org */}
                                        <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-neutral-400 mb-5">
                                            {event.org}
                                        </p>

                                        {/* Description */}
                                        <p
                                            className="text-neutral-500 leading-relaxed max-w-2xl"
                                            style={{fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)"}}>
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
