import React from "react";

export default function KasavuBorder({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative p-3 ${className} shadow-[0_15px_40px_rgba(139,58,14,0.15)] transition-all duration-500`}>
      {/* Base Saree Cloth Texture overlay (added on top of the bg) */}
      <div className="absolute inset-0 rounded-inherit opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzgnPgo8cmVjdCB3aWR0aD0nOCcgaGVpZ2h0PSc4JyBmaWxsPSdibGFjaycgZmlsbC1vcGFjaXR5PScwLjA2JyAvPgo8L3N2Zz4=')]"></div>
      
      {/* Thick Kasavu Gold Thread Layer 1 */}
      <div className="absolute inset-0 border-[4px] border-[#D4AF37] shadow-[inset_0_0_10px_rgba(212,175,55,0.3)] opacity-80 rounded-[inherit] pointer-events-none z-[-1]"></div>
      
      {/* Outer Decorative Dark Gold Outline */}
      <div className="absolute inset-[-4px] border border-[#8b3a0e]/40 rounded-[inherit] pointer-events-none z-[-1]"></div>
      
      {/* Thin Gold Inner Thread Layer 2 */}
      <div className="absolute inset-[6px] border border-dashed border-[#B8860B]/70 rounded-[inherit] pointer-events-none z-[-1] opacity-70"></div>
      
      {/* Glowing Inner Border Layer 3 */}
      <div className="absolute inset-[2px] border-[2px] border-[#FFFDD0]/50 rounded-[inherit] pointer-events-none z-[-1] mix-blend-overlay"></div>

      {/* Ornate Corner Elements */}
      <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-[#8b3a0e]/60 rounded-tl-[inherit] pointer-events-none"></div>
      <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-[#8b3a0e]/60 rounded-tr-[inherit] pointer-events-none"></div>
      <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-[#8b3a0e]/60 rounded-bl-[inherit] pointer-events-none"></div>
      <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-[#8b3a0e]/60 rounded-br-[inherit] pointer-events-none"></div>

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
