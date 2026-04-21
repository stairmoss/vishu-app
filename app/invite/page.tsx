import type { Metadata, ResolvingMetadata } from "next";
import React, { Suspense } from "react";
import InviteClient from "./InviteClient";

type Props = {
  params: Promise<any>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const sParams = await searchParams;
  const hostName = typeof sParams.from === 'string' ? sParams.from : 'Someone';
  const guestName = typeof sParams.to === 'string' ? sParams.to : 'Friend';

  return {
    title: `Happy Vishu ${guestName}! | from ${hostName}`,
    description: `Open your personalised digital Vishu Kani Darshanam from ${hostName}. Experience a beautiful digital Vishu celebration.`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `Happy Vishu ${guestName}! | from ${hostName}`,
      description: `Open your personalised digital Vishu Kani Darshanam from ${hostName}.`,
    },
    twitter: {
      title: `Happy Vishu ${guestName}! | from ${hostName}`,
      description: `Open your personalised digital Vishu Kani Darshanam from ${hostName}.`,
    },
  };
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-[#D4AF37]">Loading...</div>}>
      <InviteClient />
    </Suspense>
  );
}
