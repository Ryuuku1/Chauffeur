import type { ReactNode } from 'react';
import type { Car } from '../types/domain';
import { calculatePriceForDate } from '../utils/pricing';

interface CarCardProps {
  car: Car;
  selectedDate: string;
  actions?: ReactNode;
}

export const CarCard = ({ car, selectedDate, actions }: CarCardProps) => {
  const displayPrice = selectedDate
    ? `$${calculatePriceForDate(car, selectedDate)}`
    : `$${car.price.basePrice}`;

  return (
    <article className="card">
      <img src={car.imageUrl} alt={car.name} className="card-image" />
      <div className="card-content">
        <h3>{car.name}</h3>
        <p className="muted">
          {car.year} • {car.category} • {car.seats} seats
        </p>
        <p>{car.description}</p>
        <p className="price">From {displayPrice}</p>
        {actions}
      </div>
    </article>
  );
};
