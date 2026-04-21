"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import YouTube, { YouTubeProps } from "react-youtube";
import KasavuBorder from "@/components/KasavuBorder";
import PetalConfetti from "@/components/PetalConfetti";
import UpiEnvelope from "@/components/UpiEnvelope";
import Fireworks from "@/components/Fireworks";

export default function InviteClient() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Friend";
  const hostName = searchParams.get("from") || "Someone";
  const vpa = searchParams.get("vpa") || "";

  const [isOpen, setIsOpen] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [player, setPlayer] = useState<any>(null);

  const handleOpenEyes = () => {
    setIsOpen(true);
    if (player) {
      player.playVideo();
      player.unMute();
      player.setVolume(70);
    }
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    event.target.pauseVideo();
  };

  const videoOptions: YouTubeProps['opts'] = {
    height: '360',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
      fs: 0,
      showinfo: 0,
      autohide: 1,
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black font-sans">
      {/* YouTube Player - Hidden until open, but loaded early */}
      <div className="fixed opacity-0 pointer-events-none scale-0">
        <YouTube
          videoId="apk2VAVM0yU"
          opts={videoOptions}
          onReady={onPlayerReady}
        />
      </div>

      {/* FIREWORKS OVERLAY */}
      {showFireworks && <Fireworks />}

      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            key="dark-screen"
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0 bg-[#1a1a1a] flex flex-col items-center justify-center z-50 p-4 border-8 border-[#D4AF37]"
            style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23d4af37\" fill-opacity=\"0.05\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E')" }}
          >
            <div className="text-center max-w-sm">
              <p className="text-[#D4AF37]/60 font-inter text-sm tracking-widest uppercase mb-2">
                A Vishu Greeting for
              </p>
              <h2 className="text-[#D4AF37] font-manjari text-3xl md:text-4xl font-bold mb-2 leading-relaxed">
                {guestName}
              </h2>
              <p className="text-[#FFFDD0]/50 font-inter text-sm mb-8">
                from {hostName}
              </p>
              <p className="text-[#D4AF37]/70 font-inter text-base mb-8 leading-relaxed">
                It&apos;s Vishu morning.<br />Close your eyes...
              </p>
              <button
                onClick={handleOpenEyes}
                className="relative group p-4 animate-pulse rounded-full"
              >
                <div className="absolute inset-0 bg-[#D4AF37] opacity-20 rounded-full blur-xl group-hover:opacity-40 transition"></div>
                <span className="text-8xl block drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] filter brightness-125 saturate-150">🪔</span>
                <span className="block mt-4 text-[#FFFDD0] text-lg uppercase tracking-widest font-inter font-bold">Tap to Wake Up</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.main
            key="reveal-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 2 } }}
            className="min-h-screen bg-[var(--background)] flex flex-col items-center py-10 px-4"
          >
            {/* PETALS BACKGROUND */}
            <PetalConfetti />

            <div className="max-w-2xl w-full z-10 space-y-10">

              {/* THE KANI REVEAL (YouTube Video) */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5, type: 'spring' }}
                className="w-full"
              >
                <KasavuBorder className="bg-white p-1 sm:p-2 shadow-2xl overflow-hidden aspect-video relative">
                  <div className="absolute inset-0 z-20 pointer-events-none border-[12px] border-white/10"></div>
                  <YouTube
                    videoId="apk2VAVM0yU"
                    opts={{
                      ...videoOptions,
                      playerVars: { ...videoOptions.playerVars, autoplay: 1, controls: 1 }
                    }}
                    className="w-full h-full aspect-video"
                  />
                </KasavuBorder>
              </motion.div>

              {/* PERSONALIZED MESSAGE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="text-center bg-white/60 backdrop-blur-sm p-8 rounded-xl border border-[#D4AF37]/30 shadow-lg"
              >
                <h1 className="font-manjari text-4xl text-[#A07820] font-bold mb-4">Happy Vishu,<br /> {guestName}! 🌼</h1>
                <p className="text-lg text-[#8B4513] font-inter">
                  Wishing you a harvest of happiness, prosperity, and peace. <br /><br />
                  May this New Year bring you abundant joy.
                </p>
                <p className="mt-6 text-xl font-manjari text-[#A07820] font-bold">
                  With love, <br /> {hostName}
                </p>
              </motion.div>

              {/* KAINEETAM SECTION */}
              {vpa && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5, duration: 1 }}
                >
                  <UpiEnvelope vpa={vpa} name={hostName} senderName={guestName} />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4, duration: 1 }}
                className="text-center pb-20 flex flex-col items-center gap-4"
              >
                <button
                  onClick={() => setShowFireworks(true)}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white px-8 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105 active:scale-95 transition"
                >
                  🧨 Light Crackers 🎇
                </button>
                <a
                  href="/dashboard"
                  className="text-sm font-bold text-[#A07820] underline underline-offset-4 hover:text-[#B8860B] transition"
                >
                  💛 Track your Kaineetam →
                </a>
              </motion.div>

            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
