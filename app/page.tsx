"use client";

import { useEffect, useRef, useState } from "react";
import MagicalDust from "@/components/MagicalDust";
import Fireworks from "@/components/Fireworks";
import WishCreator from "@/components/WishCreator";
import UpiEnvelope from "@/components/UpiEnvelope";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const FRAME_COUNT = 240;

const getFramePath = (index: number) =>
  `/animation/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

export function VishuContent() {
  const searchParams = useSearchParams();
  const toName = searchParams.get("to");
  const fromName = searchParams.get("from");

  const [frameIndex, setFrameIndex] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0);  // controls fireworks blend
  const [fireworksUnlocked, setFireworksUnlocked] = useState(false); // 2-sec gate

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animationRef = useRef<number>();
  const audioStarted = useRef(false);
  const lastFrameReachedAt = useRef<number | null>(null);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const preloadedIndex = useRef(-1);

  // Smart Preloading - Only preload next 30 frames to save massive amounts of RAM
  useEffect(() => {
    const targetPreload = Math.min(FRAME_COUNT - 1, frameIndex + 30);
    while (preloadedIndex.current < targetPreload) {
      preloadedIndex.current++;
      const img = new Image();
      img.src = getFramePath(preloadedIndex.current);
    }
  }, [frameIndex]);

  // Master scroll + stable playback loop
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) { ticking = false; return; }

          const rect = containerRef.current.getBoundingClientRect();
          const scrollRange = rect.height - window.innerHeight;
          const scrolled = -rect.top;
          
          let progress = scrolled / scrollRange;
          if (progress < 0) progress = 0;
          if (progress > 1) progress = 1;

          // Phase 1: 0% → 70% of scroll = animate through all 240 frames
          // Phase 2: 70% → 85% of scroll = hold last frame (2-sec wait zone)
          // Phase 3: 85% → 100% of scroll = blend fireworks overlay in on top
          const ANIM_END = 0.70;
          const BLEND_START = 0.85;

          const animProgress = Math.min(1, progress / ANIM_END);
          targetProgress.current = animProgress * (FRAME_COUNT - 1);

          // Overlay fade-in only after unlock
          if (fireworksUnlocked && progress > BLEND_START) {
            const blendProgress = (progress - BLEND_START) / (1 - BLEND_START);
            setOverlayOpacity(Math.min(1, blendProgress));
          } else {
            setOverlayOpacity(0);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Stable frame render loop — always moves at fixed 1.5 frames/tick speed
    const renderLoop = () => {
      if (currentProgress.current < targetProgress.current) {
        currentProgress.current += 1.5;
        if (currentProgress.current > targetProgress.current)
          currentProgress.current = targetProgress.current;
      } else if (currentProgress.current > targetProgress.current) {
        currentProgress.current -= 1.5;
        if (currentProgress.current < targetProgress.current)
          currentProgress.current = targetProgress.current;
      }

      const nextFrame = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(currentProgress.current)));
      setFrameIndex(nextFrame);

      // Trigger audio when Krishna appears (~frame 30)
      if (nextFrame >= 30 && !audioStarted.current && audioRef.current) {
        audioRef.current.volume = 1;
        audioRef.current.play().then(() => { audioStarted.current = true; }).catch(() => {});
      }

      // 2-second gate: when last frame is reached, wait 2s then unlock fireworks
      if (nextFrame >= FRAME_COUNT - 1) {
        if (lastFrameReachedAt.current === null) {
          lastFrameReachedAt.current = Date.now();
          unlockTimerRef.current = setTimeout(() => {
            setFireworksUnlocked(true);
          }, 2000);
        }
      } else {
        // Reset gate if user scrolls back above last frame
        if (lastFrameReachedAt.current !== null) {
          lastFrameReachedAt.current = null;
          setFireworksUnlocked(false);
          setOverlayOpacity(0);
          if (unlockTimerRef.current) {
            clearTimeout(unlockTimerRef.current);
            unlockTimerRef.current = null;
          }
        }
      }

      animationRef.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animationRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, [fireworksUnlocked]);

  // Fallback audio on click
  useEffect(() => {
    const handleClick = async () => {
      if (audioRef.current && !audioStarted.current) {
        try {
          audioRef.current.volume = 1;
          await audioRef.current.play();
          audioStarted.current = true;
        } catch (_) {}
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    // Single tall container — everything lives here, no separate sections
    <div ref={containerRef} className="h-[600vh] w-full relative bg-black">
      <audio ref={audioRef} src="/assets/vishu_kanni.mp3" loop />

      {/* Sticky viewport — stays fixed while user scrolls the 600vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Layer 1: Animation frames (always visible) */}
        <img
          src={getFramePath(frameIndex)}
          alt="Vishu Animation Sequence"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <MagicalDust />

        {/* Layer 2: Fireworks + Happy Vishu — blends in smoothly ON TOP of the last frame */}
        {/* No page jump! It's an overlay fade */}
        <div
          className="absolute inset-0 z-30 bg-[#1c110a] overflow-y-auto overflow-x-hidden scroll-smooth"
          style={{ opacity: overlayOpacity, transition: "opacity 0.1s linear", pointerEvents: overlayOpacity > 0.1 ? "auto" : "none" }}
        >
          <div className="fixed inset-0 pointer-events-none">
            <Fireworks />
          </div>

          <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 relative z-10 shrink-0">
            {/* Happy Vishu — only shows after overlay is at least 40% visible */}
            <div
              className="relative z-30 text-center px-4"
              style={{
                opacity: Math.max(0, (overlayOpacity - 0.4) / 0.6),
                transform: `translateY(${(1 - overlayOpacity) * 40}px)`,
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
            <h1
              className="font-extrabold text-5xl md:text-7xl lg:text-8xl text-[#FFD700] tracking-wider"
              style={{
                textShadow: "4px 4px 0 #8b3a0e, 8px 8px 0 rgba(0,0,0,0.5)",
                WebkitTextStroke: "2px #8b3a0e",
              }}
            >
              Happy Vishu{toName ? `, ${toName}` : ''}!
            </h1>
            <p
              className="font-bold text-xl md:text-3xl text-[#FFFDD0] mt-2 mb-4 tracking-wide"
              style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.8)" }}
            >
              A harvest of happiness and prosperity!
            </p>
            {fromName && (
              <p
                className="font-bold text-2xl md:text-4xl text-[#FFD700] mb-2 tracking-wide"
                style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.8)" }}
              >
                — with ❤️ from {fromName}
              </p>
            )}

            {/* Kaineetam Envelope Moved Up Here! Instantly visible after fireworks */}
            {searchParams.get("vpa") && (
              <div className="w-full flex justify-center pointer-events-auto mt-6 z-50">
                <UpiEnvelope vpa={searchParams.get("vpa") as string} name={fromName || "Sender"} senderName={toName || "Someone"} />
              </div>
            )}
            </div>

            {/* Scroll Indicator */}
            <div 
              className="absolute bottom-10 flex flex-col items-center text-[#FFD700] animate-bounce"
              style={{ opacity: Math.max(0, (overlayOpacity - 0.8) / 0.2), transition: "opacity 0.3s ease" }}
            >
              <span className="text-sm font-bold tracking-widest uppercase mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Scroll down to make your own</span>
              <span className="text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">⬇️</span>
            </div>
          </div>

          <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center gap-8 px-4 py-20 relative z-20 bg-gradient-to-t from-black via-[#1c110a] to-[#1c110a]/90 shrink-0">
            <div className="w-full flex justify-center">
              <WishCreator />
            </div>

          </div>
        </div>

        {/* Scroll Down hint — shown on frame 0-5 only */}
        <div
          className={`absolute bottom-10 left-0 w-full text-center z-50 pointer-events-none transition-opacity duration-1000 ${
            frameIndex > 5 ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-[#FFD700] font-black tracking-widest uppercase text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-bounce inline-block">
            Scroll Down
          </span>
        </div>

        {/* "Keep Scrolling" nudge on last frame before fireworks unlock */}
        <div
          className={`absolute bottom-10 left-0 w-full text-center z-50 pointer-events-none transition-opacity duration-700 ${
            frameIndex >= FRAME_COUNT - 1 && !fireworksUnlocked ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-[#FFD700] font-black tracking-widest uppercase text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse inline-block">
            ↓ Keep Scrolling ↓
          </span>
        </div>
      </div>
    </div>
  );
}

export default function VishuPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-[#D4AF37] font-bold tracking-widest uppercase">Loading Magic...</div>}>
      <VishuContent />
    </Suspense>
  );
}
