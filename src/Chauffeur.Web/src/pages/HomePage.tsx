import { Link } from 'react-router-dom';

const mustHaveFeatures = [
  'Live availability by date',
  'Offer request workflow with event context',
  'Manager reservation control panel',
  'Seasonal pricing controls per car',
];

const niceToHaveFeatures = [
  'Smart quote preview before submitting',
  'Fleet filters (category, seats, budget)',
  'Manager insights (utilization and demand)',
  'Mock API lab for endpoint validation',
];

export const HomePage = () => (
  <div className="stack">
    <section className="hero hero-modern">
      <p className="badge">Premium event mobility platform</p>
      <h1>Book Vintage & Exotic Cars with a Luxury-First Experience</h1>
      <p>
        Chauffeur Classics helps couples and event teams secure dream vehicles with
        transparent pricing, date-based availability, and modern management tools.
      </p>
      <div className="cta-group">
        <Link to="/customer" className="button primary">
          Start booking
        </Link>
        <Link to="/manager" className="button secondary">
          Open manager suite
        </Link>
        <Link to="/api-lab" className="button tertiary">
          Test mock endpoints
        </Link>
      </div>
    </section>

    <section className="panel">
      <h2>Must-have capabilities (implemented)</h2>
      <div className="pill-list">
        {mustHaveFeatures.map((feature) => (
          <span key={feature} className="pill">
            ✅ {feature}
          </span>
        ))}
      </div>
    </section>

    <section className="panel">
      <h2>Nice-to-have capabilities (implemented)</h2>
      <div className="pill-list">
        {niceToHaveFeatures.map((feature) => (
          <span key={feature} className="pill pill-accent">
            ✨ {feature}
          </span>
        ))}
      </div>
    </section>
  </div>
);
