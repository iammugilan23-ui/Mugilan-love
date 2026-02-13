"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

type Variant = "hearts" | "sparkles" | "roses";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    rotation: number;
    rotationSpeed: number;
    symbol: string;
    life: number;
    maxLife: number;
    gravity: number;
    color: string;
}

const SYMBOLS: Record<Variant, string[]> = {
    hearts: ["♥", "❤", "💕", "💗", "💖"],
    sparkles: ["✦", "✧", "⋆", "✵", "💫"],
    roses: ["🌹", "🌸", "🌺", "💐", "✿"],
};

const COLORS: Record<Variant, string[]> = {
    hearts: ["#FF1744", "#FF4081", "#E91E63", "#FF80AB", "#F50057"],
    sparkles: ["#FFD700", "#FFC107", "#FF9800", "#FF80AB", "#FF4081"],
    roses: ["#FF1744", "#E91E63", "#FF4081", "#C2185B", "#AD1457"],
};

export default function LoveParticles({ variant = "hearts", enabled = true }: { variant?: Variant; enabled?: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const rafRef = useRef<number>(0);

    const createParticle = useCallback((x: number, y: number, burst = false): Particle => {
        const symbols = SYMBOLS[variant];
        const colors = COLORS[variant];
        const speed = burst ? Math.random() * 6 + 2 : Math.random() * 1.5 + 0.3;
        const angle = burst ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
        return {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: burst ? Math.random() * 18 + 12 : Math.random() * 14 + 8,
            opacity: 1,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 4,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            life: 0,
            maxLife: burst ? 60 + Math.random() * 40 : 120 + Math.random() * 80,
            gravity: burst ? 0.08 : 0.02,
            color: colors[Math.floor(Math.random() * colors.length)],
        };
    }, [variant]);

    useEffect(() => {
        if (!enabled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };



        window.addEventListener("mousemove", handleMouseMove);

        let spawnTimer = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            spawnTimer++;
            if (spawnTimer % 40 === 0 && particlesRef.current.length < 30) {
                const x = Math.random() * canvas.width;
                const y = canvas.height + 20;
                particlesRef.current.push(createParticle(x, y));
            }

            particlesRef.current = particlesRef.current.filter((p) => {
                p.life++;
                p.x += p.vx;
                p.vy += p.gravity;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                // Mouse attraction
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200 && dist > 10) {
                    p.vx += (dx / dist) * 0.12;
                    p.vy += (dy / dist) * 0.12;
                }

                const lifeRatio = p.life / p.maxLife;
                p.opacity = lifeRatio > 0.7 ? 1 - (lifeRatio - 0.7) / 0.3 : Math.min(1, lifeRatio * 3);

                if (p.life >= p.maxLife || p.y < -50) return false;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity * 0.7;
                ctx.font = `${p.size}px serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 6;
                ctx.fillText(p.symbol, 0, 0);
                ctx.restore();

                return true;
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [variant, createParticle, enabled]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[5]"
        />
    );
}
