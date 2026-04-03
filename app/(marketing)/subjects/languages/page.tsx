import type { Metadata } from "next";
import { MarketingRouteShell } from "@/components/marketing-route-shell";
import { subjectDetails, subjectRoutes } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Languages",
  description: "French and Spanish support with clearer speaking, writing, and revision routes.",
};

const detail = subjectDetails.languages;

export default function LanguagesSubjectPage() {
  return (
    <MarketingRouteShell
      eyebrow={detail.eyebrow}
      title={detail.title}
      summary={detail.summary}
      image={detail.image}
      accent={detail.accent}
      primaryCta={{ label: "Start free session", href: "/auth/sign-up" }}
      secondaryCta={{ label: "Open subjects hub", href: "/subjects" }}
      highlights={detail.highlights}
      relatedRoutes={subjectRoutes.filter((route) => route.href !== "/subjects/languages")}
      closingTitle="Let the language path continue beyond the page"
      closingSummary="Open the tutor routes and the classroom flow to move from planning into speaking practice and review."
    />
  );
}
