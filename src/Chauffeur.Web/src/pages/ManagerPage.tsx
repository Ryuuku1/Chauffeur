import { useMemo, useState } from 'react';
import { KpiCards } from '../components/KpiCards';
import { useAppContext } from '../context/AppContext';
import type { Season } from '../types/domain';
import { formatDate } from '../utils/dateUtils';

const seasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];

export const ManagerPage = () => {
  const {
    cars,
    reservations,
    offers,
    addCar,
    updateBasePrice,
    updateSeasonMultiplier,
    setReservationStatus,
    resetState,
    isLoading,
    error,
  } = useAppContext();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Vintage' | 'Exotic'>('Vintage');
  const [year, setYear] = useState(1960);
  const [seats, setSeats] = useState(4);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(500);
  const [reservationFilter, setReservationFilter] = useState<'All' | 'Pending' | 'Approved' | 'Declined'>('All');

  const today = new Date().toISOString().slice(0, 10);

  const availableToday = useMemo(
    () =>
      cars.filter(
        (car) =>
          !reservations.some(
            (reservation) =>
              reservation.carId === car.id &&
              reservation.date === today &&
              reservation.status !== 'Declined',
          ),
      ).length,
    [cars, reservations, today],
  );

  const utilization = cars.length === 0 ? 0 : Math.round(((cars.length - availableToday) / cars.length) * 100);

  const upcomingReservations = useMemo(
    () =>
      reservations
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .filter((reservation) => reservation.status !== 'Declined')
        .slice(0, 6),
    [reservations],
  );

  const filteredReservations = useMemo(
    () =>
      reservationFilter === 'All'
        ? reservations
        : reservations.filter((reservation) => reservation.status === reservationFilter),
    [reservationFilter, reservations],
  );

  const mostCommonEventType = useMemo(() => {
    if (reservations.length === 0) return 'N/A';

    const score = reservations.reduce<Record<string, number>>((acc, current) => {
      acc[current.eventType] = (acc[current.eventType] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
  }, [reservations]);

  const applySeasonPreset = async (preset: 'Peak Summer' | 'Balanced') => {
    const multipliers: Record<Season, number> =
      preset === 'Peak Summer'
        ? { Spring: 1, Summer: 1.4, Autumn: 1.05, Winter: 0.9 }
        : { Spring: 0.95, Summer: 1.2, Autumn: 1.05, Winter: 0.95 };

    await Promise.all(
      cars.flatMap((car) =>
        seasons.map((season) => updateSeasonMultiplier(car.id, season, multipliers[season])),
      ),
    );
  };

  return (
    <div className="stack">
      <section className="panel panel-highlight">
        <h1>Manager Operations Center</h1>
        <p className="muted">
          Manage pricing, optimize occupancy, and review demand signals from customers in one place.
        </p>
        {isLoading && <p className="muted">Syncing with mock API…</p>}
        {error && <p className="error">{error}</p>}
        <div className="cta-group">
          <button type="button" className="button secondary" onClick={() => void resetState()}>
            Reset Mock API Data
          </button>
          <button type="button" className="button tertiary" onClick={() => void applySeasonPreset('Peak Summer')}>
            Apply peak summer preset
          </button>
          <button type="button" className="button tertiary" onClick={() => void applySeasonPreset('Balanced')}>
            Apply balanced preset
          </button>
        </div>
      </section>

      <KpiCards
        totalCars={cars.length}
        availableCars={availableToday}
        pendingOffers={offers.length}
        pendingReservations={reservations.filter((r) => r.status === 'Pending').length}
      />

      <section className="panel insights-grid">
        <div>
          <p className="muted">Fleet utilization today</p>
          <h3>{utilization}%</h3>
        </div>
        <div>
          <p className="muted">Top event segment</p>
          <h3>{mostCommonEventType}</h3>
        </div>
        <div>
          <p className="muted">Upcoming confirmed/pending rides</p>
          <h3>{upcomingReservations.length}</h3>
        </div>
      </section>

      <section className="panel">
        <h2>Fleet pricing & seasonal strategy</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Base Price ($)</th>
                {seasons.map((season) => (
                  <th key={season}>{season} Multiplier</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>{car.name}</td>
                  <td>
                    <input
                      type="number"
                      min={100}
                      value={car.price.basePrice}
                      onChange={(event) => void updateBasePrice(car.id, Number(event.target.value))}
                    />
                  </td>
                  {seasons.map((season) => (
                    <td key={season}>
                      <input
                        type="number"
                        min={0.5}
                        max={2}
                        step={0.05}
                        value={car.price.seasonalMultipliers[season]}
                        onChange={(event) =>
                          void updateSeasonMultiplier(car.id, season, Number(event.target.value))
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Add car to fleet</h2>
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            void addCar({ name, category, year, seats, imageUrl, description, basePrice });
            setName('');
            setImageUrl('');
            setDescription('');
          }}
        >
          <label>
            Car name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as 'Vintage' | 'Exotic')}
            >
              <option>Vintage</option>
              <option>Exotic</option>
            </select>
          </label>
          <label>
            Year
            <input type="number" value={year} onChange={(event) => setYear(Number(event.target.value))} />
          </label>
          <label>
            Seats
            <input type="number" min={1} value={seats} onChange={(event) => setSeats(Number(event.target.value))} />
          </label>
          <label>
            Base price
            <input
              type="number"
              min={100}
              value={basePrice}
              onChange={(event) => setBasePrice(Number(event.target.value))}
            />
          </label>
          <label className="full-width">
            Image URL
            <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} required />
          </label>
          <label className="full-width">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              required
            />
          </label>
          <button type="submit" className="button primary">
            Add car
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Reservations</h2>
          <select
            value={reservationFilter}
            onChange={(event) =>
              setReservationFilter(event.target.value as 'All' | 'Pending' | 'Approved' | 'Declined')
            }
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Declined</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Event</th>
                <th>Date</th>
                <th>Car</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.customerName}</td>
                  <td>{reservation.eventType}</td>
                  <td>{formatDate(reservation.date)}</td>
                  <td>{cars.find((car) => car.id === reservation.carId)?.name ?? reservation.carId}</td>
                  <td>
                    <select
                      value={reservation.status}
                      onChange={(event) =>
                        void setReservationStatus(
                          reservation.id,
                          event.target.value as 'Pending' | 'Approved' | 'Declined',
                        )
                      }
                    >
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Declined</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Upcoming schedule</h2>
        <ul className="offer-list">
          {upcomingReservations.map((reservation) => (
            <li key={reservation.id}>
              <strong>{formatDate(reservation.date)}</strong> — {reservation.customerName} ({reservation.eventType})
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Offer requests inbox</h2>
        {offers.length === 0 ? (
          <p className="muted">No offer requests yet.</p>
        ) : (
          <ul className="offer-list">
            {offers.map((offer) => (
              <li key={offer.id}>
                <h3>
                  {offer.customerName} — {formatDate(offer.date)}
                </h3>
                <p>
                  {offer.eventType}, {offer.guests} guests, email: {offer.email}
                </p>
                {offer.message && <p className="muted">“{offer.message}”</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
