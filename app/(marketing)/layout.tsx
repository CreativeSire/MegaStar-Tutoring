import type { Metadata } from "next";
import "../globals.css";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: {
    template: "%s | MegaStar Tutoring",
    default: "MegaStar Tutoring — 1-to-1 Online Tutoring That Works",
  },
  description: "94% of students improve by 2+ grades within 3 months. Expert tutors, personalised learning, proven results. Start with 2 free sessions.",
  keywords: ["tutoring", "online tutoring", "GCSE", "A-Level", "maths tutor", "english tutor", "science tutor"],
  authors: [{ name: "MegaStar Tutoring" }],
  creator: "MegaStar Tutoring",
  metadataBase: new URL("https://megastartutors.com"),
  alternates: {
    canonical: "https://megastartutors.com",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://megastartutors.com",
    siteName: "MegaStar Tutoring",
    title: "MegaStar Tutoring — 1-to-1 Online Tutoring That Works",
    description: "94% of students improve by 2+ grades within 3 months. Start with 2 free sessions.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MegaStar Tutoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MegaStar Tutoring",
    description: "94% of students improve by 2+ grades. Start with 2 free sessions.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}
