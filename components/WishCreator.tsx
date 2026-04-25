"use client";

import React, { useState, useEffect } from "react";
import KasavuBorder from "./KasavuBorder";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8 max-w-sm md:max-w-3xl w-full mx-auto font-sans relative z-40" 
      style={{ pointerEvents: "auto" }}
    >
      <KasavuBorder className="glass-panel p-8 rounded-2xl">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="font-extrabold text-[#D4AF37] text-3xl mb-8 text-center tracking-wide text-glow-gold"
        >
          Create Your Wish
        </motion.h2>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Box 1: Wishing */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex-1 p-6 rounded-xl bg-white/20 backdrop-blur-md shadow-[0_4px_20px_rgba(139,58,14,0.1)] border border-white/50"
          >
            <h3 className="font-bold text-[#8b3a0e] text-lg mb-4 border-b pb-2 border-[#D4AF37]/30">1. The Wish</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[#8b3a0e] font-bold text-xs mb-1.5 uppercase tracking-widest pl-1">Your Name</label>
            <input 
              type="text" 
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Rahul"
              className="premium-input"
            />
          </div>
          <div>
            <label className="block text-[#8b3a0e] font-bold text-xs mb-1.5 uppercase tracking-widest pl-1">Recipient's Name</label>
            <input 
              type="text" 
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Priya"
              className="premium-input"
            />
          </div>
            </div>
          </motion.div>

          {/* Box 2: Kaineetam */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex-1 p-6 rounded-xl bg-white/20 backdrop-blur-md shadow-[0_4px_20px_rgba(139,58,14,0.1)] border border-white/50"
          >
            <h3 className="font-bold text-[#8b3a0e] text-lg mb-4 border-b pb-2 border-[#D4AF37]/30">2. Receive Kaineetam</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[#8b3a0e] font-bold text-xs mb-1.5 uppercase tracking-widest pl-1">Your UPI ID <span className="text-[10px] lowercase normal-case opacity-70">(Optional)</span></label>
                <input 
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. you@upi"
                  className="premium-input"
                />
              </div>
              <div>
                <label className="block text-[#8b3a0e] font-bold text-xs mb-1.5 uppercase tracking-widest pl-1">Your Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="premium-input"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
        {!generatedLink ? (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(212,175,55,0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={!senderName || !recipientName}
            className="w-full bg-gradient-to-r from-[#D4AF37] via-[#f3d368] to-[#B8860B] text-[#5e2b07] font-extrabold text-lg py-4 px-6 rounded-full shadow-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✨ Generate Link ✨
          </motion.button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-white/40 backdrop-blur border border-[#D4AF37]/60 rounded-xl break-all text-sm text-[#8b3a0e] font-mono shadow-inner font-medium">
              {generatedLink}
            </div>
            <div className="flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`flex-1 font-bold py-3 px-4 text-sm rounded-xl shadow transition-colors ${
                  copied 
                  ? "bg-green-500 text-white border-green-600" 
                  : "bg-white text-[#8b3a0e] border border-[#D4AF37]/50 hover:bg-[#FFFDD0]"
                }`}
              >
                {copied ? "✓ Copied" : "📋 Copy Link"}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadPoster}
                disabled={isGenerating}
                className="flex-1 font-bold py-3 px-4 text-sm rounded-xl shadow bg-[#8b3a0e] text-[#FFFDD0] border border-[#5e2b07] disabled:opacity-50"
              >
                {isGenerating ? "Processing..." : "🖼️ Download Poster"}
              </motion.button>
            </div>
            
            <button 
              onClick={() => setGeneratedLink("")}
              className="w-full text-center text-sm font-bold text-[#B8860B] hover:text-[#8b3a0e] underline mt-3 transition-colors"
            >
              Start over
            </button>
          </motion.div>
        )}
        </AnimatePresence>

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
      <KasavuBorder className="glass-panel p-8 rounded-2xl mt-12">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="font-extrabold text-[#D4AF37] text-2xl mb-2 text-center tracking-wide text-glow-gold"
        >
          🍌 Share a Sadhya
        </motion.h2>
        <p className="text-center text-[#8b3a0e]/80 text-sm mb-6 font-medium">Send someone a beautiful animated Sadhya greeting!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-[#8b3a0e] font-bold text-xs mb-1.5 uppercase tracking-widest pl-1">From</label>
            <input
              type="text"
              value={sadhyaFrom}
              onChange={(e) => setSadhyaFrom(e.target.value)}
              placeholder="Your name"
              className="premium-input"
            />
          </div>
          <div>
            <label className="block text-[#8b3a0e] font-bold text-xs mb-1.5 uppercase tracking-widest pl-1">To</label>
            <input
              type="text"
              value={sadhyaTo}
              onChange={(e) => setSadhyaTo(e.target.value)}
              placeholder="Recipient's name"
              className="premium-input"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
        {!sadhyaLink ? (
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(212,175,55,0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSadhyaGenerate}
            disabled={!sadhyaFrom || !sadhyaTo}
            className="w-full bg-gradient-to-r from-[#8b3a0e] to-[#a04514] text-[#FFFDD0] font-extrabold text-lg py-4 px-6 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🌿 Box the Sadhya Link
          </motion.button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            <div className="p-4 bg-white/40 backdrop-blur border border-[#D4AF37]/60 rounded-xl break-all text-sm text-[#8b3a0e] font-mono shadow-inner font-medium">
              {sadhyaLink}
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSadhyaCopy}
                className={`flex-1 font-bold py-3 px-4 text-sm rounded-xl shadow transition-colors ${
                  sadhyaCopied 
                  ? "bg-green-500 text-white border-green-600" 
                  : "bg-white text-[#8b3a0e] border border-[#D4AF37]/50 hover:bg-[#FFFDD0]"
                }`}
              >
                {sadhyaCopied ? "✓ Copied" : "📋 Copy Link"}
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={sadhyaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center font-bold py-3 px-4 text-sm rounded-xl shadow bg-[#8b3a0e] text-[#FFFDD0] border border-[#5e2b07]"
              >
                👁️ Preview
              </motion.a>
            </div>
            <button
              onClick={() => setSadhyaLink("")}
              className="w-full text-center text-sm font-bold text-[#B8860B] hover:text-[#8b3a0e] underline mt-3 transition-colors"
            >
              Start over
            </button>
          </motion.div>
        )}
        </AnimatePresence>
      </KasavuBorder>
    </motion.div>
  );
}
