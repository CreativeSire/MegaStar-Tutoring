import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the MegaStar Tutoring team. We're here to help with any questions about our tutoring services.",
};

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: "support@megastartutoring.co.uk",
    description: "We typically respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    details: "+44 (0) 20 7123 4567",
    description: "Mon-Fri, 9am-6pm GMT",
  },
  {
    icon: MapPin,
    title: "Office",
    details: "London, United Kingdom",
    description: "Available for in-person consultations",
  },
  {
    icon: Clock,
    title: "Support Hours",
    details: "24/7 Online Support",
    description: "For urgent tutoring inquiries",
  },
];

const faqs = [
  {
    question: "How quickly can I start tutoring?",
    answer: "Most students are matched with a tutor within 24-48 hours of signing up. You can start your first free session as soon as you're matched.",
  },
  {
    question: "What if I'm not happy with my tutor?",
    answer: "No problem! We offer free tutor switching. Just let us know and we'll match you with a new tutor who better fits your learning style.",
  },
  {
    question: "Do you offer group sessions?",
    answer: "Yes! We offer small group sessions for 2-4 students at a discounted rate. Contact us to learn more about group tutoring options.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-50 pt-32 pb-20">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow mb-6">Contact Us</span>
            <h1 className="text-display-2 mb-6 text-navy">
              We&apos;d love to hear from{" "}
              <span className="gradient-text">you</span>
            </h1>
            <p className="text-body-large mx-auto max-w-2xl text-navy-500">
              Have questions about our tutoring services? Our team is here to help 
              you find the perfect learning solution.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item) => (
              <Card key={item.title} className="text-center">
                <CardContent className="pt-8">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-coral-50 text-coral">
                    <item.icon size={28} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-navy">{item.title}</h3>
                  <p className="mb-1 font-semibold text-navy-800">{item.details}</p>
                  <p className="text-sm text-navy-500">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-navy-50">
        <div className="container-premium">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Form */}
            <div>
              <span className="eyebrow mb-4">Send us a message</span>
              <h2 className="text-heading-1 mb-6 text-navy">Get in touch</h2>
              <p className="mb-8 text-navy-500">
                Fill out the form below and our team will get back to you within 24 hours. 
                For urgent inquiries, please call us directly.
              </p>
              <ContactForm />
            </div>

            {/* FAQ */}
            <div>
              <span className="eyebrow mb-4">Quick answers</span>
              <h2 className="text-heading-1 mb-6 text-navy">Frequently asked questions</h2>
              <div className="space-y-6">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl bg-white p-6 shadow-soft">
                    <h3 className="mb-2 text-lg font-bold text-navy">{faq.question}</h3>
                    <p className="text-navy-500">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white">
        <div className="h-96 w-full bg-navy-100">
          {/* Placeholder for map - would integrate Google Maps or similar */}
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-4 text-coral" />
              <p className="text-lg font-semibold text-navy">MegaStar Tutoring HQ</p>
              <p className="text-navy-500">London, United Kingdom</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
