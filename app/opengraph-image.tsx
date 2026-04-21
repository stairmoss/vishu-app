import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vishu Kani – Digital Darshanam & Kaineetam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1c110a 0%, #2d1a0e 60%, #1c110a 100%)",
          fontFamily: "serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold border frame */}
        <div
          style={{
            position: "absolute",
            inset: 20,
            border: "6px solid #D4AF37",
            borderRadius: 24,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 30,
            border: "2px solid #D4AF37",
            borderRadius: 18,
            opacity: 0.3,
          }}
        />

        {/* Glow circle */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Malayalam festival lamp emoji */}
        <div style={{ fontSize: 100, marginBottom: 16 }}>🪔</div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#FFD700",
            textAlign: "center",
            letterSpacing: 2,
            lineHeight: 1.1,
            textShadow: "4px 4px 0 #8b3a0e",
            marginBottom: 16,
          }}
        >
          Happy Vishu!
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 30,
            color: "#FFFDD0",
            textAlign: "center",
            opacity: 0.85,
            marginBottom: 32,
            letterSpacing: 1,
          }}
        >
          Digital Kani Darshanam · UPI Kaineetam Gifting
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: 200,
            height: 3,
            background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            marginBottom: 28,
          }}
        />

        {/* URL badge */}
        <div
          style={{
            fontSize: 22,
            color: "#D4AF37",
            background: "rgba(212,175,55,0.12)",
            border: "2px solid rgba(212,175,55,0.4)",
            padding: "10px 32px",
            borderRadius: 100,
            letterSpacing: 1,
          }}
        >
          vishu.adarsh.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
