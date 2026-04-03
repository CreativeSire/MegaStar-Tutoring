import type { Metadata } from "next";
import { MarketingRouteShell } from "@/components/marketing-route-shell";
import { journeyDetails, journeyRoutes } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Archive",
  description: "How lesson archives, saved boards, and follow-up work after the room ends.",
};

const detail = journeyDetails.archive;

export default function ArchiveJourneyPage() {
  return (
    <MarketingRouteShell
      eyebrow={detail.eyebrow}
      title={detail.title}
      summary={detail.summary}
      image={detail.image}
      accent={detail.accent}
      primaryCta={{ label: "Open library", href: "/app/library" }}
      secondaryCta={{ label: "Open how-it-works hub", href: "/how-it-works" }}
      highlights={detail.highlights}
      relatedRoutes={journeyRoutes.filter((route) => route.href !== "/how-it-works/archive")}
      closingTitle="Archive should feel like a finish, not an afterthought"
      closingSummary="The saved board, library card, and follow-up loop are what make the session path feel complete."
    />
  );
}
