"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
    const progressRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!fillRef.current) return;

        gsap.to(fillRef.current, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
            },
        });

        // Pulse the heart icon
        gsap.to(".scroll-heart-icon", {
            scale: 1.2,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }, []);

    return (
        <div
            ref={progressRef}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2"
        >
            {/* Track */}
            <div className="w-2 h-40 bg-[#FFE5EC] rounded-full overflow-hidden relative shadow-inner">
                <div
                    ref={fillRef}
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#FF1744] to-[#FF4081] rounded-full"
                    style={{ height: "0%" }}
                />
            </div>
            {/* Heart indicator */}
            <div className="scroll-heart-icon text-[#FF1744] text-lg mt-1">♥</div>
        </div>
    );
}
