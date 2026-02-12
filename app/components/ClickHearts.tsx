"use client";

import { useEffect, useRef } from "react";

// Pre-render a heart shape to an offscreen canvas
function createHeartSprite(size: number, color: string): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    const x = size / 2;
    const y = size / 2;
    const s = size / 30; // Scale factor

    ctx.translate(x, y);
    ctx.scale(s, s);

    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(-15, -25, -30, -5, 0, 15);
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(15, -25, 30, -5, 0, 15);
    ctx.closePath();

    const grad = ctx.createRadialGradient(-3, -5, 1, 0, 0, 28);
    grad.addColorStop(0, "#FFB3C1");
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, "#8B0020");
    ctx.fillStyle = grad;
    ctx.fill();

    // Shine
    ctx.beginPath();
    ctx.ellipse(-7, -11, 4, 2.5, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,0.45)`;
    ctx.fill();

    return canvas;
}

interface ClickHeart {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    rotSpeed: number;
    sprite: HTMLCanvasElement;
    alpha: number;
    gravity: number;
    life: number;
}

export default function ClickHearts() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const heartsRef = useRef<ClickHeart[]>([]);
    const animatingRef = useRef(false);
    const spritesRef = useRef<HTMLCanvasElement[]>([]);

    useEffect(() => {
        // Pre-generate sprites for different colors
        const colors = ["#FF1744", "#FF4081", "#E91E63", "#FF80AB", "#F50057", "#C2185B", "#FFD700", "#FF6F00"];
        spritesRef.current = colors.map(c => createHeartSprite(40, c)); // Fixed size sprite

        // Create a persistent fullscreen canvas
        const canvas = document.createElement("canvas");
        canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;";
        document.body.appendChild(canvas);
        canvasRef.current = canvas;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const spawnHearts = (mx: number, my: number) => {
            const count = 8 + Math.floor(Math.random() * 5); // Slightly reduced count
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 5;
                const sprite = spritesRef.current[Math.floor(Math.random() * spritesRef.current.length)];

                heartsRef.current.push({
                    x: mx,
                    y: my,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2,
                    size: 15 + Math.random() * 20, // Draw size
                    rotation: (Math.random() - 0.5) * 1.2,
                    rotSpeed: (Math.random() - 0.5) * 0.1,
                    sprite: sprite,
                    alpha: 1.0,
                    gravity: 0.1 + Math.random() * 0.05,
                    life: 1.0,
                });
            }

            if (!animatingRef.current) {
                animatingRef.current = true;
                requestAnimationFrame(animate);
            }
        };

        const animate = () => {
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Use clearRect for performance
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Optimization: Filter out dead hearts FIRST to avoid processing them
            if (heartsRef.current.length > 300) { // Safety cap
                heartsRef.current = heartsRef.current.slice(heartsRef.current.length - 300);
            }

            const nextHearts: ClickHeart[] = [];

            for (const h of heartsRef.current) {
                h.x += h.vx;
                h.y += h.vy;
                h.vy += h.gravity;
                h.vx *= 0.98;
                h.rotation += h.rotSpeed;
                h.life -= 0.015;

                if (h.life > 0) {
                    ctx.save();
                    ctx.translate(h.x, h.y);
                    ctx.rotate(h.rotation);
                    ctx.globalAlpha = h.life;
                    // Draw pre-rendered sprite centered
                    const s = h.size;
                    ctx.drawImage(h.sprite, -s / 2, -s / 2, s, s);
                    ctx.restore();
                    nextHearts.push(h);
                }
            }

            heartsRef.current = nextHearts;

            if (heartsRef.current.length > 0) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                animatingRef.current = false;
            }
        };

        const handleClick = (e: MouseEvent) => {
            // Basic throttling to prevent overwhelming on accidental double-clicks or rapid fire
            spawnHearts(e.clientX, e.clientY);
        };

        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("resize", resize);
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        };
    }, []);

    return null;
}
