"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function KaineetamClient() {
  const searchParams = useSearchParams();
  const vpa = searchParams.get("vpa") || "";
  const payeeName = searchParams.get("pn") || searchParams.get("from") || "Someone";
  const senderName = searchParams.get("to") || "Friend";
  const phone = searchParams.get("phone") || "";

  const [amount, setAmount] = useState("501");
  const [hasPaid, setHasPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {}
  };

  const upiParams = `pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${amount || "101"}&cu=INR&tn=Vishu%20Kaineetam`;
  const upiLink       = `upi://pay?${upiParams}`;
  const gpayLink      = `gpay://upi/pay?${upiParams}`;
  const phonepeLink   = `phonepe://pay?${upiParams}`;
  const paytmLink     = `paytmmp://pay?${upiParams}`;

  const openApp = (url: string) => {
    window.location.href = url;
  };

  const markAsPaid = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("kaineetam_payments")
        .insert([
          {
            receiver_upi: vpa,
            sender_name: senderName,
            amount: Number(amount) || 0,
          },
        ]);
      if (error) console.error("Error logging payment:", error);
      setHasPaid(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 font-sans"
      style={{
        background: "linear-gradient(135deg, #FFF8DC 0%, #FFFDD0 50%, #FFF0C0 100%)",
      }}
    >
      {/* Top decorative band */}
      <div className="w-full h-2 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] mb-10 fixed top-0 left-0 z-10" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div
          className="rounded-3xl shadow-2xl overflow-hidden"
          style={{
            background: "white",
            border: "3px solid #D4AF37",
            boxShadow: "0 8px 40px rgba(212,175,55,0.25)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 pt-8 pb-6 text-center"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
            }}
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <h1 className="text-white font-extrabold text-2xl tracking-wide drop-shadow">
              Vishu Kaineetam
            </h1>
            <p className="text-white/80 text-sm mt-1">
              from <span className="font-bold text-white">{senderName}</span>
            </p>
            <p className="text-yellow-100 text-sm mt-0.5">
              to <span className="font-bold text-white">{payeeName}</span>
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6 flex flex-col items-center gap-5">

            {/* From → To strip */}
            <div className="w-full flex items-center justify-center gap-2 bg-[#FFFDD0] border border-[#D4AF37]/60 rounded-xl px-4 py-2.5">
              <div className="text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#8b3a0e]/50">From</p>
                <p className="text-sm font-extrabold text-[#8b3a0e]">{senderName}</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <svg viewBox="0 0 40 12" fill="none" className="w-10 h-3 text-[#D4AF37]">
                  <path d="M0 6h36M30 1l6 5-6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#8b3a0e]/50">To</p>
                <p className="text-sm font-extrabold text-[#8b3a0e]">{payeeName}</p>
              </div>
            </div>

            {/* Amount Input */}
            <div className="w-full">
              <label className="block text-[#8b3a0e] font-bold text-xs uppercase tracking-widest mb-2 text-center">
                Gift Amount (₹)
              </label>
              <div className="flex items-center justify-center gap-2 bg-[#FFFDD0] border-2 border-[#D4AF37] rounded-xl px-4 py-3">
                <span className="text-[#8b3a0e] font-extrabold text-2xl">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="501"
                  className="flex-1 bg-transparent text-center text-3xl font-extrabold text-[#8b3a0e] focus:outline-none w-full"
                />
              </div>
              {/* Quick amount buttons */}
              <div className="flex justify-center gap-2 mt-2">
                {["101", "251", "501", "1001"].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`text-xs font-bold px-3 py-1 rounded-full border transition ${
                      amount === amt
                        ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                        : "border-[#D4AF37]/50 text-[#8b3a0e] hover:border-[#D4AF37]"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code */}
            {vpa && (
              <div className="w-full flex flex-col items-center gap-3">
                <div className="p-3 bg-white border-2 border-[#D4AF37] rounded-2xl shadow-inner flex flex-col items-center gap-2">
                  <QRCodeSVG value={upiLink} size={180} level="H" includeMargin={true} />
                  <p className="text-xs text-gray-400 font-mono break-all text-center max-w-[200px]">
                    {vpa}
                  </p>
                  {phone && (
                    <p className="text-xs text-gray-400 font-mono text-center">
                      📞 {phone}
                    </p>
                  )}
                </div>

                {/* Scanning instructions */}
                <div className="w-full bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
                  <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-2 text-center">
                    How to scan this QR
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { mark: "—", text: "Do not use Camera or Google Lens" },
                      { mark: "+", text: "Open Google Pay → Scan QR" },
                      { mark: "+", text: "Open PhonePe → Scan & Pay" },
                      { mark: "+", text: "Open Paytm → Scan & Pay" },
                    ].map(({ mark, text }) => (
                      <p key={text} className={`text-xs font-semibold flex items-center gap-2 ${ mark === "+" ? "text-green-800" : "text-red-700" }`}>
                        <span className="font-black text-sm w-3 shrink-0">{mark}</span> {text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* App-specific Pay Buttons */}
            {vpa && (
              <div className="w-full flex flex-col gap-3">
                <p className="text-xs font-extrabold text-[#8b3a0e]/60 uppercase tracking-widest text-center">
                  Pay directly with your app
                </p>

                {/* Google Pay */}
                <button
                  onClick={() => openApp(gpayLink)}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-white text-base shadow-md active:scale-95 transition"
                  style={{ background: "linear-gradient(135deg, #4285F4 0%, #34A853 100%)" }}
                >
                  <span className="font-black text-lg tracking-tight">G</span> Pay with Google Pay
                </button>

                {/* PhonePe */}
                <button
                  onClick={() => openApp(phonepeLink)}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-white text-base shadow-md active:scale-95 transition"
                  style={{ background: "linear-gradient(135deg, #5f259f 0%, #8B2FC9 100%)" }}
                >
                  <span className="font-black text-lg tracking-tight">Pe</span> Pay with PhonePe
                </button>

                {/* Paytm */}
                <button
                  onClick={() => openApp(paytmLink)}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-white text-base shadow-md active:scale-95 transition"
                  style={{ background: "linear-gradient(135deg, #00BAF2 0%, #0070C0 100%)" }}
                >
                  <span className="font-black text-lg tracking-tight">Pt</span> Pay with Paytm
                </button>

                {/* Generic fallback */}
                <button
                  onClick={() => openApp(upiLink)}
                  className="w-full py-3 rounded-2xl font-semibold text-[#8b3a0e] text-sm border-2 border-[#D4AF37]/50 bg-white hover:border-[#D4AF37] active:scale-95 transition"
                >
                  Other UPI App ↗
                </button>
              </div>
            )}

            {/* Confirm Payment */}
            {vpa && !hasPaid ? (
              <button
                onClick={markAsPaid}
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl font-bold text-white bg-green-600 hover:bg-green-700 transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Logging..." : "I Paid — Log it"}
              </button>
            ) : vpa && hasPaid ? (
              <div className="w-full py-3 rounded-2xl font-bold text-green-700 bg-green-50 border-2 border-green-400 text-center">
                Payment Logged
              </div>
            ) : null}

            {/* Phone number tap-to-call strip */}
            {phone && (
              <div
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2"
                style={{ background: "#f0fdf4", borderColor: "#16a34a" }}
              >
                <a
                  href={`tel:${phone}`}
                  className="flex-1 flex items-center gap-2 text-green-700 font-bold text-base no-underline"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3-8.56A2 2 0 0 1 3.05 1.36h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.1a16 16 0 0 0 5.91 5.91l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z"/>
                  </svg>
                  Call {phone}
                </a>
                <button
                  onClick={copyPhone}
                  className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border-2 border-green-600 text-green-700 bg-white active:scale-95 transition"
                >
                  {copiedPhone ? "Copied!" : "Copy"}
                </button>
              </div>
            )}

            {/* No UPI ID fallback */}
            {!vpa && (
              <p className="text-sm text-[#8b3a0e]/60 text-center italic">
                No UPI ID provided. Ask the sender to share their UPI ID.
              </p>
            )}
          </div>
        </div>

        {/* Footer link to dashboard */}
        <div className="text-center mt-6">
          <a
            href="/dashboard"
            className="text-sm font-bold text-[#A07820] underline underline-offset-4 hover:text-[#B8860B] transition"
          >
            Track your Kaineetam &rarr;
          </a>
        </div>
      </motion.div>

      {/* Bottom decorative band */}
      <div className="w-full h-2 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] mt-10 fixed bottom-0 left-0 z-10" />
    </div>
  );
}
