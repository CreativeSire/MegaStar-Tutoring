import type { Metadata } from "next";
import { MarketingRouteShell } from "@/components/marketing-route-shell";
import { subjectDetails, subjectRoutes } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Science",
  description: "Physics, chemistry, and biology routes with better visual structure and next steps.",
};

const detail = subjectDetails.science;

export default function ScienceSubjectPage() {
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
      relatedRoutes={subjectRoutes.filter((route) => route.href !== "/subjects/science")}
      closingTitle="Keep science moving into live teaching"
      closingSummary="The board, the lesson archive, and the live session all work together once the science route is chosen."
    />
  );
}
