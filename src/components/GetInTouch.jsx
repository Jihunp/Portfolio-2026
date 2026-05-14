"use client";

/*
 * GetInTouch — closing CTA for recruiters.
 *
 * Lives at the very bottom of the page. Dark background mirrors the Hero
 * so the page feels like it opens and closes in the same visual key.
 *
 */

const links = [
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/edward-jihun-park/",
        mono: true,
    },
    {
        label: "Resume",
        href: "/resume.pdf",          // drop resume.pdf into /public
        mono: true,
        download: true,
    },
    {
        label: "GitHub",
        href: "https://github.com/Jihunp",
        mono: true,
    },
];

export default function GetInTouch() {
    return (
        <section
            id="contact-form"
            className="bg-background pr-[clamp(1.5rem,6vw,6rem)] pl-[clamp(3rem,12vw,14rem)] pt-[clamp(5rem,12vh,9rem)] pb-[clamp(3rem,6vh,5rem)]">

            {/* ── AVAILABILITY BADGE ─────────────────────────────────────── */}
            <div className="flex items-center gap-2 mb-10">
                {/* Pulsing green dot — same pattern used in Timeline's "current" role */}
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-muted">
                    Available for opportunities
                </span>
            </div>

            {/* ── HEADLINE ───────────────────────────────────────────────── */}
            <h2 className="
                text-[clamp(2.8rem,7vw,6rem)]
                font-extrabold text-foreground
                tracking-tighter leading-none
                mb-6 max-w-3xl
            ">
                Let's build
                <br />
                {/* Orange accent on the last word — same move as the Hero */}
                <span className="text-accent">something.</span>
            </h2>

            {/* ── SUB-COPY ───────────────────────────────────────────────── */}
            <p className="
                font-mono text-muted text-[clamp(0.8rem,1.3vw,0.95rem)]
                leading-relaxed max-w-md mb-14
            ">
                Seattle-area developer open to full-time and contract roles —
                remote or hybrid. Frontend-first, growing full-stack.
            </p>

            {/* ── ACTIONS ────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-4">

                {/* Primary CTA — email, orange fill */}
                <a
                    href="mailto:parkjihun97@gmail.com"
                    className="
                        group inline-flex items-center gap-2
                        bg-accent hover:bg-accent-light
                        text-white font-mono font-semibold
                        text-[0.7rem] tracking-[0.18em] uppercase
                        px-6 py-3.5 rounded
                        transition-colors duration-200
                    ">
                    Say Hello
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">↗</span>
                </a>

                {/* Secondary links — outlined, teal */}
                {links.map(({ label, href, download }) => (
                    <a
                        key={label}
                        href={href}
                        {...(download ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })}
                        className="
                            inline-flex items-center gap-1.5
                            border border-muted/30 hover:border-muted
                            text-muted font-mono
                            text-[0.7rem] tracking-[0.18em] uppercase
                            px-5 py-3.5 rounded
                            transition-colors duration-200
                        ">
                        {label}
                        {!download && <span className="text-[0.65em]">↗</span>}
                    </a>
                ))}
            </div>

            {/* ── FOOTER LINE ────────────────────────────────────────────── */}
            <div className="mt-24 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-muted/40">
                    © {new Date().getFullYear()} Edward Ji Hun Park
                </span>
                <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-muted/40">
                    Built with Next.js · Tailwind · GSAP
                </span>
            </div>
        </section>
    );
}
