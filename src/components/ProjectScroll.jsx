"use client";
import {useRef, useLayoutEffect, useState, useCallback} from "react";

const eras = [
    {
        year: "2019",
        label: "Origin",
        role: "The Spark",
        company: "Self-taught",
        type: "Learning",
        body: "Opened a code editor for the first time. Built ugly things. Broke everything. Fell completely in love with it.",
        tags: ["HTML", "CSS", "JavaScript"],
        accent: "#4af0e4",
        dim: "#0a3534",
    },
    {
        year: "2020",
        label: "First Blood",
        role: "Junior Developer",
        company: "Agency XYZ",
        type: "Employment",
        body: "Shipped real products under real deadlines. Learned that perfection is the enemy of shipped.",
        tags: ["React", "Node.js", "Git"],
        accent: "#eb5938",
        dim: "#3a1208",
    },
    {
        year: "2021",
        label: "Deep Dive",
        role: "UI Engineer",
        company: "Studio ABC",
        type: "Employment",
        body: "Obsessed over motion, WebGL, and the fine line between interface and art. Built things that moved people.",
        tags: ["Three.js", "GSAP", "WebGL"],
        accent: "#ffa040",
        dim: "#3a2200",
    },
    {
        year: "2023",
        label: "Solo",
        role: "Freelance",
        company: "Independent",
        type: "Freelance",
        body: "Went independent. Worked with founders, agencies, and creatives who cared about the details as much as I do.",
        tags: ["Next.js", "Framer", "Strategy"],
        accent: "#b06aff",
        dim: "#1e0a3a",
    },
    {
        year: "2024",
        label: "Full Stack",
        role: "Full-Stack Dev",
        company: "Remote",
        type: "Growth",
        body: "Pushed past the frontend. APIs, databases, deployment. The full picture makes me a better designer too.",
        tags: ["PostgreSQL", "tRPC", "Vercel"],
        accent: "#4af0e4",
        dim: "#0a3534",
    },
    {
        year: "NOW",
        label: "Present",
        role: "Crafting",
        company: "Available",
        type: "Open",
        body: "Building interfaces that feel inevitable. Looking for the next problem worth solving beautifully.",
        tags: ["Open to work", "Collab", "Let's talk"],
        accent: "#ffffff",
        dim: "#1a1a1a",
    },
];

const SCROLL_THRESHOLD  = 80;
const TWEEN_DURATION    = 0.9;
const BOUNDARY_PATIENCE = 2;
// Large pin distance so ScrollTrigger holds the page in place
// while our wheel handler drives navigation
const PIN_DISTANCE      = 5000;

