import type { Metadata, ResolvingMetadata } from "next";
import React, { Suspense } from "react";
import KaineetamClient from "./KaineetamClient";

type Props = {
  params: Promise<any>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const sParams = await searchParams;
  const hostName = typ`eof sParams.to === 'string' ? sParams.to : 'Friend';
  const payeeName = typeof sParams.pn === 'string' ? sParams.pn : 'Someone';

  return {
    title: `Send Kaineetam to ${payeeName} | Vishu Kani`,
    description: `Send your Vishu Kaineetam gift to ${payeeName} securely via UPI apps like Google Pay, PhonePe, or Paytm.`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `Send Kaineetam to ${payeeName} | Vishu Kani`,
      description: `Send your Vishu Kaineetam gift securely via UPI apps.`,
    },
    twitter: {
      title: `Send Kaineetam to ${payeeName} | Vishu Kani`,
      description: `Send your Vishu Kaineetam gift securely via UPI apps.`,
    },
  };
}

export default function KaineetamPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center text-[#D4AF37] font-bold text-xl">
          Loading Kaineetam...
        </div>
      }
    >
      <KaineetamClient />
    </Suspense>
  );
}
