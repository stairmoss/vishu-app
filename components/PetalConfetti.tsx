"use client";

import React, { useEffect, useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export default function PetalConfetti() {
  const { width, height } = useWindowSize();
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const konna = new window.Image();
    konna.src = "/assets/konnapoovu.png";
    konna.onload = () => {
      setImg(konna);
    };
  }, []);

  if (!img) return null;

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={30} // Reduced slightly since real floral images take up more space
      gravity={0.03}
      initialVelocityY={3}
      drawShape={(ctx) => {
        // Center the image around the current canvas piece's pivot point
        // Using -15, -15 offsets maps a 30x30 image naturally onto the particle center
        ctx.drawImage(img, -20, -20, 40, 40);
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    />
  );
}
