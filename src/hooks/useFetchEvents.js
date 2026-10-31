import { useCallback, useEffect, useState } from 'react';
import { getEvents } from '../services/api.js';

export default function useFetchEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt(value => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    getEvents({ signal: controller.signal })
      .then(setEvents)
      .catch(requestError => {
        if (!controller.signal.aborted) {
          setError(requestError.message || 'Events could not be loaded. Please try again.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  return { events, loading, error, retry };
}
