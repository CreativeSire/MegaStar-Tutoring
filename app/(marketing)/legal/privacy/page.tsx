import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for MegaStar Tutoring.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <section className="bg-navy-50 pt-32 pb-16">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow mb-6">Legal</span>
            <h1 className="text-display-2 text-navy">Privacy Policy</h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="mx-auto max-w-4xl space-y-12">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">1. Information We Collect</h2>
              <p className="text-navy-600">We collect name, email, payment information, and educational preferences to provide our tutoring services.</p>
            </div>
            
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">2. How We Use Your Data</h2>
              <p className="text-navy-600">We use your data to match you with tutors, process payments, and improve our services.</p>
            </div>
            
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">3. Your Rights</h2>
              <p className="text-navy-600">You have the right to access, modify, or delete your personal data at any time.</p>
            </div>
            
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">4. Contact</h2>
              <p className="text-navy-600">Email: privacy@megastartutoring.co.uk</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
