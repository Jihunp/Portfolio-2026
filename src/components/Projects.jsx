"use client";
import {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

export default function Projects() {
    const wrapperRef = useRef(null);
    const sectionsRef = useRef([]);
    const introRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollTriggerRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const getBreakpoint = () => {
            const w = window.innerWidth;
            if (w < 640) return "mobile";
            if (w < 1024) return "tablet";
            if (w < 1920) return "desktop";
            return "large";
        };

        const scrubValues = {
            mobile: 0.6,
            tablet: 0.75,
            desktop: 0.9,
            large: 1.0,
        };

        const snapDurations = {
            mobile: {min: 0.1, max: 0.35},
            tablet: {min: 0.12, max: 0.4},
            desktop: {min: 0.15, max: 0.48},
            large: {min: 0.2, max: 0.55},
        };

        const ctx = gsap.context(() => {
            const sections = sectionsRef.current;
            const totalSections = sections.length;
            const bp = getBreakpoint();
            const introElements = introRef.current.children;

            // fade in intro animation
            gsap.from(introElements, {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: introRef.current,
                    start: "top top",
                    toggleActions: "play reverse play reverse",
                },
            });

            const tween = gsap.to(sections, {
                xPercent: -100 * (totalSections - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    pin: true,
                    scrub: scrubValues[bp],
                    anticipatePin: 1,
                    snap: {
                        snapTo: 1 / (totalSections - 1),
                        duration: snapDurations[bp],
                        ease: "expo.out",
                        inertia: false,
                        directional: true,
                    },
                    end: () =>
                        `+=${wrapperRef.current.offsetWidth * (totalSections - 1)}`,
                    invalidateOnRefresh: true,
                },
            });

            // Store the ScrollTrigger instance so dot clicks can read start/end positions
            scrollTriggerRef.current = tween.scrollTrigger;

            const colors = ["#0a0a0a", "#009999", "#ff6633", "#BFD62E"];
            sections.forEach((section, i) => {
                ScrollTrigger.create({
                    trigger: section,
                    containerAnimation: tween,
                    start: "left center",
                    onEnter: () => {
                        gsap.to(wrapperRef.current, {
                            backgroundColor: colors[i],
                            duration: 0.5,
                        });
                        setActiveIndex(i);
                    },
                    onLeaveBack: () => {
                        if (i > 0) {
                            gsap.to(wrapperRef.current, {
                                backgroundColor: colors[i - 1],
                                duration: 0.5,
                            });
                            setActiveIndex(i - 1);
                        }
                    },
                });
            });
        }, wrapperRef);

        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            ctx.revert();
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimer);
        };
    }, []);

    const sections = [
        {
            index: "01",
            label: "Design",
            heading: "Craft that\nfeels alive.",
            sub: "Every pixel considered. Every interaction intentional.",
        },
        {
            index: "02",
            label: "Motion",
            heading: "Movement\nwith meaning.",
            sub: "Animation that guides, not distracts.",
        },
        {
            index: "03",
            label: "Systems",
            heading: "Scale without\nlosing soul.",
            sub: "Design systems built to flex and endure.",
        },
        {
            index: "04",
            label: "Launch",
            heading: "Ship work\nyou're proud of.",
            sub: "From concept to production, uncompromised.",
        },
    ];

    const textColors = ["#f5f5f5", "#f5f5f5", "#0a0a0a", "#0a0a0a"];
    const accentColors = ["#444", "#ffffffaa", "#0a0a0aaa", "#0a0a0aaa"];

    const handleDotClick = (i) => {
        const st = scrollTriggerRef.current;
        if (!st) return;
        // Calculate which scroll position corresponds to slide i
        // Progress goes from 0 (slide 0) to 1 (last slide)
        const progress = i / (sections.length - 1);
        const targetY = st.start + (st.end - st.start) * progress;
        window.scrollTo({top: targetY, behavior: "smooth"});
    };

    return (
        <div
            className="w-full overflow-hidden"
            style={{fontFamily: "'Inter', sans-serif"}}>
            {/* Spacer / Intro */}
            <div
                ref={introRef}
                className="h-screen flex flex-col items-center justify-center gap-4"
                style={{background: "#0a0a0a", color: "#f5f5f5"}}>
                <p
                    style={{
                        fontSize: "clamp(0.7rem, 1.2vw, 1rem)",
                        letterSpacing: "0.3em",
                        opacity: 0.4,
                        textTransform: "uppercase",
                    }}>
                    Scroll to explore
                </p>
                <h2
                    style={{
                        fontSize: "clamp(2rem, 5vw, 5rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                    }}>
                    Our Process
                </h2>
                <div
                    style={{
                        width: 1,
                        height: 64,
                        background: "#f5f5f5",
                        opacity: 0.2,
                        marginTop: 16,
                    }}
                />
            </div>

            {/* Horizontal scroll container */}
            <div
                ref={wrapperRef}
                className="flex"
                style={{background: "#0a0a0a"}}>
                {/* Side navigation dots */}
                <div
                    style={{
                        position: "absolute",
                        right: "clamp(1.25rem, 3vw, 2.5rem)",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.75rem",
                    }}>
                    {sections.map((s, i) => (
                        <div
                            key={i}
                            onClick={() => handleDotClick(i)}
                            style={{
                                width: 16,
                                height: 16,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}>
                            <div
                                style={{
                                    width: activeIndex === i ? 10 : 6,
                                    height: activeIndex === i ? 10 : 6,
                                    borderRadius: "50%",
                                    background: textColors[activeIndex],
                                    opacity: activeIndex === i ? 1 : 0.3,
                                    transition: "all 0.3s ease",
                                }}
                            />
                        </div>
                    ))}
                    <span
                        style={{
                            marginTop: "0.5rem",
                            fontSize: "0.65rem",
                            letterSpacing: "0.15em",
                            color: textColors[activeIndex],
                            opacity: 0.5,
                            transition: "color 0.3s ease",
                        }}>
                        {String(activeIndex + 1).padStart(2, "0")}&nbsp;/&nbsp;
                        {String(sections.length).padStart(2, "0")}
                    </span>
                </div>

                {sections.map((s, i) => (
                    <section
                        key={i}
                        ref={(el) => (sectionsRef.current[i] = el)}
                        className="w-screen h-screen flex-shrink-0 relative flex flex-col justify-end"
                        style={{padding: "clamp(2rem, 6vw, 6rem)"}}>
                        {/* Large background index number */}
                        <span
                            className="absolute select-none"
                            style={{
                                top: "clamp(1rem, 4vw, 3rem)",
                                right: "clamp(1.5rem, 5vw, 5rem)",
                                fontSize: "clamp(6rem, 18vw, 22rem)",
                                fontWeight: 900,
                                lineHeight: 1,
                                color: accentColors[i],
                                letterSpacing: "-0.05em",
                                userSelect: "none",
                            }}>
                            {s.index}
                        </span>

                        {/* Top-left label */}
                        <span
                            className="absolute"
                            style={{
                                top: "clamp(1.5rem, 4vw, 3.5rem)",
                                left: "clamp(2rem, 6vw, 6rem)",
                                fontSize: "clamp(0.65rem, 1vw, 0.85rem)",
                                letterSpacing: "0.25em",
                                textTransform: "uppercase",
                                color: textColors[i],
                                opacity: 0.5,
                            }}>
                            {s.label}
                        </span>

                        {/* Bottom content */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 1,
                                maxWidth: "clamp(280px, 55vw, 720px)",
                            }}>
                            <h1
                                style={{
                                    fontSize: "clamp(2.2rem, 6vw, 7.5rem)",
                                    fontWeight: 800,
                                    lineHeight: 1.05,
                                    letterSpacing: "-0.03em",
                                    color: textColors[i],
                                    whiteSpace: "pre-line",
                                    marginBottom: "clamp(1rem, 2vw, 1.75rem)",
                                }}>
                                {s.heading}
                            </h1>
                            <p
                                style={{
                                    fontSize: "clamp(0.9rem, 1.4vw, 1.2rem)",
                                    color: textColors[i],
                                    opacity: 0.55,
                                    letterSpacing: "0.01em",
                                    lineHeight: 1.6,
                                    maxWidth: "36ch",
                                }}>
                                {s.sub}
                            </p>
                        </div>

                        {/* Bottom-right section counter */}
                        <span
                            className="absolute"
                            style={{
                                bottom: "clamp(1.5rem, 4vw, 3.5rem)",
                                right: "clamp(2rem, 6vw, 6rem)",
                                fontSize: "clamp(0.65rem, 1vw, 0.85rem)",
                                letterSpacing: "0.2em",
                                color: textColors[i],
                                opacity: 0.35,
                            }}>
                            {s.index} / 04
                        </span>
                    </section>
                ))}
            </div>

            {/* Spacer / Outro */}
            <div
                className="h-screen flex flex-col items-center justify-center gap-4"
                style={{background: "#0a0a0a", color: "#f5f5f5"}}>
                <p
                    style={{
                        fontSize: "clamp(0.7rem, 1.2vw, 1rem)",
                        letterSpacing: "0.3em",
                        opacity: 0.4,
                        textTransform: "uppercase",
                    }}>
                    Let's build something
                </p>
                <h2
                    style={{
                        fontSize: "clamp(2rem, 5vw, 5rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                    }}>
                    Get in touch
                </h2>
            </div>
        </div>
    );
}
