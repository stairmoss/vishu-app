"use client";

import React, { useEffect, useRef } from "react";

interface DustParticle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  opacity: number;
  fadeSpeed: number;
}

export default function MagicalDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: DustParticle[] = [];
    const particleCount = 60; // magical dust density

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3 - 0.2, // slight upward float
        opacity: Math.random(),
        fadeSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        // Oscillate opacity for twinkle effect
        p.opacity += p.fadeSpeed;
        if (p.opacity > 1 || p.opacity < 0.1) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Loop completely around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        // creating gradient for magical glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        gradient.addColorStop(0, `rgba(255, 230, 150, ${p.opacity})`);
        gradient.addColorStop(1, "rgba(212, 175, 55, 0)");

        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2, false);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none opacity-60"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
