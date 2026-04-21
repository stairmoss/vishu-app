import React from "react";

export default function KasavuBorder({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative p-2 ${className}`}>
      {/* Outer gold border */}
      <div className="absolute inset-0 border-[6px] border-[#D4AF37] opacity-90 rounded-sm shadow-lg pointer-events-none"></div>
      
      {/* Inner thin gold border */}
      <div className="absolute inset-2 border-[2px] border-[#B8860B] opacity-60 rounded-none pointer-events-none"></div>
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37] m-1 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37] m-1 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37] m-1 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37] m-1 pointer-events-none"></div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