export default function ScrollTimeline() {
    const wrapperRef    = useRef(null);
    const trackRef      = useRef(null);
    const spineRef      = useRef(null);
    const fillRef       = useRef(null);
    const gsapRef       = useRef(null);
    const stRef         = useRef(null);
    const xValuesRef    = useRef([]);
    const activeRef     = useRef(0);
    const isAnimating   = useRef(false);
    const accumulator   = useRef(0);
    const isLocked      = useRef(false);
    const touchStartY   = useRef(null);
    const boundaryCount = useRef(0);
    const boundaryHold  = useRef(null);

    const [exitHint,    setExitHint]    = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Fix mobile 100vh
    useLayoutEffect(() => {
        const setVh = () => {
            document.documentElement.style.setProperty(
                "--real-vh",
                `${window.innerHeight * 0.01}px`,
            );
        };
        setVh();
        window.addEventListener("resize", setVh);
        return () => window.removeEventListener("resize", setVh);
    }, []);

    const animateCardIn = useCallback((index) => {
        const gsap  = gsapRef.current;
        const track = trackRef.current;
        if (!gsap || !track) return;
        const cards = Array.from(track.querySelectorAll(".era-card"));
        const card  = cards[index];
        if (!card) return;

        gsap.fromTo(
            card.querySelectorAll(".card-title, .card-meta, .card-body, .card-tags"),
            {opacity: 0, y: 24},
            {opacity: 1, y: 0, stagger: 0.07, duration: 0.6, ease: "power3.out", delay: 0.25},
        );
        gsap.fromTo(
            card.querySelector(".card-dot"),
            {scale: 0},
            {scale: 1, duration: 0.5, ease: "back.out(2)", delay: 0.2},
        );
    }, []);

    const snapTo = useCallback((index, animate = true) => {
        const gsap  = gsapRef.current;
        const track = trackRef.current;
        const fill  = fillRef.current;
        if (!gsap || !track || !fill) return;
        if (index < 0 || index >= eras.length) return;
        if (isAnimating.current) return;

        isAnimating.current = true;
        activeRef.current   = index;
        accumulator.current = 0;
        setActiveIndex(index);

        gsap.to(track, {
            x: xValuesRef.current[index],
            duration: animate ? TWEEN_DURATION : 0,
            ease: "power3.inOut",
            onComplete: () => {
                isAnimating.current = false;
                accumulator.current = 0;
            },
        });

        gsap.to(fill, {
            scaleX: index / (eras.length - 1),
            duration: animate ? TWEEN_DURATION : 0,
            ease: "power3.inOut",
        });

        if (animate) animateCardIn(index);
    }, [animateCardIn]);

    // Release — move the scroll position past the pinned end so
    // ScrollTrigger unpins and the page takes over naturally
    const releaseForward = useCallback(() => {
        isLocked.current      = false;
        boundaryCount.current = 0;
        boundaryHold.current  = null;
        setExitHint(false);
        if (stRef.current) {
            // Jump scroll position just past the pin end
            const endPos = stRef.current.end;
            window.scrollTo({top: endPos + 10, behavior: "instant"});
        }
    }, []);

    const releaseBackward = useCallback(() => {
        isLocked.current      = false;
        boundaryCount.current = 0;
        boundaryHold.current  = null;
        setExitHint(false);
        if (stRef.current) {
            const startPos = stRef.current.start;
            window.scrollTo({top: startPos - 10, behavior: "instant"});
        }
    }, []);

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        const track   = trackRef.current;
        const fill    = fillRef.current;
        if (!wrapper || !track || !fill) return;

        let gsap, ScrollTrigger, cleanupEvents;

        const init = async () => {
            const g  = await import("gsap");
            const st = await import("gsap/ScrollTrigger");
            gsap = g.default || g.gsap;
            ScrollTrigger = st.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);
            gsapRef.current = gsap;

            const build = () => {
                ScrollTrigger.getAll().forEach((t) => t.kill());
                gsap.set(track, {x: 0});
                isAnimating.current   = false;
                isLocked.current      = false;
                accumulator.current   = 0;
                boundaryCount.current = 0;
                boundaryHold.current  = null;

                const cards = Array.from(track.querySelectorAll(".era-card"));
                cards.forEach((card) => {
                    gsap.set(
                        card.querySelectorAll(".card-title,.card-meta,.card-body,.card-tags,.card-dot"),
                        {clearProps: "all"},
                    );
                });

                const vw = wrapper.offsetWidth;
                xValuesRef.current = cards.map((card) => {
                    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                    return -(cardCenter - vw / 2);
                });

                gsap.set(track, {x: xValuesRef.current[0]});
                gsap.set(fill, {scaleX: 0});
                activeRef.current = 0;
                setActiveIndex(0);

                // Use a large PIN_DISTANCE so the browser can't scroll
                // past the section with momentum — our wheel handler
                // intercepts and drives navigation instead
                stRef.current = ScrollTrigger.create({
                    trigger:   wrapper,
                    pin:       true,
                    start:     "top top",
                    end:       `+=${PIN_DISTANCE}`,
                    // Prevent ScrollTrigger from moving the track —
                    // we drive x ourselves via snapTo
                    scrub:     false,
                    onEnter:      () => {
                        isLocked.current      = true;
                        boundaryHold.current  = null;
                        boundaryCount.current = 0;
                        setExitHint(false);
                    },
                    onEnterBack:  () => {
                        isLocked.current      = true;
                        boundaryHold.current  = null;
                        boundaryCount.current = 0;
                        setExitHint(false);
                        // Snap back to last card when re-entering from below
                        snapTo(eras.length - 1, false);
                    },
                    onLeave:      () => { isLocked.current = false; },
                    onLeaveBack:  () => { isLocked.current = false; },
                });

                // Animate first card in
                const firstCard = cards[0];
                if (firstCard) {
                    gsap.from(
                        firstCard.querySelectorAll(".card-title,.card-meta,.card-body,.card-tags"),
                        {opacity: 0, y: 24, stagger: 0.08, duration: 0.7, ease: "power3.out", delay: 0.2},
                    );
                    gsap.from(firstCard.querySelector(".card-dot"), {
                        scale: 0, duration: 0.5, ease: "back.out(2)", delay: 0.3,
                    });
                }
            };

            build();

            const handleBoundaryScroll = (direction) => {
                const atStart      = activeRef.current === 0;
                const atEnd        = activeRef.current === eras.length - 1;
                const isAtBoundary = (direction === "up" && atStart) || (direction === "down" && atEnd);

                if (!isAtBoundary) {
                    boundaryHold.current  = null;
                    boundaryCount.current = 0;
                    setExitHint(false);
                    return false;
                }

                if (boundaryHold.current === null) {
                    boundaryHold.current  = direction === "up" ? "start" : "end";
                    boundaryCount.current = 1;
                    setExitHint(true);
                    return true;
                }

                if (boundaryCount.current < BOUNDARY_PATIENCE) {
                    boundaryCount.current++;
                    setExitHint(true);
                    return true;
                }

                // Patience exhausted — release to page scroll
                if (direction === "down") releaseForward();
                else                      releaseBackward();
                return true;
            };

            // Wheel — attached with capture:true so it fires before
            // any child element handlers, and we call preventDefault
            // immediately to stop the browser scrolling the page
            const onWheel = (e) => {
                if (!isLocked.current) return;

                // Always preventDefault while locked to hold the pin
                e.preventDefault();
                e.stopPropagation();

                if (isAnimating.current) return;

                accumulator.current += e.deltaY;
                const direction = e.deltaY > 0 ? "down" : "up";

                if (Math.abs(accumulator.current) > SCROLL_THRESHOLD) {
                    accumulator.current = 0;
                    const handled = handleBoundaryScroll(direction);
                    if (!handled) {
                        if (direction === "down") snapTo(Math.min(activeRef.current + 1, eras.length - 1));
                        else                      snapTo(Math.max(activeRef.current - 1, 0));
                    }
                }
            };

            const onTouchStart = (e) => {
                touchStartY.current = e.touches[0].clientY;
            };

            const onTouchEnd = (e) => {
                if (!isLocked.current || touchStartY.current === null) return;
                const delta = touchStartY.current - e.changedTouches[0].clientY;
                touchStartY.current = null;
                if (Math.abs(delta) < 40) return;

                const direction = delta > 0 ? "down" : "up";
                const handled   = handleBoundaryScroll(direction);
                if (!handled) {
                    if (direction === "down") snapTo(Math.min(activeRef.current + 1, eras.length - 1));
                    else                      snapTo(Math.max(activeRef.current - 1, 0));
                }
            };

            const onKeyDown = (e) => {
                if (!isLocked.current) return;
                let direction = null;
                if (e.key === "ArrowDown" || e.key === "ArrowRight") direction = "down";
                if (e.key === "ArrowUp"   || e.key === "ArrowLeft")  direction = "up";
                if (!direction) return;

                const handled = handleBoundaryScroll(direction);
                if (!handled) {
                    if (direction === "down") snapTo(Math.min(activeRef.current + 1, eras.length - 1));
                    else                      snapTo(Math.max(activeRef.current - 1, 0));
                }
            };

            // capture:true is the critical flag — ensures our handler
            // fires at the top of the event chain before anything else
            window.addEventListener("wheel",     onWheel,      {passive: false, capture: true});
            window.addEventListener("touchstart", onTouchStart, {passive: true,  capture: true});
            window.addEventListener("touchend",   onTouchEnd,   {passive: true,  capture: true});
            window.addEventListener("keydown",    onKeyDown);

            let resizeTimer;
            const onResize = () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    build();
                    ScrollTrigger.refresh();
                }, 250);
            };
            window.addEventListener("resize", onResize);

            cleanupEvents = () => {
                window.removeEventListener("wheel",     onWheel,      {capture: true});
                window.removeEventListener("touchstart", onTouchStart, {capture: true});
                window.removeEventListener("touchend",   onTouchEnd,   {capture: true});
                window.removeEventListener("keydown",    onKeyDown);
                window.removeEventListener("resize",     onResize);
            };
        };

        init();

        return () => {
            if (ScrollTrigger) ScrollTrigger.getAll().forEach((t) => t.kill());
            if (cleanupEvents)  cleanupEvents();
        };
    }, [snapTo, releaseForward, releaseBackward]);

    const activeEra = eras[activeIndex];
    const atStart   = activeIndex === 0;
    const atEnd     = activeIndex === eras.length - 1;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&display=swap');

        :root { --real-vh: 1vh; }

        .font-dm-mono  { font-family: 'DM Mono', monospace; }
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }

        .timeline-wrapper { height: calc(var(--real-vh) * 100); }
        .track-height     { height: calc(var(--real-vh, 1vh) * 100); }

        .scanlines::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent, transparent 2px,
            rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        .year-bg {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(4rem, 14vw, 14rem);
          line-height: 1;
          font-weight: 700;
          font-style: italic;
          user-select: none;
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .year-bg { font-size: clamp(3rem, 18vw, 6rem); }
        }

        @media (min-width: 1400px) { .card-body { max-width: 38ch; } }
        @media (min-width: 1800px) { .card-body { max-width: 42ch; } }

        .card-width   { width: clamp(380px, 38vw, 620px); }
        .title-size   { font-size: clamp(2.8rem, 3.5vw, 4.5rem); }
        .meta-size    { font-size: clamp(0.6rem, 0.8vw, 0.72rem); }
        .company-size { font-size: clamp(0.7rem, 0.9vw, 0.85rem); }
        .body-size    { font-size: clamp(0.85rem, 1vw, 1rem); }
        .tag-size     { font-size: clamp(0.55rem, 0.7vw, 0.65rem); }
        .ui-size      { font-size: clamp(0.55rem, 0.7vw, 0.65rem); }

        @keyframes hint-pulse {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(3px); }
        }
        .hint-arrow-down { animation: hint-pulse 0.8s ease-in-out infinite; }

        @keyframes hint-pulse-up {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-3px); }
        }
        .hint-arrow-up { animation: hint-pulse-up 0.8s ease-in-out infinite; }
      `}</style>

            <div
                ref={wrapperRef}
                className="timeline-wrapper scanlines font-dm-mono relative w-full overflow-hidden"
                style={{background: "#060608"}}>

                {/* Ambient glow */}
                <div
                    className="absolute inset-0 pointer-events-none transition-all duration-1000"
                    style={{
                        background: `radial-gradient(ellipse 60% 70% at 30% 60%, ${activeEra.dim}cc 0%, transparent 65%)`,
                        zIndex: 0,
                    }}
                />

                {/* Journey label */}
                <div className="absolute top-10 left-[clamp(1rem,3vw,3rem)] z-20 uppercase tracking-[0.4em] text-white/30 ui-size">
                    Journey
                </div>

                {/* Counter */}
                <div
                    className="absolute top-10 right-[clamp(1rem,3vw,3rem)] z-20 uppercase tracking-[0.3em] ui-size transition-colors duration-500"
                    style={{color: activeEra.accent}}>
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(eras.length).padStart(2, "0")}
                </div>

                {/* Exit hint */}
                <div
                    className="absolute bottom-11 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 transition-opacity duration-500"
                    style={{opacity: exitHint ? 1 : 0, pointerEvents: "none"}}>
                    {atStart && (
                        <svg className="hint-arrow-up" width="16" height="10" viewBox="0 0 16 10" fill="none">
                            <path d="M1 9L8 2L15 9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    )}
                    <span className="ui-size uppercase tracking-[0.3em] text-white/40">
                        {atEnd ? "scroll to continue" : atStart ? "scroll to go back" : ""}
                    </span>
                    {atEnd && (
                        <svg className="hint-arrow-down" width="16" height="10" viewBox="0 0 16 10" fill="none">
                            <path d="M1 1L8 8L15 1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    )}
                </div>

                {/* Scroll hint */}
                <div
                    className="absolute bottom-11 right-[clamp(1rem,3vw,3rem)] z-20 flex items-center gap-2 uppercase tracking-[0.3em] ui-size transition-opacity duration-500"
                    style={{color: "rgba(255,255,255,0.2)", opacity: exitHint ? 0 : 1}}>
                    <span className="inline-block w-[18px] h-px bg-white/20" />
                    Scroll to travel
                </div>

                {/* Dot nav */}
                <div className="absolute right-[clamp(1rem,3vw,3rem)] top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
                    {eras.map((era, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (isAnimating.current) return;
                                isLocked.current      = true;
                                boundaryHold.current  = null;
                                boundaryCount.current = 0;
                                setExitHint(false);
                                snapTo(i);
                            }}
                            className="rounded-full transition-all duration-300 cursor-pointer"
                            style={{
                                width:      activeIndex === i ? 8 : 4,
                                height:     activeIndex === i ? 8 : 4,
                                background: activeIndex === i ? era.accent : "rgba(255,255,255,0.25)",
                                boxShadow:  activeIndex === i ? `0 0 8px ${era.accent}88` : "none",
                            }}
                        />
                    ))}
                </div>

                {/* Track */}
                <div
                    ref={trackRef}
                    className="track-height flex items-stretch w-max relative z-10 will-change-transform">
                    {eras.map((era, i) => (
                        <div
                            key={i}
                            className="era-card card-width flex-shrink-0 flex flex-col justify-center relative transition-opacity duration-700"
                            style={{
                                padding: "0 clamp(1.5rem, 3vw, 3rem)",
                                opacity: activeIndex === i ? 1 : 0.3,
                            }}>

                            <div
                                className="year-bg absolute top-1/2 left-1/2 whitespace-nowrap"
                                style={{
                                    transform:  "translate(-50%, -52%)",
                                    color:      era.accent,
                                    opacity:    activeIndex === i ? 0.05 : 0.015,
                                    transition: "opacity 0.8s ease, color 0.8s ease",
                                    zIndex: 0,
                                }}>
                                {era.year}
                            </div>

                            <div className="relative z-10">
                                <div className="card-meta flex items-center gap-4 mb-6">
                                    <span
                                        className="meta-size uppercase tracking-[0.35em] transition-colors duration-300"
                                        style={{color: era.accent}}>
                                        {era.year}
                                    </span>
                                    <span className="w-8 h-px opacity-40" style={{background: era.accent}} />
                                    <span className="meta-size uppercase tracking-[0.25em] text-white/30">
                                        {era.type}
                                    </span>
                                </div>

                                <h2 className="font-playfair card-title title-size font-normal leading-none text-white/95 mb-1 tracking-tight">
                                    {era.role}
                                </h2>

                                <p
                                    className="company-size uppercase tracking-[0.25em] mb-8 opacity-70 transition-colors duration-300"
                                    style={{color: era.accent}}>
                                    {era.company}
                                </p>

                                <p className="card-body body-size leading-[1.8] text-white/55 max-w-[32ch] mb-10">
                                    {era.body}
                                </p>

                                <div className="card-tags flex flex-wrap gap-2">
                                    {era.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="tag-pill tag-size uppercase tracking-[0.2em] px-3 py-1 rounded-sm transition-all duration-300"
                                            style={{
                                                border:     `1px solid ${era.accent}55`,
                                                color:      era.accent,
                                                background: `${era.accent}0d`,
                                            }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div
                                className="card-dot absolute left-1/2 rounded-full transition-all duration-500"
                                style={{
                                    bottom:     "calc(50% - 100px)",
                                    transform:  "translate(-50%, 50%)",
                                    width:      activeIndex === i ? 14 : 6,
                                    height:     activeIndex === i ? 14 : 6,
                                    background: era.accent,
                                    boxShadow:
                                        activeIndex === i
                                            ? `0 0 0 4px ${era.accent}33, 0 0 20px ${era.accent}88`
                                            : "none",
                                    zIndex: 5,
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Spine */}
                <div
                    ref={spineRef}
                    className="absolute left-0 right-0 h-px z-[8]"
                    style={{bottom: "calc(50% - 94px)", background: "rgba(255,255,255,0.08)"}}>
                    <div
                        ref={fillRef}
                        className="absolute inset-0 origin-left scale-x-0"
                        style={{background: `linear-gradient(to right, #4af0e4, #eb5938, #ffa040, #b06aff, #4af0e4, #ffffff)`}}
                    />
                </div>

                {/* Era label */}
                <div className="absolute bottom-11 left-[clamp(1rem,3vw,3rem)] z-20">
                    <p
                        className="ui-size uppercase tracking-[0.35em] transition-colors duration-500"
                        style={{color: activeEra.accent}}>
                        {activeEra.label}
                    </p>
                </div>
            </div>
        </>
    );
}