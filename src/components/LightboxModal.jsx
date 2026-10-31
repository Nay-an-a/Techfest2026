import { ArrowLeft, ArrowRight, Play, Square, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function LightboxModal({ images, selectedIndex, onSelect, onClose }) {
  const [slideshowRunning, setSlideshowRunning] = useState(false);
  const selectedImage = images[selectedIndex];

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onSelect(index => (index + 1) % images.length);
      if (event.key === 'ArrowLeft') onSelect(index => (index - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose, onSelect]);

  useEffect(() => {
    if (!slideshowRunning) return undefined;
    const timer = window.setInterval(() => onSelect(index => (index + 1) % images.length), 3000);
    return () => window.clearInterval(timer);
  }, [images.length, onSelect, slideshowRunning]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Event photograph" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <button className="icon-button lightbox-close" type="button" onClick={onClose} aria-label="Close gallery"><X /></button>
      <button className="icon-button lightbox-prev" type="button" onClick={() => onSelect(index => (index - 1 + images.length) % images.length)} aria-label="Previous photo"><ArrowLeft /></button>
      <figure>
        <img src={selectedImage.src} alt={selectedImage.caption} />
        <figcaption>{selectedImage.caption}<span>{selectedIndex + 1} / {images.length}</span></figcaption>
      </figure>
      <button className="icon-button lightbox-next" type="button" onClick={() => onSelect(index => (index + 1) % images.length)} aria-label="Next photo"><ArrowRight /></button>
      <div className="lightbox-slideshow">
        <button className="button button-outline" type="button" onClick={() => setSlideshowRunning(running => !running)}>
          {slideshowRunning ? <Square size={14} /> : <Play size={14} />}
          {slideshowRunning ? 'Stop slideshow' : 'Start slideshow'}
        </button>
      </div>
    </div>
  );
}

LightboxModal.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired
  })).isRequired,
  selectedIndex: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
