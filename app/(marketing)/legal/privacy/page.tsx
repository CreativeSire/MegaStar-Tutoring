import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for MegaStar Tutoring.",
};

const sections = [
  {
    title: "1. Information we collect",
    text: "We collect your name, email, booking details, lesson preferences, and payment information so we can run the service well.",
  },
  {
    title: "2. How we use your data",
    text: "We use your data to match students with tutors, manage lessons, handle invoices, and improve the experience over time.",
  },
  {
    title: "3. Your choices",
    text: "You can ask to access, update, or delete your personal data whenever you need to.",
  },
  {
    title: "4. Contact",
    text: "Email privacy@megastartutoring.co.uk if you would like to ask a question about privacy.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-navy-50 via-white to-coral-50/50 pt-32 pb-16">
        <div className="container-premium">
          <PageIntro
            eyebrow="Legal"
            title="Privacy Policy"
            description="A simple overview of how we handle information at MegaStar Tutoring."
            aside={
              <div className="space-y-4">
                <Card className="border-navy-100 bg-white/90 shadow-soft">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                      Last updated
                    </p>
                    <p className="text-lg font-bold text-navy">31 March 2026</p>
                  </CardContent>
                </Card>
                <Card className="border-navy-100 bg-white/90 shadow-soft">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                      Need help?
                    </p>
                    <p className="text-sm leading-6 text-navy-500">
                      Our support team can help if you have a question about your data.
                    </p>
                    <Button asChild size="sm" className="rounded-full">
                      <Link href="/contact">Contact us</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            }
          >
            <div className="flex flex-wrap gap-3">
              <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                Clear summary
              </Badge>
              <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                Private records
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
