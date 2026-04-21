import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { searchParams }: { searchParams: { [key: string]: string | string[] | undefined } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const hostName = typeof searchParams.from === 'string' ? searchParams.from : 'Someone';
  const guestName = typeof searchParams.to === 'string' ? searchParams.to : 'Friend';

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

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
