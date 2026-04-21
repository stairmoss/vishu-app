"use client";

import React, { useState, useEffect } from "react";
import KasavuBorder from "./KasavuBorder";
import { QRCodeCanvas } from "qrcode.react";

export default function WishCreator() {
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [phone, setPhone] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Sadhya wishes state
  const [sadhyaFrom, setSadhyaFrom] = useState("");
  const [sadhyaTo, setSadhyaTo] = useState("");
  const [sadhyaLink, setSadhyaLink] = useState("");
  const [sadhyaCopied, setSadhyaCopied] = useState(false);

  useEffect(() => {
    // Need to do this inside useEffect to safely access window.location
    setBaseUrl(window.location.origin);
  }, []);

  const handleGenerate = () => {
    if (!senderName || !recipientName) return;
    const url = new URL(`${baseUrl}/kaineetam`);
    url.searchParams.set("to", recipientName);
    url.searchParams.set("pn", senderName);   // payee name for UPI
    if (upiId) url.searchParams.set("vpa", upiId.trim());
    if (phone) url.searchParams.set("phone", phone.trim());
    setGeneratedLink(url.toString());
    setCopied(false);
  };

  const handleSadhyaGenerate = () => {
    if (!sadhyaFrom || !sadhyaTo) return;
    const url = new URL(`${baseUrl}/sadhya`);
    url.searchParams.set("from", sadhyaFrom.trim());
    url.searchParams.set("to", sadhyaTo.trim());
    setSadhyaLink(url.toString());
    setSadhyaCopied(false);
  };

  const handleSadhyaCopy = async () => {
    try {
      await navigator.clipboard.writeText(sadhyaLink);
      setSadhyaCopied(true);
      setTimeout(() => setSadhyaCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadPoster = async () => {
    setIsGenerating(true);
    try {
      const templateImg = new window.Image();
      // Load the new master template asset
      templateImg.src = "/assets/master_template.png";
      await new Promise((resolve, reject) => {
        templateImg.onload = resolve;
        templateImg.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      // Use the actual dimensions of your new template (1587x2245)
      canvas.width = 1587;
      canvas.height = 2245;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw background template
      ctx.drawImage(templateImg, 0, 0, 1587, 2245);

      // --- CONFIGURE YOUR QR CODE POSITION HERE --- //
      // Adjust these coordinates to place the QR exactly over the placeholder in your template
      const qrSize = 500;
      const qrX = (1587 - qrSize) / 2; // Centers it horizontally (around 543)
      const qrY = 1500; // Adjust this Up/Down to perfectly match the placeholder
      
      const qrCanvas = document.getElementById("hidden-qr") as HTMLCanvasElement;
      if (qrCanvas) {
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      }

      // --- CONFIGURE SENDER NAME POSITION HERE --- //
      ctx.fillStyle = "#FFEDB3";
      ctx.font = "bold 60px Arial, sans-serif";
      ctx.textAlign = "center";
      // The text is placed just above the QR code currently
      ctx.fillText(`${senderName}'s Kaineettam`, 1587 / 2, qrY - 50);

      // Trigger Download
      const link = document.createElement("a");
      link.download = `${senderName}_Kaineettam.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Failed to generate poster", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-8 max-w-sm md:max-w-3xl w-full mx-auto font-sans relative z-40" style={{ pointerEvents: "auto" }}>
      <KasavuBorder className="bg-[#FFFDD0] bg-opacity-95 p-6 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
        <h2 className="font-extrabold text-[#D4AF37] text-2xl mb-4 text-center tracking-wide" style={{ textShadow: "1px 1px 0 #8b3a0e" }}>
          Create Your Wish
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Box 1: Wishing */}
          <div className="flex-1 p-4 border-2 border-[#D4AF37]/30 rounded-lg bg-white/50 shadow-inner">
            <h3 className="font-bold text-[#8b3a0e] mb-3 border-b border-[#D4AF37]/30 pb-2">1. The Wish</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[#8b3a0e] font-bold text-sm mb-1 uppercase tracking-wider">Your Name</label>
            <input 
              type="text" 
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Rahul"
              className="w-full bg-white border-2 border-[#D4AF37]/50 rounded py-2 px-3 text-[#8b3a0e] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-[#8b3a0e] font-bold text-sm mb-1 uppercase tracking-wider">Recipient's Name</label>
            <input 
              type="text" 
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Priya"
              className="w-full bg-white border-2 border-[#D4AF37]/50 rounded py-2 px-3 text-[#8b3a0e] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>
            </div>
          </div>

          {/* Box 2: Kaineetam */}
          <div className="flex-1 p-4 border-2 border-[#D4AF37]/30 rounded-lg bg-white/50 shadow-inner">
            <h3 className="font-bold text-[#8b3a0e] mb-3 border-b border-[#D4AF37]/30 pb-2">2. Receive Kaineetam (Optional)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[#8b3a0e] font-bold text-sm mb-1 uppercase tracking-wider">Your UPI ID</label>
                <input 
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. you@upi"
                  className="w-full bg-white border-2 border-[#D4AF37]/50 rounded py-2 px-3 text-[#8b3a0e] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[#8b3a0e] font-bold text-sm mb-1 uppercase tracking-wider">Your Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-white border-2 border-[#D4AF37]/50 rounded py-2 px-3 text-[#8b3a0e] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          </div>
        </div>

        {!generatedLink ? (
          <button 
            onClick={handleGenerate}
            disabled={!senderName || !recipientName}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-bold py-3 px-4 rounded-full shadow-md transform transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Generate Link
          </button>
        ) : (
          <div className="space-y-3 animate-fade-in-up">
            <div className="p-3 bg-white border-2 border-dashed border-[#D4AF37] rounded break-all text-sm text-[#555] font-mono">
              {generatedLink}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className={`flex-1 font-bold py-3 px-2 text-sm rounded-full shadow-md transition ${copied ? "bg-green-500 text-white" : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white hover:shadow-lg"}`}
              >
                {copied ? "Copied" : "Copy Link"}
              </button>
              <button 
                onClick={downloadPoster}
                disabled={isGenerating}
                className="flex-1 font-bold py-3 px-2 text-sm rounded-full shadow-md transition bg-[#8b3a0e] text-white hover:shadow-lg disabled:opacity-50"
              >
                {isGenerating ? "Processing..." : "Download Poster"}
              </button>
            </div>
            
            <button 
              onClick={() => setGeneratedLink("")}
              className="w-full text-center text-sm text-[#8b3a0e] underline mt-2 bg-transparent"
            >
              Generate another link
            </button>
          </div>
        )}

        {/* Dashboard Link */}
        <div className="mt-4 pt-4 border-t border-[#D4AF37]/30 text-center">
          <a href="/dashboard" className="text-sm font-bold text-[#D4AF37] hover:text-[#B8860B] transition">
            View Kaineetam Dashboard
          </a>
        </div>

        {/* Hidden QR Code for Canvas Rendering */}
        <div className="hidden">
          <QRCodeCanvas id="hidden-qr" value={generatedLink || "https://vishu.com"} size={400} level="H" />
        </div>
      </KasavuBorder>

      {/* ──── Sadhya Wishes Box ──── */}
      <KasavuBorder className="bg-[#FFFDD0] bg-opacity-95 p-6 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)] mt-8">
        <h2 className="font-extrabold text-[#D4AF37] text-2xl mb-1 text-center tracking-wide" style={{ textShadow: "1px 1px 0 #8b3a0e" }}>
          🍌 Send a Sadhya Wish
        </h2>
        <p className="text-center text-[#8b3a0e]/70 text-sm mb-5">Send someone a beautiful Sadhya animation greeting!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-[#8b3a0e] font-bold text-sm mb-1 uppercase tracking-wider">From</label>
            <input
              type="text"
              value={sadhyaFrom}
              onChange={(e) => setSadhyaFrom(e.target.value)}
              placeholder="Your name (e.g. Rahul)"
              className="w-full bg-white border-2 border-[#D4AF37]/50 rounded py-2 px-3 text-[#8b3a0e] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-[#8b3a0e] font-bold text-sm mb-1 uppercase tracking-wider">To</label>
            <input
              type="text"
              value={sadhyaTo}
              onChange={(e) => setSadhyaTo(e.target.value)}
              placeholder="Recipient's name (e.g. Priya)"
              className="w-full bg-white border-2 border-[#D4AF37]/50 rounded py-2 px-3 text-[#8b3a0e] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>
        </div>

        {!sadhyaLink ? (
          <button
            onClick={handleSadhyaGenerate}
            disabled={!sadhyaFrom || !sadhyaTo}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-bold py-3 px-4 rounded-full shadow-md transform transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            🌿 Generate Sadhya Wish Link
          </button>
        ) : (
          <div className="space-y-3 animate-fade-in-up">
            <div className="p-3 bg-white border-2 border-dashed border-[#D4AF37] rounded break-all text-sm text-[#555] font-mono">
              {sadhyaLink}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSadhyaCopy}
                className={`flex-1 font-bold py-3 px-2 text-sm rounded-full shadow-md transition ${
                  sadhyaCopied ? "bg-green-500 text-white" : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white hover:shadow-lg"
                }`}
              >
                {sadhyaCopied ? "✓ Copied!" : "📋 Copy Link"}
              </button>
              <a
                href={sadhyaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center font-bold py-3 px-2 text-sm rounded-full shadow-md transition bg-[#8b3a0e] text-white hover:shadow-lg"
              >
                👁️ Preview
              </a>
            </div>
            <button
              onClick={() => setSadhyaLink("")}
              className="w-full text-center text-sm text-[#8b3a0e] underline mt-2 bg-transparent"
            >
              Generate another
            </button>
          </div>
        )}
      </KasavuBorder>
    </div>
  );
}
