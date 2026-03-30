import { PageIntro } from "@/components/page-intro";
import { requireActor } from "@/lib/current-actor";
import { isAppDatabaseReady } from "@/lib/repository";

export default async function SettingsPage() {
  const actor = await requireActor();
  const databaseReady = isAppDatabaseReady();
  const googleClientConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  const clerkReady = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Account"
        title="Check the basics in one place."
        description="See whether sign-in, saved records, and calendar sync are ready."
        aside={
          <>
            <div className="list-card">
              <strong>{actor.role}</strong>
              <span>Current access</span>
            </div>
            <div className="list-card">
              <strong>{clerkReady ? "Ready" : "Not set yet"}</strong>
              <span>Sign-in</span>
            </div>
            <div className="list-card">
              <strong>{databaseReady ? "Ready" : "Demo mode"}</strong>
              <span>Saved records</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">{googleClientConfigured ? "Calendar linked" : "Calendar not linked"}</span>
        <span className="pill neutral">Private by design</span>
        <span className="pill neutral">Role-based access</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Quick checks</h2>
          <p className="stat-label">A simple read on the tools that power the app.</p>
          <div className="workspace-grid cols-2">
            <div className="list-card">
              <strong>Sign-in</strong>
              <span>{clerkReady ? "Ready to use" : "Set the Clerk keys in Vercel and .env.local"}</span>
            </div>
            <div className="list-card">
              <strong>Saved records</strong>
              <span>{databaseReady ? "Connected to the live database" : "Add DATABASE_URL to turn on live storage"}</span>
            </div>
            <div className="list-card">
              <strong>Calendar sync</strong>
              <span>{googleClientConfigured ? "Ready for live sync" : "Set NEXT_PUBLIC_GOOGLE_CLIENT_ID for live sync"}</span>
            </div>
            <div className="list-card">
              <strong>Access</strong>
              <span>Use the admin page to set each person as tutor, student, or admin.</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2>Privacy</h2>
          <p className="stat-label">Each student stays separate, with its own lessons, messages, and invoices.</p>
          <div className="workspace-grid">
            <div className="list-card">
              <strong>Student records stay separate</strong>
              <span>No cross-student details appear in a private view.</span>
            </div>
            <div className="list-card">
              <strong>Calendar stays focused</strong>
              <span>Only the chosen account and calendar are touched.</span>
            </div>
            <div className="list-card">
              <strong>Exports stay private</strong>
              <span>Invoice files are built for one student at a time.</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
