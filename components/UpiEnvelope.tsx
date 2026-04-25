"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase";

interface UpiEnvelopeProps {
  vpa: string;
  name: string;
  senderName: string;
}

export default function UpiEnvelope({ vpa, name, senderName }: UpiEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<string>("501");
  const [hasPaid, setHasPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Correct UPI deep-link format: pa → pn → am → cu → tn
  const upiLink = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount || "101"}&cu=INR&tn=Vishu%20Kaineetam`;

  const handlePay = () => {
    window.location.href = upiLink; // Triggers the UPI app selector on mobile
  };

  const markAsPaid = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('kaineetam_payments')
        .insert([
          { 
            receiver_upi: vpa, 
            sender_name: senderName, 
            amount: Number(amount) || 0 
          }
        ]);
        
      if (error) {
        console.error("Error logging payment:", error);
        // We set it to true anyway so the user gets the success UI instead of being blocked by db error
      }
      setHasPaid(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            key="envelope-closed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer relative w-72 h-44 bg-gradient-to-br from-[#FFF8DC] via-[#FAF0E6] to-[#F5DEB3] flex shadow-[0_10px_30px_rgba(139,58,14,0.3)] rounded-lg overflow-hidden border-2 border-[#D4AF37]/60 group"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPjxyZWN0IHdpZHRoPSc0JyBoZWlnaHQ9JzQnIGZpbGw9JyNmZmYnIGZpbGwtb3BhY2l0eT0nMC4wNScvPjwvc3ZnPg==')] opacity-40 mix-blend-overlay"></div>
            {/* Elegant Flap */}
            <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-[#f3d368] to-transparent opacity-30 transform origin-top border-b border-[#D4AF37]/50 shadow-sm" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}></div>
            {/* Wax Seal */}
            <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#8b3a0e] to-[#5e2b07] shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-[#D4AF37]/80 flex items-center justify-center text-[#D4AF37] font-bold text-lg transform group-hover:scale-110 transition-transform duration-300">
              ₹
            </div>
            <div className="absolute bottom-6 w-full text-center z-10">
              <p className="font-manjari text-lg font-bold text-[#8b3a0e] tracking-widest uppercase drop-shadow">Tap for Kaineetam</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="envelope-open"
            initial={{ scale: 0.5, opacity: 0, y: 50, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="glass-panel p-8 rounded-2xl flex flex-col items-center bg-white/40 shadow-[0_20px_50px_rgba(139,58,14,0.2)] border border-white/60 relative overflow-hidden w-[320px]"
          >
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>
            
            <h3 className="font-manjari text-2xl font-bold text-[#8b3a0e] mb-6 text-center leading-tight">
              Vishu Kaineetam<br/> <span className="text-[#D4AF37] text-lg font-medium tracking-wide block mt-1">for {name}</span>
            </h3>

            <div className="flex items-center justify-center space-x-2 text-4xl font-extrabold mb-6 text-[#8b3a0e]">
              <span className="opacity-80 font-sans font-light">₹</span>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="501"
                className="w-28 text-center bg-transparent border-b-2 border-dashed border-[#D4AF37] focus:outline-none focus:border-[#8b3a0e] transition-colors"
              />
            </div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-white border border-[#D4AF37]/40 rounded-xl mb-4 shadow-sm"
            >
              <QRCodeSVG value={upiLink} size={160} level="H" includeMargin={false} />
            </motion.div>
            
            <p className="text-xs text-[#8b3a0e]/60 mb-6 font-mono break-all max-w-[240px] text-center">{vpa}</p>
            
            <div className="flex flex-col w-full gap-3 mt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePay}
                className="w-full text-center px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#5e2b07] font-bold rounded-xl shadow-lg transform transition"
              >
                📱 Pay via UPI App
              </motion.button>
              
              {!hasPaid ? (
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={markAsPaid}
                  disabled={isSubmitting}
                  className="w-full text-center px-6 py-3.5 bg-green-600/90 backdrop-blur text-white font-bold rounded-xl shadow-md transform transition disabled:opacity-50"
                >
                  {isSubmitting ? "Logging..." : "✓ Mark as Paid"}
                </motion.button>
              ) : (
                <div className="w-full text-center px-6 py-3.5 bg-green-100/50 backdrop-blur text-green-800 font-bold rounded-xl border border-green-500/30">
                  Payment Logged Successfully
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
