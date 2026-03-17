interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
}

export const MetricCard = ({ label, value, trend }: MetricCardProps) => (
  <article className="metric-card">
    <span className="metric-label">{label}</span>
    <strong className="metric-value">{value}</strong>
    <span className="metric-trend">{trend}</span>
  </article>
);
