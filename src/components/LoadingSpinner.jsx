import PropTypes from 'prop-types';

export default function LoadingSpinner({ label = 'Loading events' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

LoadingSpinner.propTypes = {
  label: PropTypes.string
};
