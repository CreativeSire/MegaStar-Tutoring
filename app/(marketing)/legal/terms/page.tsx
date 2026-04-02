import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for MegaStar Tutoring.",
};

const sections = [
  {
    title: "1. Introduction",
    text: "By using MegaStar Tutoring, you agree to follow these terms so the service can stay fair and easy to use.",
  },
  {
    title: "2. Eligibility",
    text: "Students should be of a suitable age to use the service, and younger learners may need parental support.",
  },
  {
    title: "3. Account details",
    text: "Please keep your account details accurate and make sure your login stays private.",
  },
  {
    title: "4. Payments and refunds",
    text: "Refunds and cancellations depend on timing and lesson rules. We keep this simple and clear on each booking.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-navy-50 via-white to-coral-50/50 pt-32 pb-16">
        <div className="container-premium">
          <PageIntro
            eyebrow="Legal"
            title="Terms of Service"
            description="The simple rules that help lessons stay clear, fair, and easy to follow."
            aside={
              <div className="space-y-4">
                <Card className="border-navy-100 bg-white/90 shadow-soft">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                      Quick note
                    </p>
                    <p className="text-sm leading-6 text-navy-500">
                      If anything is unclear, our team can explain it before you get started.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-navy-100 bg-white/90 shadow-soft">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                      Contact
                    </p>
                    <p className="text-sm leading-6 text-navy-500">
                      legal@megastartutoring.co.uk
                    </p>
                    <Button asChild size="sm" className="rounded-full">
                      <Link href="/contact">Ask a question</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            }
          >
            <div className="flex flex-wrap gap-3">
              <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                Simple terms
              </Badge>
              <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                Easy to read
              </Badge>
            </div>
          </PageIntro>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="grid gap-6 lg:grid-cols-2">
            {sections.map((section) => (
              <Card key={section.title} className="border-navy-100 shadow-soft">
                <CardContent className="space-y-3 p-6">
                  <h2 className="text-2xl font-bold text-navy">{section.title}</h2>
                  <p className="text-navy-600">{section.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
