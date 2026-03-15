import { useState } from 'react';
import { appApi } from '../api/appApi';

const defaultEndpoints = [
  'GET /api/state',
  'GET /api/cars',
  'GET /api/reservations',
  'GET /api/offers',
  'GET /api/availability?date=YYYY-MM-DD',
  'POST /api/offers',
  'POST /api/cars',
  'PATCH /api/cars/:id/base-price',
  'PATCH /api/cars/:id/seasonal-multiplier',
  'PATCH /api/reservations/:id/status',
  'POST /api/reset',
];

export const ApiLabPage = () => {
  const [result, setResult] = useState('');

  const runSmokeTest = async () => {
    const state = await appApi.getState();
    const cars = await appApi.getAvailability('2026-06-14');

    setResult(
      JSON.stringify(
        {
          check: 'smoke-test-success',
          totalCars: state.cars.length,
          reservations: state.reservations.length,
          offers: state.offers.length,
          availableOn_2026_06_14: cars.map((car) => car.name),
        },
        null,
        2,
      ),
    );
  };

  const createDemoOffer = async () => {
    const state = await appApi.getState();
    const carId = state.cars[0]?.id;

    if (!carId) {
      setResult(JSON.stringify({ error: 'No cars found' }, null, 2));
      return;
    }

    await appApi.createOffer({
      customerName: 'Demo Customer',
      email: 'demo@chauffeur.app',
      date: '2026-07-12',
      carId,
      guests: 2,
      eventType: 'Wedding',
      message: 'Generated from API Lab',
    });

    const offers = await appApi.getState();
    setResult(JSON.stringify({ check: 'offer-created', totalOffers: offers.offers.length }, null, 2));
  };

  return (
    <section className="panel stack">
      <h1>Mock API Lab</h1>
      <p className="muted">
        Validate endpoint behavior before backend integration. This page helps QA test request flows during frontend-only development.
      </p>

      <ul className="offer-list">
        {defaultEndpoints.map((endpoint) => (
          <li key={endpoint}>{endpoint}</li>
        ))}
      </ul>

      <div className="cta-group">
        <button type="button" className="button primary" onClick={() => void runSmokeTest()}>
          Run smoke test
        </button>
        <button type="button" className="button tertiary" onClick={() => void createDemoOffer()}>
          Create demo offer
        </button>
        <button type="button" className="button secondary" onClick={() => void appApi.reset()}>
          Reset API dataset
        </button>
      </div>

      {result && (
        <pre className="code-block" aria-label="api-smoke-test-result">
          {result}
        </pre>
      )}
    </section>
  );
};
