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
            onClick={() => setIsOpen(true)}
            className="cursor-pointer glass-panel kasavu-border relative w-64 h-40 bg-gradient-to-br from-[#FFF8DC] to-[#F5DEB3] flex items-center justify-center shadow-xl rounded-md"
          >
            {/* simple envelope flap design using borders */}
            <div className="absolute top-0 w-0 h-0 border-l-[128px] border-l-transparent border-r-[128px] border-r-transparent border-t-[80px] border-t-[#D4AF37] opacity-40"></div>
            <div className="z-10 text-center">
              <span className="text-2xl mb-2 block">✉️</span>
              <p className="font-manjari text-lg font-bold text-[#A07820]">Tap for Kaineetam</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="envelope-open"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="glass-panel p-6 kasavu-border flex flex-col items-center bg-white rounded-md shadow-2xl"
          >
            <h3 className="font-manjari text-xl font-bold text-[#A07820] mb-4 text-center">
              Vishu Kaineetam for<br/>{name}
            </h3>

            <div className="flex items-center space-x-2 text-2xl font-bold mb-4">
              <span className="text-[#8b3a0e]">₹</span>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="501"
                className="w-24 border-b-2 border-[#D4AF37] focus:outline-none focus:border-[#B8860B] text-center bg-transparent text-[#8b3a0e]"
              />
            </div>
            
            <div className="p-4 bg-white border-2 border-[#D4AF37] rounded-lg mb-4">
              <QRCodeSVG value={upiLink} size={150} level="H" includeMargin={true} />
            </div>
            
            <p className="text-sm text-gray-500 mb-4 break-all max-w-[200px] text-center">{vpa}</p>
            
            <div className="flex flex-col w-full gap-3 mt-2">
              <button
                onClick={handlePay}
                className="w-full text-center px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-bold rounded-full shadow-lg transform transition hover:scale-105 active:scale-95"
              >
                Pay via UPI App
              </button>
              
              {!hasPaid ? (
                <button 
                  onClick={markAsPaid}
                  disabled={isSubmitting}
                  className="w-full text-center px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Logging..." : "I Paid"}
                </button>
              ) : (
                <div className="w-full text-center px-6 py-3 bg-gray-100 text-green-700 font-bold rounded-full border-2 border-green-500">
                  Payment Logged
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
