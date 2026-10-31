import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const ParticipantsContext = createContext(null);
const PARTICIPANTS_KEY = 'techfest_participants';

function readParticipants() {
  const stored = localStorage.getItem(PARTICIPANTS_KEY);
  if (stored === null) return [];
  const parsed = JSON.parse(stored);
  const validRecords = Array.isArray(parsed) && parsed.every(participant =>
    participant &&
    typeof participant.id === 'string' &&
    typeof participant.fullName === 'string' &&
    typeof participant.email === 'string' &&
    typeof participant.phone === 'string' &&
    typeof participant.collegeName === 'string' &&
    typeof participant.eventTitle === 'string' &&
    typeof participant.bookingId === 'string'
  );
  if (!validRecords) throw new Error('Saved participant data has an invalid format.');
  return parsed;
}

export function ParticipantsProvider({ children }) {
  const [participants, setParticipants] = useState([]);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      setParticipants(readParticipants());
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Could not read saved participants.');
    }
  }, []);

  const saveParticipants = useCallback(nextParticipants => {
    try {
      localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(nextParticipants));
      setParticipants(nextParticipants);
      setStorageError('');
      return true;
    } catch {
      setStorageError('Could not save participant data to browser storage. Check your storage settings and try again.');
      return false;
    }
  }, []);

  const value = useMemo(() => ({ participants, storageError, saveParticipants }), [participants, storageError, saveParticipants]);

  return <ParticipantsContext.Provider value={value}>{children}</ParticipantsContext.Provider>;
}

ParticipantsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useParticipants() {
  const context = useContext(ParticipantsContext);
  if (!context) throw new Error('useParticipants must be used within ParticipantsProvider.');
  return context;
}
