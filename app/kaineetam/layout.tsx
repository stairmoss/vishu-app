import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { searchParams }: { searchParams: { [key: string]: string | string[] | undefined } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const hostName = typeof searchParams.to === 'string' ? searchParams.to : 'Friend';
  const payeeName = typeof searchParams.pn === 'string' ? searchParams.pn : 'Someone';

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

export default function KaineetamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
