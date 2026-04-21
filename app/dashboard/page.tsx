"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [upi, setUpi] = useState("");
  const [payments, setPayments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!upi) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      const { data, error } = await supabase
        .from("kaineetam_payments")
        .select("*")
        .eq("receiver_upi", upi)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error.message);
        alert("Please ensure your Supabase keys are correctly set in .env.local and the table exists.");
        return;
      }

      if (data) {
        setPayments(data);
        const sum = data.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        setTotal(sum);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8DC] text-[#8b3a0e] p-6 font-sans">
      <div className="max-w-2xl mx-auto pt-20">
        <h1 className="text-4xl font-extrabold text-[#D4AF37] mb-2 text-center pb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] tracking-wide">
          Vishu Kaineetam 
        </h1>
        <p className="text-center text-[#8b3a0e]/80 mb-8 font-bold">Enter your UPI ID to see who sent you gifts!</p>

        <div className="bg-[#FFFDD0] border-4 border-[#D4AF37] p-6 rounded-2xl shadow-xl mb-8 relative">
          <div className="absolute top-0 w-0 h-0 border-l-[64px] border-l-transparent border-r-[64px] border-r-transparent border-t-[40px] border-t-[#D4AF37] opacity-40 left-1/2 -translate-x-1/2"></div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <input 
              type="text" 
              placeholder="Enter your UPI ID (e.g. name@upi)"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-white border-2 border-[#D4AF37] rounded-lg py-3 px-4 text-[#8b3a0e] font-bold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <button 
              onClick={handleSearch}
              disabled={isSearching || !upi}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-bold py-3 px-8 rounded-lg shadow-md transform transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
            >
              {isSearching ? "Searching..." : "Track 🔍"}
            </button>
          </div>
        </div>

        {hasSearched && !isSearching && (
          <div className="animate-fade-in-up">
            <div className="bg-white border-4 border-[#D4AF37] p-8 rounded-2xl mb-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-[100px] -z-0 opacity-50"></div>
              <h2 className="text-xl text-[#B8860B] font-extrabold mb-2 uppercase tracking-widest relative z-10">Total Received</h2>
              <p className="text-6xl font-extrabold text-[#D4AF37] drop-shadow-md relative z-10">
                ₹{total.toLocaleString('en-IN')}
              </p>
            </div>

            <h3 className="text-2xl font-extrabold text-[#8b3a0e] mb-4 border-b-2 border-[#D4AF37]/30 pb-2">
              Recent Transactions ({payments.length})
            </h3>
            
            {payments.length === 0 ? (
              <div className="bg-[#FFFDD0] p-8 rounded-2xl border-2 border-dashed border-[#D4AF37] text-center shadow-inner">
                <p className="text-[#8b3a0e] font-bold">No gifts tracked for this UPI ID yet.</p>
                <p className="text-sm text-[#8b3a0e]/70 mt-2">Generate a wish link and share it to start receiving!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment, idx) => (
                  <div key={idx} className="bg-white border-2 border-[#D4AF37]/40 p-4 rounded-xl flex items-center justify-between hover:border-[#D4AF37] shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#FFFDD0] rounded-full flex items-center justify-center text-xl border-2 border-[#D4AF37]">
                        🎁
                      </div>
                      <div>
                        <p className="font-extrabold text-lg text-[#8b3a0e]">{payment.sender_name || "Anonymous Friend"}</p>
                        <p className="text-xs text-[#8b3a0e]/70 font-semibold">
                          {new Date(payment.created_at).toLocaleDateString()} at {new Date(payment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-green-600 drop-shadow-sm">
                      +₹{payment.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
