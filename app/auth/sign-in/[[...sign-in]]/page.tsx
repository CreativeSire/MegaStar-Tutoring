import { SignIn } from "@clerk/nextjs";
import { AuthGate } from "@/components/auth-gate";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function AuthSignInPage() {
  if (!isClerkConfigured()) {
    return (
      <AuthGate
        eyebrow="Sign in"
        title="Auth is waiting for Clerk keys."
        description={
          <>
            The blueprint includes a dedicated <code>/auth/sign-in</code> route, and the app is ready to use it once
            Clerk is wired in Vercel.
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
