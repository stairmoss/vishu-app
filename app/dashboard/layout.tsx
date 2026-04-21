import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Kaineetam | Vishu Kani",
  description:
    "Track all your Vishu Kaineetam gifts received via UPI in one place. See who sent you gifts and how much you received.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Track Kaineetam | Vishu Kani",
    description: "Track all your Vishu Kaineetam gifts received via UPI in one place.",
  },
  twitter: {
    title: "Track Kaineetam | Vishu Kani",
    description: "Track all your Vishu Kaineetam gifts received via UPI in one place.",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
