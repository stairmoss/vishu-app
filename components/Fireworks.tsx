"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface Burst {
  particles: Particle[];
}

const COLORS = [
  "#D4AF37", "#FFD700", "#FF6B6B", "#FF8E53", "#A8E6CF",
  "#FFEAA7", "#FD79A8", "#E17055", "#74B9FF", "#81ECEC",
];

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bursts: Burst[] = [];

    const createBurst = (x: number, y: number) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 80 + Math.floor(Math.random() * 60);
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: 3 + Math.random() * 4,
        });
      }
      bursts.push({ particles });
    };

    // Launch initial bursts
    const launchPattern = () => {
      const positions = [
        [canvas.width * 0.25, canvas.height * 0.3],
        [canvas.width * 0.75, canvas.height * 0.25],
        [canvas.width * 0.5, canvas.height * 0.2],
        [canvas.width * 0.15, canvas.height * 0.5],
        [canvas.width * 0.85, canvas.height * 0.45],
      ];
      positions.forEach(([x, y], i) => {
        setTimeout(() => createBurst(x, y), i * 200);
      });
    };

    launchPattern();
    const repeatInterval = setInterval(launchPattern, 2500);

    let animId: number;
    const animate = () => {
      // Trail effect
      ctx.fillStyle = "rgba(28, 17, 10, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let b = bursts.length - 1; b >= 0; b--) {
        const burst = bursts[b];
        for (let p = burst.particles.length - 1; p >= 0; p--) {
          const part = burst.particles[p];
          part.x += part.vx;
          part.y += part.vy;
          part.vy += 0.08; 
          part.vx *= 0.96; 
          part.vy *= 0.96;
          part.size -= 0.05;
          part.alpha -= 0.015;

          if (part.size <= 0 || part.alpha <= 0) {
            burst.particles.splice(p, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = part.alpha;
          
          // Glowing aura (fallback to simple layered drawing without expensive shadowBlur)
          ctx.fillStyle = part.color;
          ctx.globalCompositeOperation = 'lighter';
          ctx.beginPath();
          ctx.arc(part.x, part.y, Math.max(0.1, part.size), 0, Math.PI * 2);
          ctx.fill();
          
          // Bright core
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(part.x, part.y, Math.max(0.1, part.size * 0.4), 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
        if (burst.particles.length === 0) bursts.splice(b, 1);
      }
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(repeatInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40 pointer-events-none"
    />
  );
}
