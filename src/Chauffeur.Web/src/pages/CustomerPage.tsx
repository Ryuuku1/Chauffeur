import { useMemo, useState, type FormEvent } from 'react';
import { CarCard } from '../components/CarCard';
import { useAppContext } from '../context/AppContext';
import { useAvailability } from '../hooks/useAvailability';
import { calculatePriceForDate } from '../utils/pricing';

export const CustomerPage = () => {
  const { addOfferRequest, isLoading, error } = useAppContext();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(2);
  const [eventType, setEventType] = useState<'Wedding' | 'Engagement' | 'Photoshoot' | 'Corporate' | 'Other'>('Wedding');
  const [message, setMessage] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Vintage' | 'Exotic'>('All');
  const [minimumSeats, setMinimumSeats] = useState(1);
  const [maxBudget, setMaxBudget] = useState(1500);

  const availableCars = useAvailability(selectedDate);

  const filteredCars = useMemo(
    () =>
      availableCars.filter((car) => {
        const categoryMatch = categoryFilter === 'All' || car.category === categoryFilter;
        const seatsMatch = car.seats >= minimumSeats;
        const displayPrice = selectedDate ? calculatePriceForDate(car, selectedDate) : car.price.basePrice;
        return categoryMatch && seatsMatch && displayPrice <= maxBudget;
      }),
    [availableCars, categoryFilter, maxBudget, minimumSeats, selectedDate],
  );

  const selectedCar = filteredCars.find((car) => car.id === selectedCarId);
  const estimatedPrice = selectedCar && selectedDate ? calculatePriceForDate(selectedCar, selectedDate) : null;

  const canSubmit = useMemo(
    () => selectedDate && selectedCarId && customerName.trim() && email.trim(),
    [customerName, email, selectedCarId, selectedDate],
  );

  const submitOfferRequest = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    await addOfferRequest({
      customerName,
      email,
      date: selectedDate,
      carId: selectedCarId,
      guests,
      eventType,
      message,
    });

    setCustomerName('');
    setEmail('');
    setGuests(2);
    setMessage('');
    alert('Offer request submitted. A manager will contact you soon.');
  };

  return (
    <div className="stack">
      <section className="panel">
        <h2>Plan your event transportation</h2>
        {isLoading && <p className="muted">Loading from mock API…</p>}
        {error && <p className="error">{error}</p>}

        <div className="form-grid">
          <label>
            Event date
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setSelectedCarId('');
              }}
            />
          </label>
          <label>
            Category
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as 'All' | 'Vintage' | 'Exotic')}
            >
              <option value="All">All categories</option>
              <option value="Vintage">Vintage</option>
              <option value="Exotic">Exotic</option>
            </select>
          </label>
          <label>
            Minimum seats
            <input
              type="number"
              min={1}
              max={8}
              value={minimumSeats}
              onChange={(event) => setMinimumSeats(Number(event.target.value))}
            />
          </label>
          <label>
            Max budget (${maxBudget})
            <input
              type="range"
              min={250}
              max={2500}
              step={50}
              value={maxBudget}
              onChange={(event) => setMaxBudget(Number(event.target.value))}
            />
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Available cars</h2>
        {selectedDate ? (
          <p className="muted">{filteredCars.length} cars match your filters for the selected date.</p>
        ) : (
          <p className="muted">Choose a date to unlock live availability and seasonal pricing.</p>
        )}
        {filteredCars.length === 0 ? (
          <div className="empty-state">
            <p>No cars match these filters. Try increasing the budget or changing seat/category preferences.</p>
          </div>
        ) : (
          <div className="card-grid">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                selectedDate={selectedDate}
                actions={
                  <button
                    type="button"
                    className={`button ${selectedCarId === car.id ? 'primary' : 'secondary'}`}
                    onClick={() => setSelectedCarId(car.id)}
                  >
                    {selectedCarId === car.id ? 'Selected for quote' : 'Select for quote'}
                  </button>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="panel quick-quote">
        <h2>Quick quote snapshot</h2>
        {!selectedCar ? (
          <p className="muted">Select a car to preview your estimated event quote.</p>
        ) : (
          <div className="quote-grid">
            <div>
              <p className="muted">Selected car</p>
              <h3>{selectedCar.name}</h3>
            </div>
            <div>
              <p className="muted">Estimated day rate</p>
              <h3>{estimatedPrice ? `$${estimatedPrice}` : 'Choose date'}</h3>
            </div>
            <div>
              <p className="muted">Event type</p>
              <h3>{eventType}</h3>
            </div>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Request an offer</h2>
        <form className="form-grid" onSubmit={(event) => void submitOfferRequest(event)}>
          <label>
            Your name
            <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Event type
            <select
              value={eventType}
              onChange={(event) =>
                setEventType(event.target.value as 'Wedding' | 'Engagement' | 'Photoshoot' | 'Corporate' | 'Other')
              }
            >
              <option>Wedding</option>
              <option>Engagement</option>
              <option>Photoshoot</option>
              <option>Corporate</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Guests
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
            />
          </label>
          <label className="full-width">
            Message (optional)
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} />
          </label>
          <button type="submit" className="button primary" disabled={!canSubmit}>
            Submit offer request
          </button>
        </form>
      </section>
    </div>
  );
};
