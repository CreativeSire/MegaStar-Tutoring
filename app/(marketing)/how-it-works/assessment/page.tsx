import type { Metadata } from "next";
import { MarketingRouteShell } from "@/components/marketing-route-shell";
import { journeyDetails, journeyRoutes } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Assessment",
  description: "See how the first diagnostic step works before matching and live teaching begin.",
};

const detail = journeyDetails.assessment;

export default function AssessmentJourneyPage() {
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
      relatedRoutes={journeyRoutes.filter((route) => route.href !== "/how-it-works/assessment")}
      closingTitle="Assessment should hand off cleanly to matching"
      closingSummary="Once the diagnostic is clear, the next page takes the learner into tutor matching and the first live lesson."
    />
  );
}
