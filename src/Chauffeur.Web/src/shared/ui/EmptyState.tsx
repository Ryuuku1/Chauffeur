import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="empty-state">
    <h3>{title}</h3>
    <p>{description}</p>
    {action ? <div>{action}</div> : null}
  </div>
);
