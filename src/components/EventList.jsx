import PropTypes from 'prop-types';
import EventCard from './EventCard.jsx';

export default function EventList({ events, featuredId = undefined }) {
  if (!events.length) {
    return <div className="empty-results"><span>Nothing on this frequency.</span><p>Try another search or category.</p></div>;
  }

  return (
    <div className="event-grid">
      {events.map(event => <EventCard key={event.id} event={event} featured={event.id === featuredId} />)}
    </div>
  );
}

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  })).isRequired,
  featuredId: PropTypes.string
};
