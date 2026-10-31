import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const SEATS_KEY = 'techfest-event-seats';

function readSeats(event) {
  const saved = JSON.parse(localStorage.getItem(SEATS_KEY) || '{}');
  return Number.isInteger(saved[event.id]) ? saved[event.id] : event.seats;
}

export default function EventCard({ event, featured = false }) {
  const [seatsLeft, setSeatsLeft] = useState(() => readSeats(event));
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();
  const soldOut = seatsLeft === 0;

  const reserveSeat = () => {
    if (soldOut) return;
    addToCart(event);
    const nextSeats = seatsLeft - 1;
    setSeatsLeft(nextSeats);
    localStorage.setItem(SEATS_KEY, JSON.stringify({
      ...JSON.parse(localStorage.getItem(SEATS_KEY) || '{}'),
      [event.id]: nextSeats
    }));
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article className={`event-card ${featured ? 'event-card-featured' : ''}`}>
      <Link className="event-image-wrap" to={`/register/${event.id}`} aria-label={`View ${event.title}`}>
        <img className="event-image" src={event.image} alt="" loading="lazy" />
        <span className="event-tag">{event.tag}</span>
        <span className="event-image-arrow"><ArrowUpRight size={19} /></span>
      </Link>
      <div className="event-card-body">
        <div className="event-category">{event.category}</div>
        <h3><Link to={`/register/${event.id}`}>{event.title}</Link></h3>
        <p className="event-description">{event.description}</p>
        <div className="event-meta">
          <span><CalendarDays size={15} /> {event.date}</span>
          <span><MapPin size={15} /> Innovation campus</span>
        </div>
        <div className="event-card-bottom">
          <div><strong className="event-fee">₹{event.fee}</strong><span className="seat-note">{soldOut ? 'No seats left' : `${seatsLeft} seats left`}</span></div>
          <button className={`button button-small ${soldOut ? 'button-disabled' : 'button-outline'}`} disabled={soldOut} onClick={reserveSeat}>
            {soldOut ? 'SOLD OUT' : justAdded ? 'Added ✓' : 'Reserve seat'}
          </button>
        </div>
      </div>
    </article>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    fee: PropTypes.number.isRequired,
    seats: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  featured: PropTypes.bool
};
