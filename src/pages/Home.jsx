import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Countdown from '../components/Countdown.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EventCard from '../components/EventCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import useFetchEvents from '../hooks/useFetchEvents.js';

const highlights = [
  { title: 'Redefine reality.', text: 'An elite 24-hour hackathon for those who dare to build what others only dream of.', image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Code Sprint · Oct 12' },
  { title: 'Where ideas become legends.', text: 'Construct your machine, test your mettle, and dominate the arena.', image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'RoboWars · Oct 12' },
  { title: 'Three days. Infinite possibilities.', text: 'Immerse yourself in a dynamic ecosystem of builders, creators, and visionaries.', image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'TechFest Live · Oct 14' }
];

export default function Home() {
  const { events, loading, error, retry } = useFetchEvents();
  const [activeSlide, setActiveSlide] = useState(0);
  const featured = events.find(event => event.id === 'code-sprint');

  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> 12—14 OCTOBER 2026 · CALICUT, INDIA</div>
          <h1>Ignite your<br /><span>potential.</span></h1>
          <p className="hero-lede">Step into the arena. Code the unimaginable, break the boundaries, forge the future.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/events">Discover events <ArrowRight size={17} /></Link>
            <Link className="text-link" to="/register">Secure your spot <ArrowUpRight size={16} /></Link>
          </div>
          <div className="hero-proof"><span className="proof-avatars"><i>H</i><i>✦</i><i>+</i></span><span><strong>1,200+</strong> innovators, one destination</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-image" style={{ backgroundImage: `url("${highlights[activeSlide].image}")` }} />
          <div className="hero-image-shade" />
          <div className="hero-image-caption"><span><Sparkles size={15} /> FEATURED MOMENT</span><strong>{highlights[activeSlide].label}</strong></div>
          <div className="hero-slide-controls" aria-label="Featured events carousel">
            {highlights.map((slide, index) => <button key={slide.title} type="button" className={activeSlide === index ? 'slide-dot active' : 'slide-dot'} aria-label={`Show slide ${index + 1}`} onClick={() => setActiveSlide(index)} />)}
            <button type="button" className="slide-next" aria-label="Next featured event" onClick={() => setActiveSlide(index => (index + 1) % highlights.length)}><ArrowRight size={17} /></button>
          </div>
        </div>
        <div className="hero-index">01 <span>/</span> 03</div>
      </section>

      <section className="countdown-section">
        <div className="container countdown-inner">
          <div><span className="eyebrow">THE CLOCK IS TICKING</span><h2>Prepare for impact.</h2></div>
          <Countdown />
        </div>
      </section>

      <section className="section container home-featured">
        <div className="section-heading">
          <div><span className="eyebrow">YOUR JOURNEY AWAITS</span><h2>Built for the <span>innovators.</span></h2></div>
          <Link to="/events" className="text-link">View schedule <ArrowUpRight size={16} /></Link>
        </div>
        {loading && <LoadingSpinner label="Loading featured experiences" />}
        {error && <ErrorMessage message={error} onRetry={retry} />}
        {!loading && !error && featured && <div className="featured-event"><EventCard event={featured} featured /><div className="featured-note"><span>IGNITE YOUR CREATIVITY</span><h3>{highlights[activeSlide].title}</h3><p>{highlights[activeSlide].text}</p><Link className="text-link" to={`/register/${featured.id}`}>Join the challenge <ArrowRight size={16} /></Link></div></div>}
      </section>

      <section className="manifesto">
        <div className="container manifesto-inner"><span className="eyebrow">BEYOND IMAGINATION</span><p>Start as a visionary.<br />Emerge as a <span>pioneer.</span></p><Link className="button button-light" to="/gallery">Experience it <ArrowRight size={16} /></Link></div>
      </section>
    </>
  );
}
