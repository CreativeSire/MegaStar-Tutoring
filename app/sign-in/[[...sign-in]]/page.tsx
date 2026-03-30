import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="auth-shell">
        <section className="panel auth-panel">
          <span className="eyebrow">Sign in</span>
          <h1>Auth is waiting for Clerk keys.</h1>
          <p>
            The app is ready for sign-in, but the Vercel deployment still needs the Clerk public and secret keys.
            Once they&apos;re added, this page will switch to the live sign-in flow automatically.
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

  return <SignIn />;
}
