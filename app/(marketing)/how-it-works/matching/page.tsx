import type { Metadata } from "next";
import { MarketingRouteShell } from "@/components/marketing-route-shell";
import { journeyDetails, journeyRoutes } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Matching",
  description: "Explore how tutor matching works before the live classroom starts.",
};

const detail = journeyDetails.matching;

export default function MatchingJourneyPage() {
  return (
    <MarketingRouteShell
      eyebrow={detail.eyebrow}
      title={detail.title}
      summary={detail.summary}
      image={detail.image}
      accent={detail.accent}
      primaryCta={{ label: "Start free session", href: "/auth/sign-up" }}
      secondaryCta={{ label: "Open how-it-works hub", href: "/how-it-works" }}
      highlights={detail.highlights}
      relatedRoutes={journeyRoutes.filter((route) => route.href !== "/how-it-works/matching")}
      closingTitle="Matching should flow into the live classroom"
      closingSummary="The next route takes the learner from the match to the meeting-style classroom and the board."
    />
  );
}
