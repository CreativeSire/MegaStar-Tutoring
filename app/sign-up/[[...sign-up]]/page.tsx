import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="auth-shell">
        <section className="panel auth-panel">
          <span className="eyebrow">Create account</span>
          <h1>Auth is waiting for Clerk keys.</h1>
          <p>
            New users can sign up once Clerk is connected in Vercel. For now, the site stays open so we can keep
            testing the rest of the product safely.
          </p>
          <div className="auth-callout">
            <strong>Need to finish setup?</strong>
            <span>
              Add <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code> in Vercel.
            </span>
          </div>
        </section>
      </main>
    );
  }

  return <SignUp />;
}
