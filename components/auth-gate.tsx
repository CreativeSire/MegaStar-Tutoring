import type { ReactNode } from "react";

type AuthGateProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
  noteTitle: string;
  noteBody: ReactNode;
};

export function AuthGate({ eyebrow, title, description, noteTitle, noteBody }: AuthGateProps) {
  return (
    <main className="auth-shell">
      <section className="panel auth-panel">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="auth-callout">
          <strong>{noteTitle}</strong>
          <span>{noteBody}</span>
        </div>
      </section>
    </main>
  );
}
