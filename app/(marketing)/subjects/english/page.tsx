import type { Metadata } from "next";
import { MarketingRouteShell } from "@/components/marketing-route-shell";
import { subjectDetails, subjectRoutes } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "English",
  description: "English support for reading, writing, comprehension, and essay routes.",
};

const detail = subjectDetails.english;

export default function EnglishSubjectPage() {
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
      relatedRoutes={subjectRoutes.filter((route) => route.href !== "/subjects/english")}
      closingTitle="Use English as a route into the wider product"
      closingSummary="From English you can move into tutors, pricing, and the live classroom without dropping back into a single scroll."
    />
  );
}
