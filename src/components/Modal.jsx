import { X } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        <h2 id="modalTitle">{title}</h2>
        {children}
      </section>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node
};
