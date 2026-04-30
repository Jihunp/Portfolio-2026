"use client";
import {useState, useEffect, useRef} from "react";

const navLinks = [
    {label: "Home", href: "#home"},
    {label: "Projects", href: "#projects"},
    {label: "Blog", href: "#blog"},
    {label: "Contact", href: "#contact"},
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const [active, setActive] = useState("Home");
    const [mobileOpen, setMobileOpen] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 40);

            if (currentY <= 0) {
                setVisible(true);
            } else if (currentY > lastScrollY.current) {
                setVisible(false);
            } else {
                setVisible(true);
            }

            lastScrollY.current = currentY;
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <div
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 py-4"
                style={{
                    transform: visible ? "translateY(0)" : "translateY(-110%)",
                    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                <div
                    className={`flex items-center justify-between w-full max-w-5xl px-7 py-3 rounded-2xl border transition-all duration-500 ease-out ${
                        scrolled ? "shadow-lg shadow-black/20" : ""
                    }`}
                    style={{
                        background: scrolled
                            ? "rgba(2, 46, 51, 0.75)"
                            : "rgba(2, 30, 33, 0.45)",
                        borderColor: scrolled
                            ? "rgba(4, 140, 148, 0.35)"
                            : "rgba(4, 140, 148, 0.18)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        boxShadow: scrolled
                            ? "0 4px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(4,140,148,0.15)"
                            : "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}>
                    {/* Logo */}
                    <a
                        href="#home"
                        onClick={() => setActive("Home")}
                        className="text-xl font-semibold tracking-tight cursor-pointer transition-all duration-300"
                        style={{
                            color: "rgba(255,255,255,0.92)",
                            fontFamily: "var(--font-heading)",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color =
                                "rgba(4,140,148,0.9)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                                "rgba(255,255,255,0.92)")
                        }>
                        Edward Ji hun Park
                    </a>

                    {/* Desktop Links */}
                    <ul className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActive(link.label);
                                    }}
                                    className="relative px-4 py-2 text-sm rounded-lg transition-all duration-300 cursor-pointer"
                                    style={{
                                        color:
                                            active === link.label
                                                ? "rgba(255,255,255,0.95)"
                                                : "rgba(255,255,255,0.45)",
                                        fontWeight:
                                            active === link.label ? 500 : 400,
                                        background:
                                            active === link.label
                                                ? "rgba(4,140,148,0.15)"
                                                : "transparent",
                                        borderRadius: "8px",
                                    }}>
                                    {link.label}
                                    {active === link.label && (
                                        <span
                                            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                                            style={{
                                                background:
                                                    "rgba(250,140,77,0.9)",
                                            }}
                                        />
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop CTA */}
                    <button
                        className="hidden md:block px-5 py-2 text-sm font-medium rounded-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                        style={{
                            color: "#ffffff",
                            background: "rgba(235, 89, 56, 0.85)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "1px solid rgba(250,140,77,0.4)",
                            boxShadow:
                                "0 4px 16px rgba(235,89,56,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                "rgba(250,140,77,0.9)";
                            e.currentTarget.style.boxShadow =
                                "0 6px 20px rgba(250,140,77,0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                "rgba(235,89,56,0.85)";
                            e.currentTarget.style.boxShadow =
                                "0 4px 16px rgba(235,89,56,0.3), inset 0 1px 0 rgba(255,255,255,0.15)";
                        }}>
                        Let's Talk
                    </button>

                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex md:hidden flex-col gap-1.5 p-1 cursor-pointer"
                        aria-label="Toggle menu">
                        <span
                            className={`block w-5 h-0.5 rounded transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
                            style={{background: "rgba(255,255,255,0.8)"}}
                        />
                        <span
                            className={`block w-5 h-0.5 rounded transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
                            style={{background: "rgba(255,255,255,0.8)"}}
                        />
                        <span
                            className={`block w-5 h-0.5 rounded transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
                            style={{background: "rgba(255,255,255,0.8)"}}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div
                    className="fixed top-20 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-5xl z-40 flex flex-col gap-1 p-4 border rounded-2xl md:hidden"
                    style={{
                        background: "rgba(2, 40, 45, 0.92)",
                        borderColor: "rgba(4,140,148,0.25)",
                        backdropFilter: "blur(24px) saturate(180%)",
                        WebkitBackdropFilter: "blur(24px) saturate(180%)",
                        boxShadow:
                            "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(4,140,148,0.12)",
                    }}>
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={(e) => {
                                e.preventDefault();
                                setActive(link.label);
                                setMobileOpen(false);
                            }}
                            className="block px-4 py-3 text-base rounded-lg transition-all duration-300 cursor-pointer"
                            style={{
                                color:
                                    active === link.label
                                        ? "rgba(255,255,255,0.95)"
                                        : "rgba(255,255,255,0.45)",
                                fontWeight: active === link.label ? 500 : 400,
                                background:
                                    active === link.label
                                        ? "rgba(4,140,148,0.15)"
                                        : "transparent",
                                borderLeft:
                                    active === link.label
                                        ? "2px solid rgba(250,140,77,0.8)"
                                        : "2px solid transparent",
                            }}>
                            {link.label}
                        </a>
                    ))}
                    <button
                        className="mt-2 w-full py-3 text-sm font-medium rounded-lg text-center cursor-pointer transition-all duration-300"
                        style={{
                            color: "#ffffff",
                            background: "rgba(235,89,56,0.85)",
                            border: "1px solid rgba(250,140,77,0.4)",
                            boxShadow:
                                "0 4px 16px rgba(235,89,56,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                                "rgba(250,140,77,0.9)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                "rgba(235,89,56,0.85)")
                        }
                        onClick={() => setMobileOpen(false)}>
                        Let's Talk
                    </button>
                </div>
            )}
        </>
    );
}
