import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the MegaStar Tutoring team. We're here to help with any questions about tutoring, lessons, or support.",
};

const contactInfo = [
  {
    title: "Email",
    details: "support@megastartutoring.co.uk",
    description: "We typically reply within one working day.",
  },
  {
    title: "Phone",
    details: "+44 (0) 20 7123 4567",
    description: "Mon-Fri, 9am-6pm GMT",
  },
  {
    title: "Office",
    details: "London, United Kingdom",
    description: "Online-first with in-person support by request.",
  },
  {
    title: "Support hours",
    details: "24/7 online help",
    description: "For urgent questions about lessons or access.",
  },
];

const faqs = [
  {
    question: "How quickly can I start tutoring?",
    answer:
      "Most families are matched with a tutor within 24–48 hours. You can often begin as soon as a suitable tutor is found.",
  },
  {
    question: "What if my tutor isn’t the right fit?",
    answer:
      "We can rematch you. The goal is always to make the experience feel comfortable and effective.",
  },
  {
    question: "Do you offer group sessions?",
    answer:
      "Yes — small group sessions are available for some subjects. If that’s the best fit, we’ll let you know.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-navy-50 via-white to-coral-50/50 pt-32 pb-20">
        <div className="container-premium">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <span className="eyebrow mb-6">Contact</span>
              <h1 className="text-display-2 mb-6 text-navy">
                We’d love to hear from{" "}
                <span className="gradient-text">you</span>
              </h1>
              <p className="text-body-large max-w-2xl text-navy-500">
                If you&apos;d like help choosing a tutor, setting up lessons, or
                understanding how MegaStar works, our team is ready to help.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                  Friendly support
                </Badge>
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                  Quick replies
                </Badge>
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                  Simple next steps
                </Badge>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[32px] shadow-strong">
                <Image
                  src="/visuals/hero-classroom.svg"
                  alt="Support team helping a family"
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 left-8 right-8 hidden rounded-[28px] border border-white/50 bg-white/95 p-5 shadow-soft backdrop-blur md:block">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                      Reply time
                    </p>
                    <p className="mt-1 text-lg font-semibold text-navy">
                      Within 24 hours
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                      Best for
                    </p>
                    <p className="mt-1 text-lg font-semibold text-navy">
                      Lessons, help, and updates
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                      Support
                    </p>
                    <p className="mt-1 text-lg font-semibold text-navy">
                      Clear and friendly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item) => (
              <Card key={item.title} className="border-navy-100 bg-navy-50/50 shadow-soft">
                <CardContent className="space-y-3 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                    {item.title}
                  </p>
                  <p className="text-lg font-bold text-navy">{item.details}</p>
                  <p className="text-sm leading-6 text-navy-500">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-premium">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="eyebrow mb-4">Send a note</span>
              <h2 className="text-heading-1 mb-6 text-navy">Tell us what you need</h2>
              <p className="mb-8 max-w-2xl text-navy-500">
                Whether you&apos;re ready to start or just want to ask a few
                questions, send us a message and we&apos;ll help you find the
                best path forward.
              </p>
              <Card className="border-white/70 bg-white/85 shadow-soft backdrop-blur">
                <CardContent className="p-6 sm:p-8">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="overflow-hidden border-navy-100 shadow-soft">
                <div className="relative h-56">
                  <Image
                    src="/visuals/hero-classroom.svg"
                    alt="Friendly tutor helping a student"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="space-y-3 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                    Helpful start
                  </p>
                  <p className="text-2xl font-bold text-navy">A calm way to begin</p>
                  <p className="text-navy-500">
                    We&apos;ll help you choose the right tutor, the right pace, and the
                    right schedule without making the process feel heavy.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {faqs.map((faq) => (
                  <Card key={faq.question} className="border-navy-100 bg-white shadow-soft">
                    <CardContent className="space-y-2 p-6">
                      <h3 className="text-lg font-bold text-navy">{faq.question}</h3>
                      <p className="text-sm leading-6 text-navy-500">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

