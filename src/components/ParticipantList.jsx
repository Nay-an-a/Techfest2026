import { Search, Trash2, UserRoundPen, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Modal from './Modal.jsx';

export default function ParticipantList({ participants, onEdit, onDelete, onClearAll, error }) {
  const [query, setQuery] = useState('');
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [editValues, setEditValues] = useState(null);
  const [editError, setEditError] = useState('');
  const filteredParticipants = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return participants;
    return participants.filter(participant =>
      [participant.fullName, participant.email, participant.phone, participant.collegeName, participant.eventTitle]
        .some(value => value?.toLowerCase().includes(searchTerm))
    );
  }, [participants, query]);

  const beginEdit = participant => {
    setEditingParticipant(participant);
    setEditValues({
      fullName: participant.fullName,
      email: participant.email,
      phone: participant.phone,
      collegeName: participant.collegeName
    });
    setEditError('');
  };

  const saveEdit = event => {
    event.preventDefault();
    const fullName = editValues.fullName.trim();
    const email = editValues.email.trim();
    const phone = editValues.phone.trim();
    const collegeName = editValues.collegeName.trim();
    if (!/^(?=.{3,60}$)(?=(?:.*[A-Za-z]){3,})[A-Za-z][A-Za-z\s.'-]*$/.test(fullName)) {
      setEditError('Enter a valid name with at least 3 letters.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEditError('Enter a valid email address.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setEditError('Enter a 10-digit number starting with 6–9.');
      return;
    }
    if (!collegeName) {
      setEditError('Enter a college or organization.');
      return;
    }
    onEdit({ ...editingParticipant, fullName, email, phone, collegeName });
    setEditingParticipant(null);
    setEditValues(null);
  };

  return (
    <section className="participants-section panel" aria-labelledby="participantsHeading">
      <div className="participants-heading">
        <div>
          <span className="eyebrow">YOUR REGISTRATION RECORDS</span>
          <h2 id="participantsHeading">Participants <span>{participants.length}</span></h2>
        </div>
        <button className="button button-small button-outline" type="button" onClick={onClearAll} disabled={!participants.length}>
          <Trash2 size={14} /> Clear all
        </button>
      </div>
      {error && <p className="storage-error" role="alert">{error}</p>}
      <label className="participants-search">
        <Search size={16} />
        <span className="sr-only">Search participants</span>
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name, email, college, or event..." />
        {query && <button type="button" aria-label="Clear participant search" onClick={() => setQuery('')}><X size={15} /></button>}
      </label>
      {!filteredParticipants.length ? (
        <div className="participants-empty">
          <strong>{participants.length ? 'No matches this time.' : 'No participants yet.'}</strong>
          <p>{participants.length ? 'Try a different name, email, college, or event.' : 'New attendee registrations will appear here when they sign up.'}</p>
        </div>
      ) : (
        <div className="participants-list">
          {filteredParticipants.map(participant => (
            <article className="participant-row" key={participant.id}>
              <div className="participant-avatar" aria-hidden="true">{participant.fullName.slice(0, 1).toUpperCase()}</div>
              <div className="participant-details">
                <strong>{participant.fullName}</strong>
                <span>{participant.email} · {participant.phone}</span>
                <small>{participant.collegeName} · {participant.eventTitle}</small>
              </div>
              <span className="participant-booking">{participant.bookingId}</span>
              <div className="participant-actions">
                <button className="icon-button" type="button" onClick={() => beginEdit(participant)} aria-label={`Edit ${participant.fullName}`} title="Edit participant"><UserRoundPen size={16} /></button>
                <button className="icon-button participant-delete" type="button" onClick={() => onDelete(participant.id)} aria-label={`Delete ${participant.fullName}`} title="Delete participant"><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      )}
      {editingParticipant && <Modal title="Edit participant" onClose={() => setEditingParticipant(null)}>
        <form className="participant-edit-form" onSubmit={saveEdit}>
          {[
            ['fullName', 'Full name'],
            ['email', 'Email address'],
            ['phone', 'Phone number'],
            ['collegeName', 'College / organization']
          ].map(([name, label]) => <label className="form-field" key={name} htmlFor={`edit-${name}`}>{label}<input id={`edit-${name}`} type={name === 'email' ? 'email' : 'text'} value={editValues[name]} onChange={event => setEditValues(current => ({ ...current, [name]: event.target.value }))} /></label>)}
          {editError && <small className="field-error" role="alert">{editError}</small>}
          <button className="button button-primary button-full" type="submit">Save changes</button>
        </form>
      </Modal>}
    </section>
  );
}

ParticipantList.propTypes = {
  participants: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    collegeName: PropTypes.string.isRequired,
    eventTitle: PropTypes.string.isRequired,
    bookingId: PropTypes.string.isRequired
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
  error: PropTypes.string
};
