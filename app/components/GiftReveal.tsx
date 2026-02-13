"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function GiftReveal({ children, onFinish }: { children: React.ReactNode; onFinish?: () => void }) {
    const [isOpened, setIsOpened] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const leftCurtainRef = useRef<HTMLDivElement>(null);
    const rightCurtainRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleOpen = () => {
        if (isOpened) return;

        // Animation timeline
        const tl = gsap.timeline({
            onComplete: () => {
                setIsOpened(true);
                if (onFinish) onFinish();
            },
        });

        // Animate button away
        tl.to(buttonRef.current, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: "back.in(1.7)",
        });

        // Open curtains
        tl.to(leftCurtainRef.current, {
            xPercent: -100,
            duration: 1.0,
            ease: "power2.inOut",
        }, "open");

        tl.to(rightCurtainRef.current, {
            xPercent: 100,
            duration: 1.0,
            ease: "power2.inOut",
        }, "open");

        // Fade out container background (optional overlay removal)
        tl.to(containerRef.current, {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.4,
            delay: 0.3
        }, "open+=0.4");

        // Animate content in
        tl.fromTo(contentRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
            "-=0.6"
        );

        // CLEAR transform so fixed children work relative to viewport
        tl.set(contentRef.current, { clearProps: "transform" });
    };

    return (
        <>
            {/* Gift Overlay */}
            <div
                ref={containerRef}
                className="fixed inset-0 z-[100] flex pointer-events-auto"
                style={{ display: isOpened ? 'none' : 'flex' }}
            >
                <div
                    ref={leftCurtainRef}
                    className="w-1/2 h-full bg-[#FF1744] relative border-r-4 border-r-[#FF80AB] flex items-center justify-end"
                    style={{ willChange: "transform" }}
                >
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                </div>
                <div
                    ref={rightCurtainRef}
                    className="w-1/2 h-full bg-[#FF1744] relative border-l-4 border-l-[#FF80AB] flex items-center justify-start"
                    style={{ willChange: "transform" }}
                >
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                </div>

                {/* Central Button */}
                <button
                    ref={buttonRef}
                    onClick={handleOpen}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] flex flex-col items-center justify-center gap-4 group"
                >
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-black/20 transform transition-transform group-hover:scale-110 duration-300">
                        <div className="text-4xl md:text-5xl animate-bounce">🎁</div>
                    </div>
                    <span className="text-white font-script text-3xl md:text-5xl drop-shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                        Click to Open
                    </span>
                </button>
            </div>

            {/* Main Content */}
            <div ref={contentRef} className="min-h-screen">
                {children}
            </div>
        </>
    );
}
