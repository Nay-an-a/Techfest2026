import { ArrowRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import LightboxModal from '../components/LightboxModal.jsx';

const photographs = [
  ['Ideas take shape', 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  ['The build never sleeps', 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  ['Better, together', 'https://images.pexels.com/photos/1181260/pexels-photo-1181260.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  ['Future in motion', 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  ['Bright ideas, late nights', 'https://images.pexels.com/photos/5380607/pexels-photo-5380607.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  ['A room full of what-ifs', 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  ['The big reveal', 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  ['Afterglow', 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200']
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const closeLightbox = useCallback(() => setSelected(null), []);
  const selectImage = useCallback(updater => setSelected(updater), []);
  const images = photographs.map(([caption, src]) => ({ caption, src }));

  return (
    <div className="page-container container">
      <section className="page-intro">
        <span className="eyebrow">A LITTLE PREVIEW</span>
        <h1>Good things <span>happen here.</span></h1>
        <p>Big ideas, happy accidents, and a whole lot of making.</p>
      </section>
      <div className="gallery-grid">
        {photographs.map(([caption, image], index) => <button className={`gallery-tile gallery-tile-${index % 4}`} key={caption} type="button" onClick={() => setSelected(index)} aria-label={`View photo: ${caption}`}><img src={image} alt={caption} loading="lazy" /><span className="gallery-caption">{caption}<ArrowRight size={16} /></span></button>)}
      </div>
      {selected !== null && <LightboxModal images={images} selectedIndex={selected} onSelect={selectImage} onClose={closeLightbox} />}
    </div>
  );
}
