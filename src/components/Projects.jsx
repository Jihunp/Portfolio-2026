"use client";
import {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

// Mac-chrome window wrapper — reused for every "photo" in the collage.
// Passing textColor lets it auto-pick light vs dark chrome to match the slide theme.
function MacWindow({children, style, textColor}) {
    const isDark = textColor === "#f5f5f5";
    const chromeBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    const borderColor = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.14)";
    return (
        <div
            style={{
                borderRadius: 10,
                overflow: "hidden",
                border: `1px solid ${borderColor}`,
                boxShadow: "0 20px 60px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.2)",
                ...style,
            }}>
            {/* Traffic light dots */}
            <div
                style={{
                    background: chromeBg,
                    padding: "0.55rem 0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    borderBottom: `1px solid ${borderColor}`,
                }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <div key={c} style={{width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.85}} />
                ))}
            </div>
            {children}
        </div>
    );
}

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

        const scrubValues = {mobile: 0.6, tablet: 0.75, desktop: 0.9, large: 1.0};
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
                    end: () => `+=${wrapperRef.current.offsetWidth * (totalSections - 1)}`,
                    invalidateOnRefresh: true,
                },
            });

            scrollTriggerRef.current = tween.scrollTrigger;

            const colors = ["#0a0a0a", "#009999", "#ff6633", "#BFD62E"];
            sections.forEach((section, i) => {
                ScrollTrigger.create({
                    trigger: section,
                    containerAnimation: tween,
                    start: "left center",
                    onEnter: () => {
                        gsap.to(wrapperRef.current, {backgroundColor: colors[i], duration: 0.5});
                        setActiveIndex(i);
                    },
                    onLeaveBack: () => {
                        if (i > 0) {
                            gsap.to(wrapperRef.current, {backgroundColor: colors[i - 1], duration: 0.5});
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
            label: "Full Stack · Basil Tech",
            heading: "Book\nof Marks",
            sub: "Collaborative annotation tool built end-to-end. Users highlight text, create personal notes, and view individual annotations in real time.",
            tech: ["React", "TypeScript", "Firebase", "MUI", "Styled Components"],
            live: "https://book-of-e994d.web.app/",
            github: "https://github.com/Jihunp",
            media: {type: "image", src: "/projects/book-of-marks.png", alt: "Book of Marks screenshot"},
            codePreview: `const Annotation = ({ text, note }) => {
  const [open, setOpen] = useState(false);

  return (
    <mark onClick={() => setOpen(!open)}>
      {text}
      {open && <Tooltip note={note} />}
    </mark>
  );
};`,
        },
        {
            index: "02",
            label: "AI · In Development",
            heading: "Jarvus\nAI",
            sub: "Personal AI-powered productivity assistant. Integrating OpenAI API with a full-stack architecture — actively shipping toward a 2025 release.",
            tech: ["React", "Node.js", "OpenAI API", "TypeScript"],
            live: null,
            github: "https://github.com/Jihunp",
            media: null,
            codePreview: `const stream = await openai.chat.completions.create({
  model: "gpt-4o",
  stream: true,
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user",   content: userMessage  },
  ],
});`,
        },
        {
            index: "03",
            label: "Frontend · Game",
            heading: "Tetris\nClone",
            sub: "Fully playable Tetris built purely in React. Leverages advanced state management and component architecture for smooth, frame-perfect gameplay.",
            tech: ["React", "JavaScript", "CSS"],
            live: "https://tetris-kappa-blush.vercel.app/",
            github: "https://github.com/Jihunp",
            media: {type: "video", src: "/projects/tetris-demo.mp4", alt: "Tetris gameplay demo"},
            codePreview: `const rotate = (piece) =>
  piece[0].map((_, i) =>
    piece.map((row) => row[i]).reverse()
  );

const SHAPES = {
  I: [[1, 1, 1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  O: [[1, 1], [1, 1]],
};`,
        },
        {
            index: "04",
            label: "Frontend · Word Game",
            heading: "Wordle\nClone",
            sub: "Pixel-perfect Wordle clone using React hooks for game logic, state, and keyboard interactions — no external game libraries.",
            tech: ["React", "JavaScript", "React Hooks"],
            live: "https://wordle-one-coral.vercel.app/",
            github: "https://github.com/Jihunp",
            media: {type: "image", src: "/projects/wordle.png", alt: "Wordle clone screenshot"},
            codePreview: `const checkGuess = (guess, target) =>
  guess.split("").map((letter, i) => ({
    letter,
    state:
      letter === target[i] ? "correct"
      : target.includes(letter) ? "present"
      : "absent",
  }));`,
        },
    ];

    // const textColors = ["#f5f5f5", "#f5f5f5", "#0a0a0a", "#0a0a0a"];
    const textColors = ["#ffffff", "#ffffff", "#121212", "#1a1a1a"];
    const accentColors = ["#fff", "#ffffff", "#0a0a0a", "#0a0a0a"];

    const handleDotClick = (i) => {
        const st = scrollTriggerRef.current;
        if (!st) return;
        const progress = i / (sections.length - 1);
        const targetY = st.start + (st.end - st.start) * progress;
        window.scrollTo({top: targetY, behavior: "smooth"});
    };

    return (
        <div className="w-full overflow-hidden" style={{fontFamily: "'Inter', sans-serif"}}>
            {/* Intro spacer */}
            <div
                ref={introRef}
                className="h-screen flex flex-col items-center justify-center gap-4"
                style={{background: "#0a0a0a", color: "#f5f5f5"}}>
                <p style={{fontSize: "clamp(0.7rem, 1.2vw, 1rem)", letterSpacing: "0.3em", opacity: 0.4, textTransform: "uppercase"}}>
                    Scroll to explore
                </p>
                <h2 style={{fontSize: "clamp(2rem, 5vw, 5rem)", fontWeight: 800, letterSpacing: "-0.03em"}}>
                    Selected Work
                </h2>
                <div style={{width: 1, height: 64, background: "#f5f5f5", opacity: 0.2, marginTop: 16}} />
            </div>

            {/* Horizontal scroll container */}
            <div ref={wrapperRef} className="flex" style={{background: "#0a0a0a"}}>
                {/* Side navigation dots */}
                <div
                    style={{
                        position: "absolute",
                        right: "clamp(1.25rem, 3vw, 2.5rem)",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 20,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.75rem",
                    }}>
                    {sections.map((s, i) => (
                        <div
                            key={i}
                            onClick={() => handleDotClick(i)}
                            style={{width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}}>
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
                        id="projects"
                        key={i}
                        ref={(el) => (sectionsRef.current[i] = el)}
                        className="w-screen h-screen flex-shrink-0 relative flex flex-col items-center"
                        style={{
                            padding: "clamp(2rem, 6vw, 6rem)",
                            paddingTop: "clamp(3.5rem, 9vh, 5.5rem)",
                        }}>

                        {/* Faint giant index number in background */}
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
                                opacity: s.media ? 0.1 : 0.2,
                                zIndex: 0,
                            }}>
                            {s.index}
                        </span>

                        {/* ── COLLAGE WINDOWS ───────────────────────────────────────
                             Three Mac-style windows scattered across the lower half.
                             Different rotations + z-indices create the depth/collage feel.
                             The slight asymmetry in angles (-5°, +3°, +6°) reads as
                             more organic than round numbers would.
                        ─────────────────────────────────────────────────────────── */}

                        {/* Window 1 — main screenshot (right side, gentle clockwise tilt) */}
                        {s.media && (
                            <MacWindow
                                textColor={textColors[i]}
                                style={{
                                    position: "absolute",
                                    width: "clamp(220px, 32vw, 480px)",
                                    right: "16%",
                                    top: "56%",
                                    transform: "rotate(3deg)",
                                    zIndex: 2,
                                }}>
                                {s.media.type === "video" ? (
                                    <video
                                        muted
                                        loop
                                        playsInline
                                        preload="none"
                                        src={activeIndex === i ? s.media.src : undefined}
                                        onMouseEnter={(e) => e.currentTarget.play()}
                                        onMouseLeave={(e) => e.currentTarget.pause()}
                                        style={{width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover", cursor: "pointer"}}
                                    />
                                ) : (
                                    <img
                                        src={s.media.src}
                                        alt={s.media.alt}
                                        style={{width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover"}}
                                    />
                                )}
                            </MacWindow>
                        )}

                        {/* Window 2 — code snippet editor (bottom-left, counter-clockwise tilt) */}
                        <MacWindow
                            textColor={textColors[i]}
                            style={{
                                position: "absolute",
                                width: "clamp(200px, 26vw, 380px)",
                                left: "15%",
                                bottom: "10%",
                                transform: "rotate(-5deg)",
                                zIndex: 3,
                                opacity: 0.88,
                            }}>
                            <pre
                                style={{
                                    margin: 0,
                                    padding: "1rem 1.1rem",
                                    background: "#0d1117",
                                    color: "#c9d1d9",
                                    fontSize: "clamp(0.55rem, 0.75vw, 0.72rem)",
                                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                                    lineHeight: 1.65,
                                    overflowX: "hidden",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                }}>
                                <code>{s.codePreview}</code>
                            </pre>
                        </MacWindow>

                        {/* Window 3 — small terminal (bottom-right, steeper tilt, behind everything) */}
                        <MacWindow
                            textColor={textColors[i]}
                            style={{
                                position: "absolute",
                                width: "clamp(150px, 18vw, 260px)",
                                right: "9%",
                                bottom: "4%",
                                transform: "rotate(6deg)",
                                zIndex: 1,
                                opacity: 0.6,
                            }}>
                            <div
                                style={{
                                    padding: "0.75rem 1rem",
                                    background: "#1a1a1a",
                                    color: "#c9d1d9",
                                    fontSize: "clamp(0.5rem, 0.68vw, 0.65rem)",
                                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                                    lineHeight: 1.8,
                                }}>
                                <div>
                                    <span style={{color: "#28c840"}}>➜</span>
                                    <span style={{color: "#6e7681"}}> ~/projects </span>
                                    <span>npm run dev</span>
                                </div>
                                <div style={{color: "#6e7681", marginTop: "0.2rem"}}>
                                    &gt; {s.heading.replace("\n", " ").toLowerCase()}
                                </div>
                                <div style={{marginTop: "0.2rem"}}>
                                    <span style={{color: "#28c840"}}>✓</span> compiled successfully
                                </div>
                                <div style={{color: "#6e7681"}}>
                                    ready on localhost:3000
                                </div>
                            </div>
                        </MacWindow>

                        {/* ── TEXT CONTENT ──────────────────────────────────────────
                             Sits above the collage (zIndex: 10), centered horizontally,
                             anchored to the top of the slide.
                        ─────────────────────────────────────────────────────────── */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 10,
                                textAlign: "center",
                                maxWidth: "clamp(280px, 55vw, 700px)",
                            }}>
                            {/* Small label above heading */}
                            <span
                                style={{
                                    display: "block",
                                    fontSize: "clamp(0.62rem, 0.95vw, 0.8rem)",
                                    letterSpacing: "0.28em",
                                    textTransform: "uppercase",
                                    color: textColors[i],
                                    opacity: 0.45,
                                    marginBottom: "clamp(0.75rem, 1.5vh, 1.25rem)",
                                }}>
                                {s.label}
                            </span>

                            {/* Main heading — the visual centerpiece */}
                            <h1
                                style={{
                                    fontSize: "clamp(2.4rem, 7vw, 8rem)",
                                    fontWeight: 800,
                                    lineHeight: 1.0,
                                    letterSpacing: "-0.04em",
                                    color: textColors[i],
                                    whiteSpace: "pre-line",
                                    marginBottom: "clamp(1rem, 2.5vh, 1.75rem)",
                                }}>
                                {s.heading}
                            </h1>

                            {/* Description */}
                            <p
                                style={{
                                    fontSize: "clamp(0.85rem, 1.3vw, 1.1rem)",
                                    color: textColors[i],
                                    opacity: 0.5,
                                    letterSpacing: "0.01em",
                                    lineHeight: 1.65,
                                    maxWidth: "38ch",
                                    margin: "0 auto",
                                    marginBottom: "clamp(1rem, 2vh, 1.5rem)",
                                }}>
                                {s.sub}
                            </p>

                            {/* Tech stack pills */}
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "0.5rem",
                                    marginBottom: "clamp(1rem, 2vh, 1.5rem)",
                                    justifyContent: "center",
                                }}>
                                {s.tech.map((tag) => (
                                    <span
                                        key={tag}
                                        style={{
                                            fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)",
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase",
                                            padding: "0.35rem 0.85rem",
                                            borderRadius: "999px",
                                            border: `1px solid ${textColors[i]}40`,
                                            color: textColors[i],
                                            opacity: 0.75,
                                            fontFamily: "var(--font-mono, monospace)",
                                        }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Project links */}
                            <div style={{display: "flex", gap: "0.75rem", justifyContent: "center"}}>
                                {s.live ? (
                                    <button
                                        href={s.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)",
                                            letterSpacing: "0.2em",
                                            textTransform: "uppercase",
                                            padding: "0.6rem 1.5rem",
                                            borderRadius: "4px",
                                            border: `1px solid ${textColors[i]}80`,
                                            background: `${textColors[i]}18`,
                                            color: textColors[i],
                                            textDecoration: "none",
                                            fontFamily: "var(--font-mono, monospace)",
                                            transition: "opacity 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                                        Live Demo ↗
                                    </button>
                                ) : (
                                    <span
                                        style={{
                                            fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)",
                                            letterSpacing: "0.2em",
                                            textTransform: "uppercase",
                                            padding: "0.6rem 1.5rem",
                                            borderRadius: "4px",
                                            border: `1px solid ${textColors[i]}30`,
                                            color: textColors[i],
                                            opacity: 0.4,
                                            fontFamily: "var(--font-mono, monospace)",
                                        }}>
                                        In Progress
                                    </span>
                                )}
                                <a
                                    href={s.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)",
                                        letterSpacing: "0.2em",
                                        textTransform: "uppercase",
                                        padding: "0.6rem 1.5rem",
                                        borderRadius: "4px",
                                        border: `1px solid ${textColors[i]}30`,
                                        color: textColors[i],
                                        opacity: 0.5,
                                        textDecoration: "none",
                                        fontFamily: "var(--font-mono, monospace)",
                                        transition: "opacity 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}>
                                    GitHub ↗
                                </a>
                            </div>
                        </div>

                        {/* Bottom-right slide counter */}
                        <span
                            className="absolute"
                            style={{
                                bottom: "clamp(1.5rem, 4vw, 3.5rem)",
                                right: "clamp(2rem, 6vw, 6rem)",
                                fontSize: "clamp(0.65rem, 1vw, 0.85rem)",
                                letterSpacing: "0.2em",
                                color: textColors[i],
                                opacity: 0.35,
                                zIndex: 5,
                            }}>
                            {s.index} / 04
                        </span>
                    </section>
                ))}
            </div>

            {/* Outro spacer */}
            <div
                className="h-screen flex flex-col items-center justify-center gap-4"
                style={{background: "#0a0a0a", color: "#f5f5f5"}}>
                <p style={{fontSize: "clamp(0.7rem, 1.2vw, 1rem)", letterSpacing: "0.3em", opacity: 0.4, textTransform: "uppercase"}}>
                    Let's build something
                </p>
                <h2 style={{fontSize: "clamp(2rem, 5vw, 5rem)", fontWeight: 800, letterSpacing: "-0.03em"}}>
                    Get in touch
                </h2>
            </div>
        </div>
    );
}
