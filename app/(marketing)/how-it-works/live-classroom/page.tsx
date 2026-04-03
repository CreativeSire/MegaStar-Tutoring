import type { Metadata } from "next";
import { MarketingRouteShell } from "@/components/marketing-route-shell";
import { journeyDetails, journeyRoutes } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Live Classroom",
  description: "Meet the audio, video, and whiteboard route that powers live tutoring sessions.",
};

const detail = journeyDetails["live-classroom"];

export default function LiveClassroomJourneyPage() {
  return (
    <MarketingRouteShell
      eyebrow={detail.eyebrow}
      title={detail.title}
      summary={detail.summary}
      image={detail.image}
      accent={detail.accent}
      primaryCta={{ label: "Open classroom", href: "/classroom" }}
      secondaryCta={{ label: "Open how-it-works hub", href: "/how-it-works" }}
      highlights={detail.highlights}
      relatedRoutes={journeyRoutes.filter((route) => route.href !== "/how-it-works/live-classroom")}
      closingTitle="Open the live room when you're ready"
      closingSummary="This route exists to hand learners directly into the meeting-style classroom, not leave them on a summary page."
    />
  );
}
