"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";

interface HeartRibbonProps {
    sectionId: string;
    title: string;
    children: React.ReactNode;
}

/* ── 3D Heart drawing for canvas ── */
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rotation: number, glow: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size / 30, size / 30);
    ctx.globalAlpha = alpha;

    if (glow > 0) {
        ctx.shadowColor = color;
        ctx.shadowBlur = glow;
    }

    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(-15, -25, -30, -5, 0, 15);
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(15, -25, 30, -5, 0, 15);
    ctx.closePath();

    const grad = ctx.createRadialGradient(-3, -5, 2, 0, 0, 30);
    grad.addColorStop(0, "#FFB3C1");
    grad.addColorStop(0.4, color);
    grad.addColorStop(1, "#8B0020");
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(-8, -12, 5, 3, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
    ctx.fill();

    ctx.restore();
}

interface Heart3D {
    x: number;
    y: number;
    z: number;
    vy: number;
    size: number;
    rotation: number;
    rotSpeed: number;
    wobblePhase: number;
    wobbleSpeed: number;
    wobbleAmp: number;
    color: string;
    alpha: number;
    glow: number;
    born: number;
}

export default function HeartRibbon({ sectionId, title, children }: HeartRibbonProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);
    const ribbonLeftRef = useRef<HTMLDivElement>(null);
    const ribbonRightRef = useRef<HTMLDivElement>(null);
    const ribbonTopRef = useRef<HTMLDivElement>(null);
    const ribbonBottomRef = useRef<HTMLDivElement>(null);
    const heartRef = useRef<HTMLDivElement>(null);
    const bowRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const shimmerRef = useRef<HTMLDivElement>(null);

    // Shimmer on heart
    useEffect(() => {
        if (isRevealed || !shimmerRef.current) return;
        const anim = gsap.to(shimmerRef.current, {
            backgroundPosition: "200% 0",
            duration: 2,
            repeat: -1,
            ease: "none",
        });
        return () => { anim.kill(); };
    }, [isRevealed]);

    // Gentle float
    useEffect(() => {
        if (isRevealed || !heartRef.current) return;
        const anim = gsap.to(heartRef.current, {
            y: -8,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
        return () => { anim.kill(); };
    }, [isRevealed]);

    const triggerHeartRain = useCallback(() => {
        // Create a temporary fullscreen canvas for the rain
        const canvas = document.createElement("canvas");
        canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Get the center point of the heart that was clicked
        const wrapEl = wrapRef.current;
        let cx = canvas.width / 2;
        let cy = canvas.height / 2;
        if (wrapEl) {
            const r = wrapEl.getBoundingClientRect();
            cx = r.left + r.width / 2;
            cy = r.top + r.height / 2;
        }

        const colors = ["#FF1744", "#FF4081", "#E91E63", "#FF80AB", "#F50057", "#C2185B", "#D81B60", "#FFD700"];

        interface BurstHeart {
            x: number;
            y: number;
            vx: number;
            vy: number;
            z: number;
            size: number;
            rotation: number;
            rotSpeed: number;
            wobblePhase: number;
            wobbleSpeed: number;
            wobbleAmp: number;
            color: string;
            alpha: number;
            glow: number;
            phase: "burst" | "rain";
            gravity: number;
            drag: number;
        }

        const hearts: BurstHeart[] = [];
        const totalHearts = 100;

        for (let i = 0; i < totalHearts; i++) {
            const z = Math.random();
            const sizeBase = 10 + z * 22;
            const angle = Math.random() * Math.PI * 2;
            const burstSpeed = 6 + Math.random() * 12;

            hearts.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * burstSpeed * (0.5 + z * 0.5),
                vy: Math.sin(angle) * burstSpeed * (0.5 + z * 0.5) - 4,
                z,
                size: sizeBase,
                rotation: (Math.random() - 0.5) * 1,
                rotSpeed: (Math.random() - 0.5) * 0.03,
                wobblePhase: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.015 + Math.random() * 0.02,
                wobbleAmp: 8 + Math.random() * 20,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.6 + z * 0.4,
                glow: z * 15,
                phase: "burst",
                gravity: 0.06 + z * 0.08,
                drag: 0.97,
            });
        }

        const startTime = performance.now();
        let running = true;

        const animate = (time: number) => {
            if (!running) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const elapsed = time - startTime;
            let anyVisible = false;

            // Fade out after 5 seconds
            const globalFade = elapsed > 5000 ? Math.max(0, 1 - (elapsed - 5000) / 1500) : 1;
            if (globalFade <= 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.remove();
                running = false;
                return;
            }

            hearts.forEach((h) => {
                // Burst phase: fast outward, slow down with drag
                if (h.phase === "burst") {
                    h.vx *= h.drag;
                    h.vy *= h.drag;
                    h.vy += h.gravity;

                    // Transition to rain phase when speed is slow enough
                    const speed = Math.sqrt(h.vx * h.vx + h.vy * h.vy);
                    if (speed < 1.5 && elapsed > 600) {
                        h.phase = "rain";
                        h.vy = 0.8 + h.z * 1.8;
                        h.vx = (Math.random() - 0.5) * 0.3;
                    }
                } else {
                    // Rain phase: gentle flowing downward
                    h.vy += 0.01;
                    h.wobblePhase += h.wobbleSpeed;
                }

                h.x += h.vx + (h.phase === "rain" ? Math.sin(h.wobblePhase) * h.wobbleAmp * 0.03 : 0);
                h.y += h.vy;
                h.rotation += h.rotSpeed;

                const currentAlpha = h.alpha * globalFade;
                if (currentAlpha <= 0.01) return;
                if (h.y > canvas.height + 60 || h.x < -60 || h.x > canvas.width + 60) return;

                anyVisible = true;
                drawHeart(ctx, h.x, h.y, h.size, h.color, currentAlpha, h.rotation, h.glow);
            });

            if (anyVisible && running) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.remove();
                running = false;
            }
        };

        requestAnimationFrame(animate);
    }, []);

    const handleReveal = () => {
        if (isRevealed) return;

        const tl = gsap.timeline({ onComplete: () => setIsRevealed(true) });

        // Heart pulses
        tl.to(heartRef.current, { scale: 1.15, duration: 0.2, ease: "power2.out" })
            .to(heartRef.current, { scale: 1, duration: 0.12, ease: "power2.in" })
            .to(heartRef.current, { scale: 1.25, duration: 0.15, ease: "power2.out" });

        // Bow flies up
        tl.to(bowRef.current, { y: -60, opacity: 0, scale: 1.5, duration: 0.5, ease: "power2.out" }, "-=0.05");

        // Ribbons fly apart within section bounds
        tl.to(ribbonLeftRef.current, { x: "-120%", rotation: -15, opacity: 0, duration: 0.8, ease: "power3.inOut" }, "-=0.3");
        tl.to(ribbonRightRef.current, { x: "120%", rotation: 15, opacity: 0, duration: 0.8, ease: "power3.inOut" }, "<");
        tl.to(ribbonTopRef.current, { y: "-120%", opacity: 0, duration: 0.8, ease: "power3.inOut" }, "<");
        tl.to(ribbonBottomRef.current, { y: "120%", opacity: 0, duration: 0.8, ease: "power3.inOut" }, "<");

        // Heart explodes
        tl.to(heartRef.current, { scale: 2.5, opacity: 0, rotation: 180, duration: 0.5, ease: "power4.in" }, "-=0.4");
        tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.3 }, "-=0.4");

        // Wrap fades
        tl.to(wrapRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => { if (wrapRef.current) wrapRef.current.style.display = "none"; },
        }, "-=0.2");

        // Content reveals
        tl.fromTo(contentRef.current,
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
            "-=0.3"
        );

        setTimeout(() => triggerHeartRain(), 200);
    };

    return (
        <div className="relative">

            {/* Section-level wrap — NOT fixed, sits within the section */}
            {!isRevealed && (
                <div
                    ref={wrapRef}
                    onClick={handleReveal}
                    className="relative z-20 cursor-pointer overflow-hidden rounded-3xl mx-auto"
                    style={{
                        minHeight: "420px",
                        maxWidth: "900px",
                        background: "radial-gradient(ellipse at center, #FFF0F3 0%, #FFE0E6 40%, #FFD0D8 100%)",
                        boxShadow: "0 8px 40px rgba(255,23,68,0.12)",
                    }}
                >
                    {/* Horizontal ribbon — left */}
                    <div
                        ref={ribbonLeftRef}
                        className="absolute top-1/2 -translate-y-1/2 will-change-transform"
                        style={{
                            left: 0,
                            width: "calc(50% + 22px)",
                            height: "40px",
                            background: "linear-gradient(180deg, #E91E63 0%, #C2185B 35%, #FF4081 50%, #C2185B 65%, #E91E63 100%)",
                            boxShadow: "0 3px 15px rgba(233,30,99,0.25)",
                        }}
                    >
                        <div className="absolute top-[6px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-[#FFD700]/80" />
                        <div className="absolute bottom-[6px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-[#FFD700]/80" />
                    </div>

                    {/* Horizontal ribbon — right */}
                    <div
                        ref={ribbonRightRef}
                        className="absolute top-1/2 -translate-y-1/2 will-change-transform"
                        style={{
                            right: 0,
                            width: "calc(50% + 22px)",
                            height: "40px",
                            background: "linear-gradient(180deg, #E91E63 0%, #C2185B 35%, #FF4081 50%, #C2185B 65%, #E91E63 100%)",
                            boxShadow: "0 3px 15px rgba(233,30,99,0.25)",
                        }}
                    >
                        <div className="absolute top-[6px] left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#FFD700]/50 to-[#FFD700]/80" />
                        <div className="absolute bottom-[6px] left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#FFD700]/50 to-[#FFD700]/80" />
                    </div>

                    {/* Vertical ribbon — top */}
                    <div
                        ref={ribbonTopRef}
                        className="absolute left-1/2 -translate-x-1/2 will-change-transform"
                        style={{
                            top: 0,
                            width: "40px",
                            height: "calc(50% + 20px)",
                            background: "linear-gradient(90deg, #E91E63 0%, #C2185B 35%, #FF4081 50%, #C2185B 65%, #E91E63 100%)",
                            boxShadow: "3px 0 15px rgba(233,30,99,0.25)",
                        }}
                    >
                        <div className="absolute left-[6px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FFD700]/50 to-[#FFD700]/80" />
                        <div className="absolute right-[6px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FFD700]/50 to-[#FFD700]/80" />
                    </div>

                    {/* Vertical ribbon — bottom */}
                    <div
                        ref={ribbonBottomRef}
                        className="absolute left-1/2 -translate-x-1/2 will-change-transform"
                        style={{
                            bottom: 0,
                            width: "40px",
                            height: "calc(50% + 20px)",
                            background: "linear-gradient(90deg, #E91E63 0%, #C2185B 35%, #FF4081 50%, #C2185B 65%, #E91E63 100%)",
                            boxShadow: "3px 0 15px rgba(233,30,99,0.25)",
                        }}
                    >
                        <div className="absolute left-[6px] top-0 bottom-0 w-px bg-gradient-to-t from-transparent via-[#FFD700]/50 to-[#FFD700]/80" />
                        <div className="absolute right-[6px] top-0 bottom-0 w-px bg-gradient-to-t from-transparent via-[#FFD700]/50 to-[#FFD700]/80" />
                    </div>

                    {/* Center content: heart + text */}
                    <div className="flex flex-col items-center justify-center py-20 px-6 relative z-10">
                        <div ref={heartRef} className="relative will-change-transform">
                            {/* Bow */}
                            <div ref={bowRef} className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl z-30 will-change-transform drop-shadow-lg">
                                🎀
                            </div>

                            {/* Heart */}
                            <div
                                className="w-36 h-36 md:w-44 md:h-44 flex items-center justify-center relative"
                                style={{ filter: "drop-shadow(0 8px 30px rgba(255,23,68,0.35))" }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <defs>
                                            <radialGradient id={`hg-${sectionId}`} cx="40%" cy="35%" r="60%">
                                                <stop offset="0%" stopColor="#FF80AB" />
                                                <stop offset="50%" stopColor="#FF1744" />
                                                <stop offset="100%" stopColor="#B71C1C" />
                                            </radialGradient>
                                        </defs>
                                        <path
                                            d="M50 88 C25 65, 2 45, 2 28 C2 14, 15 4, 27 4 C35 4, 43 10, 50 20 C57 10, 65 4, 73 4 C85 4, 98 14, 98 28 C98 45, 75 65, 50 88Z"
                                            fill={`url(#hg-${sectionId})`}
                                        />
                                        <ellipse cx="35" cy="25" rx="12" ry="8" fill="rgba(255,255,255,0.3)" transform="rotate(-20 35 25)" />
                                    </svg>
                                </div>

                                <div
                                    ref={shimmerRef}
                                    className="absolute inset-0 rounded-full overflow-hidden opacity-40"
                                    style={{
                                        background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 55%, transparent 70%)",
                                        backgroundSize: "200% 100%",
                                        backgroundPosition: "-100% 0",
                                    }}
                                />

                                <span className="text-white text-5xl md:text-6xl relative z-10 drop-shadow-lg">♥</span>
                            </div>
                        </div>

                        <div ref={textRef} className="mt-8 text-center">
                            <p className="text-[#FF1744] font-bold text-xl md:text-2xl font-sans mb-2">
                                Tap to unwrap <span className="font-script text-2xl md:text-3xl">{title}</span>
                            </p>
                            <p className="text-[#7D5A5E] text-sm font-sans">A gift of love awaits 💝</p>
                        </div>
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute top-4 left-4 text-2xl opacity-30 text-[#FF4081]">✿</div>
                    <div className="absolute top-4 right-4 text-2xl opacity-30 text-[#FF4081]">✿</div>
                    <div className="absolute bottom-4 left-4 text-2xl opacity-30 text-[#FF4081]">♥</div>
                    <div className="absolute bottom-4 right-4 text-2xl opacity-30 text-[#FF4081]">♥</div>
                </div>
            )}

            {/* Section content */}
            <div
                ref={contentRef}
                style={{ opacity: isRevealed ? 1 : 0, display: isRevealed ? "block" : "none" }}
            >
                {children}
            </div>
        </div>
    );
}
