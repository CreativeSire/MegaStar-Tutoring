import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MegaStar Tutoring",
  description: "A private tutoring platform for scheduling, client work logs, invoicing, ratings, and AI support.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
