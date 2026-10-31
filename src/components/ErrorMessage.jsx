import { RefreshCw, TriangleAlert } from 'lucide-react';
import PropTypes from 'prop-types';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <TriangleAlert size={21} />
      <div><strong>Something went wrong</strong><p>{message}</p></div>
      <button className="button button-secondary" type="button" onClick={onRetry}><RefreshCw size={15} /> Try again</button>
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired
};
