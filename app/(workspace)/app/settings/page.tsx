import { requireActor } from "@/lib/current-actor";
import { isAppDatabaseReady } from "@/lib/repository";

export default async function SettingsPage() {
  const actor = await requireActor();
  const databaseReady = isAppDatabaseReady();
  const googleClientConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  const clerkReady = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

  return (
    <section className="panel">
      <h2>Workspace settings</h2>
      <p className="stat-label">A quick place to check the tools that power your tutoring setup.</p>
      <div className="workspace-grid cols-2">
        <div className="list-card">
          <strong>Current role</strong>
          <span>{actor.role}</span>
        </div>
        <div className="list-card">
          <strong>Authentication</strong>
          <span>{clerkReady ? "Sign-in is ready" : "Set Clerk env vars in Vercel and .env.local"}</span>
        </div>
        <div className="list-card">
          <strong>Database</strong>
          <span>{databaseReady ? "Connected to the database" : "Add DATABASE_URL to switch from demo mode to real storage"}</span>
        </div>
        <div className="list-card">
          <strong>Google Calendar</strong>
          <span>{googleClientConfigured ? "Calendar sync is ready" : "Set NEXT_PUBLIC_GOOGLE_CLIENT_ID for live sync"}</span>
        </div>
        <div className="list-card">
          <strong>Privacy</strong>
          <span>Each client stays isolated in its own work log and invoice export.</span>
        </div>
        <div className="list-card">
          <strong>Roles</strong>
          <span>Use the admin editor to set each person as tutor, client, or admin.</span>
        </div>
      </div>
    </section>
  );
}
