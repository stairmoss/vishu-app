"use client";

import { useEffect, useRef, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const FRAME_COUNT = 240;

const getFramePath = (index: number) =>
  `/animationsadhya/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

export function SadhyaContent() {
  const searchParams = useSearchParams();
  const toName = searchParams.get("to");
  const fromName = searchParams.get("from");

  const MIN_FRAME = 5; // corresponds to ezgif-frame-006.jpg
  const MAX_FRAME = 228; // corresponds to ezgif-frame-229.jpg

  const [frameIndex, setFrameIndex] = useState(MIN_FRAME);
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  const preloadedIndex = useRef(MIN_FRAME - 1);

  // Smart preloading (load ahead chunk by chunk)
  useEffect(() => {
    const targetPreload = Math.min(MAX_FRAME, frameIndex + 30);
    while (preloadedIndex.current < targetPreload) {
      preloadedIndex.current++;
      const img = new Image();
      img.src = getFramePath(preloadedIndex.current);
    }
  }, [frameIndex]);

  // Autoplay animation
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentFrame = MIN_FRAME;

    // Play at roughly 30 FPS (1000ms / 30)
    const fpsInterval = 1000 / 30;

    const renderLoop = (time: number) => {
      const elapsed = time - lastTime;

      if (elapsed > fpsInterval) {
        lastTime = time - (elapsed % fpsInterval);

        if (currentFrame < MAX_FRAME) {
          currentFrame++;
          setFrameIndex(currentFrame);
        }
      }

      // Stop animation once we reach the last frame
      if (currentFrame < MAX_FRAME) {
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Fade in overlay only on the last frame
  useEffect(() => {
    if (frameIndex >= MAX_FRAME) {
      setOverlayOpacity(1);
    }
  }, [frameIndex]);

  return (
    <div className="h-screen w-full relative bg-[#2d1a0e] overflow-hidden">
      {/* Frame animation */}
      <img
        src={getFramePath(frameIndex)}
        alt="Sadhya Animation"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Greeting overlay */}
      <div
        className="absolute inset-0 z-30 overflow-hidden"
        style={{
          opacity: overlayOpacity,
          transition: "opacity 1.5s ease-in-out",
          background: "radial-gradient(ellipse at center, rgba(120,60,10,0.5) 0%, rgba(30,15,5,0.85) 100%)",
        }}
      >
        {/* Floating banana leaves / petals */}
        <FloatingPetals />

        {/* Central greeting card */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
          style={{
            opacity: overlayOpacity,
            transform: `translateY(${(1 - overlayOpacity) * 50}px)`,
            transition: "opacity 1.5s ease, transform 1.5s ease",
          }}
        >
          {/* Banana leaf decoration top */}
          <div className="text-5xl mb-4 animate-bounce" style={{ animationDuration: "2s" }}>🌿</div>

          {/* Main greeting */}
          <h1
            className="font-extrabold text-5xl md:text-6xl lg:text-7xl mb-5 tracking-wide leading-tight"
            style={{
              color: "#FFD700",
              textShadow: "3px 3px 0 #8b3a0e, 6px 6px 0 rgba(0,0,0,0.6)",
              WebkitTextStroke: "1px #8b3a0e",
              fontFamily: "Georgia, serif",
            }}
          >
            Sadhya Oonn by {fromName || "Us"} {toName ? `and to ${toName}` : ""}
          </h1>

          <p
            className="text-xl md:text-2xl mt-4 max-w-md font-semibold"
            style={{ color: "#FFFDD0", textShadow: "2px 2px 0 rgba(0,0,0,0.8)" }}
          >
            
          </p>

          {/* Sadhya items row */}
          <div className="flex gap-4 text-4xl mt-8 animate-pulse" style={{ animationDuration: "3s" }}>
            <span title="Rice"></span>
            <span title="Sambar"></span>
            <span title="Payasam"></span>
            <span title="Banana"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating banana-leaf petals decoration
function FloatingPetals() {
  const petals = ["🌿", "🍃", "🌸", "✨", "🌺", "🍀", "⭐", "🌼"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 16 }).map((_, i) => {
        const petal = petals[i % petals.length];
        const left = `${(i * 6.5 + 3) % 100}%`;
        const animDuration = `${6 + (i % 5) * 1.5}s`;
        const animDelay = `${(i * 0.4) % 4}s`;
        const size = `${1.2 + (i % 3) * 0.5}rem`;
        return (
          <span
            key={i}
            className="absolute animate-bounce opacity-70"
            style={{
              left,
              top: `${10 + (i % 7) * 12}%`,
              fontSize: size,
              animationDuration: animDuration,
              animationDelay: animDelay,
            }}
          >
            {petal}
          </span>
        );
      })}
    </div>
  );
}

export default function SadhyaPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-[#2d1a0e] flex items-center justify-center text-[#FFD700] font-bold tracking-widest uppercase text-xl">
          Loading Sadhya... 🌿
        </div>
      }
    >
      <SadhyaContent />
    </Suspense>
  );
}
