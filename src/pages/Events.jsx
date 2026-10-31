import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EventList from '../components/EventList.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import useFetchEvents from '../hooks/useFetchEvents.js';

export default function Events() {
  const { events, loading, error, retry } = useFetchEvents();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...new Set(events.map(event => event.category))], [events]);
  const filteredEvents = useMemo(() => events.filter(event => {
    const matchesQuery = `${event.title} ${event.description} ${event.category}`.toLowerCase().includes(query.toLowerCase().trim());
    return matchesQuery && (category === 'All' || event.category === category);
  }), [events, query, category]);

  return (
    <div className="page-container container">
      <section className="page-intro">
        <span className="eyebrow">THE GOOD STUFF</span>
        <h1>Find your <span>thing.</span></h1>
        <p>Build, play, experiment, repeat. Pick an event and save your spot.</p>
      </section>
      <div className="event-controls">
        <label className="search-control"><Search size={18} /><span className="sr-only">Search events</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search events, ideas, categories..." /></label>
        <label className="category-control"><SlidersHorizontal size={17} /><span className="sr-only">Filter by category</span><select value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
        <span className="results-count">{loading ? '—' : `${filteredEvents.length} events`}</span>
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={retry} />}
      {!loading && !error && <EventList events={filteredEvents} />}
    </div>
  );
}
