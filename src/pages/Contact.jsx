import { Check, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  ['When and where is TechFest?', 'TechFest runs from October 12–14, 2026, at the innovation campus in Calicut, India.'],
  ['Do I need a team to join?', 'Not for every event. Some challenges are team-based, but you can meet collaborators at the fest.'],
  ['Can I attend more than one event?', 'Absolutely. Add multiple events to your cart, subject to seat availability.'],
  ['What should I bring?', 'Bring your student or organization ID, a laptop for build events, and your curiosity.']
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', message: '' });

  const submit = event => {
    event.preventDefault();
    setSubmitted(values.message);
    setValues({ name: '', email: '', message: '' });
  };

  return (
    <div className="page-container container">
      <section className="page-intro">
        <span className="eyebrow">WE’RE ALL EARS</span>
        <h1>Let’s <span>talk.</span></h1>
        <p>Have a question, a collaboration idea, or just want to say hi?</p>
      </section>
      <div className="contact-layout">
        <section className="contact-card panel">
          <span className="eyebrow">DROP US A LINE</span><h2>We’ll get back to you.</h2>
          {submitted && <div className="success-message" role="status"><Check size={17} /> Message received: <q>{submitted}</q></div>}
          <form className="contact-form" onSubmit={submit}>
            <label className="form-field">Your name<input required value={values.name} onChange={event => setValues({ ...values, name: event.target.value })} placeholder="Name" autoComplete="name" /></label>
            <label className="form-field">Email address<input required type="email" value={values.email} onChange={event => setValues({ ...values, email: event.target.value })} placeholder="you@example.com" autoComplete="email" /></label>
            <label className="form-field">What’s on your mind?<textarea required rows="5" value={values.message} onChange={event => setValues({ ...values, message: event.target.value })} placeholder="Tell us a little more..." /></label>
            <button className="button button-primary" type="submit">Send your note <Mail size={16} /></button>
          </form>
        </section>
        <aside className="contact-side">
          <div className="contact-details panel"><span className="eyebrow">FIND THE CREW</span><div><Mail /><p><small>Email</small><a href="mailto:hello@techfest2026.in">hello@techfest2026.in</a></p></div><div><Phone /><p><small>Call</small><a href="tel:+914952280000">+91 495 228 0000</a></p></div><div><MapPin /><p><small>Visit</small><span>Innovation campus, Calicut<br />Kerala, India</span></p></div></div>
          <div className="map-placeholder"><MapPin size={25} /><strong>CALICUT, KERALA</strong><span>TechFest 2026 · Innovation campus</span><div className="map-grid" /></div>
        </aside>
      </div>
      <section className="faq-section"><span className="eyebrow">GOOD QUESTION</span><h2>Quick answers.</h2><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{question}</span><span>{openFaq === index ? '−' : '+'}</span></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>
    </div>
  );
}
