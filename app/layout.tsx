import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { isClerkConfigured } from "@/lib/clerk-config";

export const metadata: Metadata = {
  title: "MegaStar Tutoring | Personalised Online Tutoring with AI-Powered Scheduling",
  description: "Expert online tutoring in Maths, English, Science & more. AI-powered scheduling, verified tutors, 94% success rate. Book your free trial lesson today.",
  keywords: "online tutoring, private tutor, maths tutor, english tutor, science tutor, GCSE tutoring, A-Level tutoring, 11 plus tutoring, online lessons",
  openGraph: {
    title: "MegaStar Tutoring | Expert Online Tutoring",
    description: "Personalised online tutoring with AI-powered scheduling. 94% student success rate. Book your free trial today.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MegaStar Tutoring | Expert Online Tutoring",
    description: "Personalised online tutoring with AI-powered scheduling. Book your free trial today.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const app = (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );

  return isClerkConfigured() ? <ClerkProvider>{app}</ClerkProvider> : app;
}
