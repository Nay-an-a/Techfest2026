import { Check, TicketCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Modal from '../components/Modal.jsx';
import useFetchEvents from '../hooks/useFetchEvents.js';
import { registerForEvent } from '../services/api.js';

export default function Registration() {
  const { eventId } = useParams();
  const { events, loading, error } = useFetchEvents();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const userName = localStorage.getItem('userName');

  useEffect(() => {
    if (eventId && events.some(event => event.id === eventId)) {
      setSelectedEvent(eventId);
    }
  }, [eventId, events]);

  const eventById = useMemo(() => new Map(events.map(event => [event.id, event])), [events]);

  const submitForm = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    if (!selectedEvent) {
      setSubmitError('Please select an event.');
      return;
    }

    const selected = eventById.get(selectedEvent);
    if (!selected) {
      setSubmitError('This event is no longer available. Choose another event.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerForEvent(selectedEvent);
      
      setConfirmation({
        bookingId: `TF26-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        fullName: userName || 'Attendee',
        eventTitle: selected.title
      });
      setSelectedEvent('');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userName) {
    return <Navigate to="/login?redirect=/register" replace />;
  }

  return (
    <div className="page-container container registration-layout">
      <section className="page-intro">
        <span className="eyebrow">YOUR STORY STARTS HERE</span>
        <h1>Save your <span>spot.</span></h1>
        <p>One quick form, a whole lot of possibilities.</p>
        <div className="registration-aside"><TicketCheck size={21} /><span>Your registration will be saved to your account.</span></div>
      </section>
      <form id="registrationForm" className="registration-form panel" onSubmit={submitForm} noValidate>
          <div className="form-heading"><span className="eyebrow">TECHFEST 2026 · REGISTRATION</span><h2>Let’s get you in.</h2><p>Select the event you want to join.</p></div>
          {submitError && <p className="field-error" style={{ marginBottom: '1rem' }} role="alert">{submitError}</p>}
          
          <div className="form-field">
            <label htmlFor="selectedEvent">Choose an event <b>*</b></label>
            <select id="selectedEvent" name="selectedEvent" value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} disabled={loading || Boolean(error)}>
              <option value="">{loading ? 'Loading events…' : error ? 'Events unavailable' : 'Pick your event'}</option>
              {events.map(item => <option key={item.id} value={item.id}>{item.title} · ₹{item.fee}</option>)}
            </select>
            {error && <small className="field-error">{error}</small>}
          </div>
          
          <div className="registration-actions">
            <button className="button button-primary button-submit" type="submit" disabled={loading || Boolean(error) || isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Complete registration'} <Check size={17} />
            </button>
          </div>
      </form>
      {confirmation && (
        <Modal title="You’re on the list!" onClose={() => setConfirmation(null)}>
          <div className="confirmation-content">
            <div className="confirmation-icon"><Check size={24} /></div>
            <p>Your TechFest registration is confirmed. See you there!</p>
            <dl>
              <div><dt>Booking ID</dt><dd>{confirmation.bookingId}</dd></div>
              <div><dt>Attendee</dt><dd>{confirmation.fullName}</dd></div>
              <div><dt>Event</dt><dd>{confirmation.eventTitle}</dd></div>
            </dl>
            <button className="button button-primary button-full" onClick={() => setConfirmation(null)}>Amazing, thanks!</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
