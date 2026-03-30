import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { isClerkConfigured } from "@/lib/clerk-config";

export const metadata: Metadata = {
  title: "MegaStar Tutoring",
  description: "A private tutoring platform for scheduling, client work logs, invoicing, ratings, and AI support.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const app = (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );

  return isClerkConfigured() ? <ClerkProvider>{app}</ClerkProvider> : app;
}
