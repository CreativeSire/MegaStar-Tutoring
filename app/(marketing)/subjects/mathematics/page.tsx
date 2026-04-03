import type { Metadata } from "next";
import { MarketingRouteShell } from "@/components/marketing-route-shell";
import { subjectDetails, subjectRoutes } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Mathematics",
  description: "GCSE and A-Level maths support with clear route choices and calmer progress paths.",
};

const detail = subjectDetails.mathematics;

export default function MathematicsSubjectPage() {
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
      relatedRoutes={subjectRoutes.filter((route) => route.href !== "/subjects/mathematics")}
      closingTitle="Move from maths into the live classroom"
      closingSummary="Once the learner is ready, the classroom and archive flow take over, keeping the progress path visible end to end."
    />
  );
}
