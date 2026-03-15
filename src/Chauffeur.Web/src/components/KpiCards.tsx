interface KpiCardsProps {
  totalCars: number;
  availableCars: number;
  pendingOffers: number;
  pendingReservations: number;
}

export const KpiCards = ({
  totalCars,
  availableCars,
  pendingOffers,
  pendingReservations,
}: KpiCardsProps) => (
  <section className="kpi-grid">
    <div className="kpi-card">
      <h4>Fleet</h4>
      <p>{totalCars} cars</p>
    </div>
    <div className="kpi-card">
      <h4>Available</h4>
      <p>{availableCars} available today</p>
    </div>
    <div className="kpi-card">
      <h4>Offer Requests</h4>
      <p>{pendingOffers} total</p>
    </div>
    <div className="kpi-card">
      <h4>Pending Reservations</h4>
      <p>{pendingReservations} awaiting decision</p>
    </div>
  </section>
);
