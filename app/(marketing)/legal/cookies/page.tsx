import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for MegaStar Tutoring.",
};

export default function CookiesPage() {
  return (
    <div className="bg-white">
      <section className="bg-navy-50 pt-32 pb-16">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow mb-6">Legal</span>
            <h1 className="text-display-2 text-navy">Cookie Policy</h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="mx-auto max-w-4xl space-y-12">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">What Are Cookies</h2>
              <p className="text-navy-600">Cookies are small text files stored on your device when you visit our website. They help us provide and improve our services.</p>
            </div>
            
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">How We Use Cookies</h2>
              <ul className="list-disc space-y-2 pl-5 text-navy-600">
                <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </div>
            
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">Managing Cookies</h2>
              <p className="text-navy-600">You can control cookies through your browser settings. Please note that disabling cookies may affect website functionality.</p>
            </div>
            
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy">Contact</h2>
              <p className="text-navy-600">Email: privacy@megastartutoring.co.uk</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
