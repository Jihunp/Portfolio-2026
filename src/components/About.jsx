import ScrollReveal from "./ScrollReveal";

const stats = [
    {value: "5+", label: "Years Experience"},
    {value: "40+", label: "Projects Delivered"},
    {value: "20+", label: "Happy Clients"},
    {value: "3", label: "Awards Won"},
];

export default function About() {
    return (
        <section id="about" className="py-40 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Eyebrow */}
                <ScrollReveal>
                    <p className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-neutral-400 mb-6">
                        About
                    </p>
                </ScrollReveal>

                {/* Headline */}
                <ScrollReveal>
                    <h2
                        className="font-serif font-normal leading-[1.05] tracking-tight text-neutral-900 mb-24"
                        style={{fontSize: "clamp(3rem, 7vw, 6.5rem)"}}>
                        Designing with
                        <br />
                        intention,
                        <br />
                        <em className="text-neutral-400">
                            building with care.
                        </em>
                    </h2>
                </ScrollReveal>

                {/* Divider */}
                <div className="w-full h-px bg-neutral-200 mb-24" />

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                    {stats.map((stat, i) => (
                        <ScrollReveal key={i} delay={i * 0.1}>
                            <div className="border-l border-neutral-200 px-10 py-8 first:border-l-0 md:first:border-l">
                                <p
                                    className="font-serif font-normal text-neutral-900 leading-none mb-3"
                                    style={{
                                        fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
                                    }}>
                                    {stat.value}
                                </p>
                                <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-neutral-400">
                                    {stat.label}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-neutral-200 mt-24 mb-24" />

                {/* Bottom tagline */}
                <ScrollReveal>
                    <p
                        className="font-mono text-neutral-500 leading-relaxed max-w-xl"
                        style={{
                            fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                            letterSpacing: "0.05em",
                        }}>
                        Based wherever the work is good.
                        <br />
                        Available for freelance &amp; collaborations.
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
}
