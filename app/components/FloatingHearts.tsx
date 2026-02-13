"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const SYMBOLS = [
    { char: "♥", size: "text-6xl" },
    { char: "✿", size: "text-4xl" },
    { char: "✧", size: "text-5xl" },
    { char: "💫", size: "text-3xl" },
    { char: "♥", size: "text-4xl" },
    { char: "✿", size: "text-5xl" },
    { char: "✧", size: "text-3xl" },
    { char: "♥", size: "text-7xl" },
    { char: "💫", size: "text-4xl" },
    { char: "✿", size: "text-6xl" },
];

const positions = [
    { top: "8%", left: "5%", layer: 1 },
    { top: "20%", right: "8%", layer: 2 },
    { bottom: "30%", left: "12%", layer: 3 },
    { top: "25%", left: "25%", layer: 1 },
    { bottom: "20%", right: "20%", layer: 2 },
    { top: "60%", right: "10%", layer: 3 },
    { bottom: "15%", left: "45%", layer: 1 },
    { top: "15%", left: "60%", layer: 2 },
    { top: "45%", left: "8%", layer: 3 },
    { bottom: "40%", right: "30%", layer: 1 },
];

export default function FloatingHearts({ enabled = true }: { enabled?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!enabled || !containerRef.current) return;

        const symbols = containerRef.current.querySelectorAll(".love-symbol");
        const cleanupFns: (() => void)[] = [];

        // Parallax layers at different speeds
        symbols.forEach((symbol, i) => {
            const layer = positions[i]?.layer || 1;
            const speedMultiplier = layer * 0.5;
            const driftRange = 20 + layer * 15;

            // Base floating animation
            gsap.to(symbol, {
                y: `random(-${driftRange},${driftRange})`,
                x: `random(-${driftRange * 0.6},${driftRange * 0.6})`,
                rotation: `random(-25,25)`,
                duration: `random(${3 + layer},${6 + layer})`,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.2,
            });

            // Opacity breathing
            gsap.to(symbol, {
                opacity: `random(0.15,0.5)`,
                duration: `random(2,5)`,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            // Scale pulse
            gsap.to(symbol, {
                scale: `random(0.8,1.2)`,
                duration: `random(3,6)`,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.3,
            });
        });

        // Mouse-reactive drift — symbols gently repel from cursor
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };

            symbols.forEach((symbol, i) => {
                const rect = (symbol as HTMLElement).getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = cx - e.clientX;
                const dy = cy - e.clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    const layer = positions[i]?.layer || 1;
                    gsap.to(symbol, {
                        x: `+=${(dx / dist) * force * 20 * layer}`,
                        y: `+=${(dy / dist) * force * 15 * layer}`,
                        duration: 0.8,
                        ease: "power2.out",
                        overwrite: "auto",
                    });
                }
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        cleanupFns.push(() => window.removeEventListener("mousemove", handleMouseMove));

        return () => {
            gsap.killTweensOf(symbols);
            cleanupFns.forEach((fn) => fn());
        };
    }, [enabled]);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
            {SYMBOLS.map((sym, i) => {
                const pos = positions[i];
                const layerOpacity = pos.layer === 1 ? "opacity-30" : pos.layer === 2 ? "opacity-20" : "opacity-15";
                return (
                    <div
                        key={i}
                        className={`love-symbol absolute ${sym.size} ${layerOpacity} text-white will-change-transform`}
                        style={{
                            top: pos.top,
                            left: pos.left,
                            right: pos.right,
                            bottom: pos.bottom,
                            filter: pos.layer === 3 ? "blur(1px)" : pos.layer === 2 ? "blur(0.5px)" : "none",
                        }}
                    >
                        {sym.char}
                    </div>
                );
            })}
        </div>
    );
}
