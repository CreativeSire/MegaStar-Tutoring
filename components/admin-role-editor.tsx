"use client";

import { useMemo, useState, useTransition } from "react";

type Profile = {
  id: string;
  clerkUserId: string;
  email: string | null;
  displayName: string;
  role: "tutor" | "client" | "admin";
  createdAt: Date | string;
};

type AdminRoleEditorProps = {
  profiles: Profile[];
};

const roleOptions: Array<Profile["role"]> = ["tutor", "client", "admin"];

export function AdminRoleEditor({ profiles }: AdminRoleEditorProps) {
  const [items, setItems] = useState(profiles);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(
    () =>
      items.reduce(
        (accumulator, item) => {
          accumulator[item.role] += 1;
          return accumulator;
        },
        { tutor: 0, client: 0, admin: 0 },
      ),
    [items],
  );

  async function updateRole(clerkUserId: string, role: Profile["role"]) {
    setError(null);
    setPendingId(clerkUserId);

    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ clerkUserId, role }),
    });

    const payload = (await response.json()) as { profile?: Profile; error?: string };
    if (!response.ok) {
      throw new Error(payload.error || "Role update failed.");
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.clerkUserId === clerkUserId ? { ...item, role: payload.profile?.role || role } : item)),
    );
  }

  return (
    <section className="panel">
      <div className="section-head compact">
        <div>
          <h2>Role editor</h2>
          <p>Update tutor, client, and admin assignments without touching Clerk metadata by hand.</p>
        </div>
        <div className="workspace-badge">{counts.admin} admins</div>
      </div>

      <div className="workspace-grid cols-3" style={{ marginBottom: "1rem" }}>
        <div className="list-card">
          <strong>Tutors</strong>
          <span>{counts.tutor}</span>
        </div>
        <div className="list-card">
          <strong>Clients</strong>
          <span>{counts.client}</span>
        </div>
        <div className="list-card">
          <strong>Admins</strong>
          <span>{counts.admin}</span>
        </div>
      </div>

      <div className="admin-table">
        <div className="admin-table-head">
          <span>Person</span>
          <span>Email</span>
          <span>Current role</span>
          <span>Change role</span>
        </div>
        {items.map((profile) => (
          <div key={profile.clerkUserId} className="admin-table-row">
            <div>
              <strong>{profile.displayName}</strong>
              <div className="table-subtle">Signed up {new Date(profile.createdAt).toLocaleDateString()}</div>
            </div>
            <div>{profile.email || "No email"}</div>
            <div>
              <span className={`pill ${profile.role === "admin" ? "success" : profile.role === "client" ? "neutral" : "warning"}`}>{profile.role}</span>
            </div>
            <div className="admin-role-controls">
              <select
                aria-label={`Change role for ${profile.displayName}`}
                value={profile.role}
                disabled={isPending && pendingId === profile.clerkUserId}
                onChange={(event) => {
                  const nextRole = event.target.value as Profile["role"];
                  if (nextRole === profile.role) {
                    return;
                  }
                  startTransition(() => {
                    void updateRole(profile.clerkUserId, nextRole).catch((caughtError: unknown) => {
                      setError(caughtError instanceof Error ? caughtError.message : "Role update failed.");
                    }).finally(() => setPendingId(null));
                  });
                }}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {error ? <p className="form-feedback" style={{ color: "var(--danger)" }}>{error}</p> : null}
    </section>
  );
}
