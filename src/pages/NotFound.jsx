import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return <section className="not-found container"><span className="eyebrow">404 · WRONG TURN?</span><h1>This page is<br /><span>off the map.</span></h1><p>That link doesn’t lead to an event. Let’s get you back to the good stuff.</p><Link className="button button-primary" to="/"><ArrowLeft size={16} /> Back to home</Link></section>;
}
