import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  actions,
}: SectionHeadingProps) => (
  <div className="section-heading">
    <div>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p className="section-copy">{description}</p> : null}
    </div>
    {actions ? <div className="section-actions">{actions}</div> : null}
  </div>
);
