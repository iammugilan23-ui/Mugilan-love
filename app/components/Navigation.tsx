"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaHeart, FaBars, FaTimes } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#memories", label: "Memories" },
    { href: "#love-letter", label: "Love Letter" },
    { href: "#surprise", label: "Surprise" },
];

export default function Navigation() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("#home");
    const [mounted, setMounted] = useState(false);
    const heartRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = (id: string) => {
        return activeSection === id ? "text-[#FF1744]" : "text-[#7D5A5E] hover:text-[#FF1744]";
    };

    const scrollTo = (id: string) => {
        const el = document.querySelector(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setActiveSection(id);
        }
        setMobileOpen(false);
    };

    // Track active section on scroll
    useEffect(() => {
        const sections = ["#home", "#memories", "#love-letter", "#surprise"];
        const observers: IntersectionObserver[] = [];

        sections.forEach((id) => {
            const el = document.querySelector(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(id);
                        }
                    });
                },
                { threshold: 0.3 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((obs) => obs.disconnect());
    }, []);

    // Heartbeat pulse
    useEffect(() => {
        if (!heartRef.current) return;
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
        tl.to(heartRef.current, { scale: 1.3, duration: 0.15, ease: "power2.out" })
            .to(heartRef.current, { scale: 1, duration: 0.15, ease: "power2.in" })
            .to(heartRef.current, { scale: 1.2, duration: 0.12, ease: "power2.out" })
            .to(heartRef.current, { scale: 1, duration: 0.2, ease: "power2.in" });
        return () => { tl.kill(); };
    }, []);

    // Mobile menu animation
    useEffect(() => {
        if (!mobileMenuRef.current || !overlayRef.current) return;

        if (mobileOpen) {
            gsap.to(overlayRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
            gsap.fromTo(mobileMenuRef.current,
                { x: "100%" },
                { x: "0%", duration: 0.5, ease: "power3.out" }
            );
            const items = mobileMenuRef.current.querySelectorAll(".mobile-link");
            gsap.fromTo(items,
                { x: 40, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.2, ease: "power2.out" }
            );
        } else {
            gsap.to(overlayRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3 });
            gsap.to(mobileMenuRef.current, { x: "100%", duration: 0.4, ease: "power3.in" });
        }
    }, [mobileOpen]);

    return (
        <>
            <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 h-20 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <button onClick={() => scrollTo("#home")} className="flex items-center gap-2 group">
                        <div ref={heartRef} className="will-change-transform">
                            <FaHeart className="w-8 h-8 text-[#FF1744]" />
                        </div>
                        <span className="text-xl font-semibold text-[#2D1B1F] font-sans">Our Love Story</span>
                    </button>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex gap-8 font-medium">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => scrollTo(link.href)}
                                className={`${isActive(link.href)} transition-colors uppercase text-sm tracking-wide relative group`}
                            >
                                {link.label}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#FF1744] transition-all duration-300 ${activeSection === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
                            </button>
                        ))}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden text-[#2D1B1F] text-2xl p-2"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <FaBars />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Portal */}
            {mounted && createPortal(
                <>
                    {/* Mobile Overlay */}
                    <div
                        ref={overlayRef}
                        className="fixed inset-0 bg-black/40 z-[90] opacity-0 pointer-events-none md:hidden backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                        style={{ touchAction: "none" }}
                    />

                    {/* Mobile Slide-in Menu */}
                    <div
                        ref={mobileMenuRef}
                        className="fixed top-0 right-0 h-[100dvh] w-[280px] max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl z-[100] md:hidden flex flex-col border-l border-white/20"
                        style={{ transform: "translateX(100%)" }}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-pink-100">
                            <div className="flex items-center gap-2">
                                <FaHeart className="w-5 h-5 text-[#FF1744]" />
                                <span className="font-semibold text-[#2D1B1F] text-lg">Menu</span>
                            </div>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="text-[#7D5A5E] hover:text-[#FF1744] text-xl p-2 rounded-full hover:bg-pink-50 transition-colors"
                                aria-label="Close menu"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex flex-col gap-1 p-4 overflow-y-auto">
                            {navLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => scrollTo(link.href)}
                                    className={`text-left px-4 py-3.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${activeSection === link.href
                                        ? "bg-pink-50 text-[#FF1744] shadow-sm translate-x-1"
                                        : "text-[#7D5A5E] hover:bg-white hover:text-[#FF1744] hover:shadow-sm"
                                        }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSection === link.href ? "bg-[#FF1744]" : "bg-pink-200"}`} />
                                    {link.label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-auto p-6 bg-gradient-to-t from-pink-50/50 to-transparent">
                            <div className="text-center">
                                <p className="font-script text-3xl text-[#FF1744]">Forever Us</p>
                                <p className="text-xs text-[#9CA3AF] mt-1 font-medium tracking-wide uppercase">Love Story • 2024</p>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    );
}
