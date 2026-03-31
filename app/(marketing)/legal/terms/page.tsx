import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for MegaStar Tutoring.",
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      <section className="bg-navy-50 pt-32 pb-16">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow mb-6">Legal</span>
            <h1 className="text-display-2 text-navy">Terms of Service</h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="mx-auto max-w-4xl space-y-12">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">1. Introduction</h2>
              <p className="text-navy-600">Welcome to MegaStar Tutoring. By accessing or using our services, you agree to be bound by these Terms of Service.</p>
            </div>
            
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">2. Eligibility</h2>
              <p className="text-navy-600">You must be at least 16 years old to use our Services. Students under 18 require parental consent.</p>
            </div>
            
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">3. Account Registration</h2>
              <p className="text-navy-600">You must provide accurate information during registration and keep your account secure.</p>
            </div>
            
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">4. Payment and Refunds</h2>
              <p className="text-navy-600">Full refund for cancellations 24+ hours before session. No refund for late cancellations or no-shows.</p>
            </div>
            
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">5. Contact</h2>
              <p className="text-navy-600">Email: legal@megastartutoring.co.uk</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
