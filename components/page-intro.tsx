import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  aside?: ReactNode;
};

export function PageIntro({ eyebrow, title, description, children, aside }: PageIntroProps) {
  return (
    <section className="panel page-intro">
      <div className="page-intro-grid">
        <div className="page-intro-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
          {children ? <div className="page-intro-actions">{children}</div> : null}
        </div>
        {aside ? <div className="page-intro-aside">{aside}</div> : null}
      </div>
    </section>
  );
}
