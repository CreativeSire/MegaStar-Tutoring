import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for MegaStar Tutoring.",
};

const sections = [
  {
    title: "What cookies are",
    text: "Cookies are small files that help a website remember settings and keep basic features working smoothly.",
  },
  {
    title: "How we use them",
    text: "We use cookies for essential site functions, helpful analytics, and basic preferences.",
  },
  {
    title: "Managing cookies",
    text: "You can change cookie settings in your browser at any time. Turning them off may affect some parts of the site.",
  },
  {
    title: "Contact",
    text: "If you have a question about cookies or privacy, please email privacy@megastartutoring.co.uk.",
  },
];

export default function CookiesPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-navy-50 via-white to-coral-50/50 pt-32 pb-16">
        <div className="container-premium">
          <PageIntro
            eyebrow="Legal"
            title="Cookie Policy"
            description="A simple look at how cookies help MegaStar Tutoring work well."
            aside={
              <div className="space-y-4">
                <Card className="border-navy-100 bg-white/90 shadow-soft">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                      Easy summary
                    </p>
                    <p className="text-sm leading-6 text-navy-500">
                      Cookies help the site remember a few useful settings and keep things smooth.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-navy-100 bg-white/90 shadow-soft">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                      Need help?
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
                Clear and simple
              </Badge>
              <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                Browser-based controls
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
