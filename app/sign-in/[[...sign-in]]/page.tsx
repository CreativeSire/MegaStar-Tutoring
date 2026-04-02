import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";
import { AuthGate } from "@/components/auth-gate";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <AuthGate
        eyebrow="Sign in"
        title="Auth is waiting for Clerk keys."
        description={
          <>
            The app is ready for sign-in, but the Vercel deployment still needs the Clerk public and secret keys.
            Once they&apos;re added, this page will switch to the live sign-in flow automatically.
          </>
        }
        noteTitle="Need to finish setup?"
        noteBody={
          <>
            Add <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code> in Vercel.
          </>
        }
      />
    );
  }

  return <SignIn />;
}
