import { ArrowLeft, ArrowRight, Check, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../components/Modal.jsx';
import { useCart } from '../context/CartContext.jsx';

const TAX_RATE = 0.05;
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function Cart() {
  const { items, total, removeFromCart, clearCart } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);
  const tax = total * TAX_RATE;
  const grandTotal = total + tax;

  const checkout = () => {
    localStorage.setItem('techfest-last-order', JSON.stringify({ items, total: grandTotal, bookingId: `TF26-${crypto.randomUUID().slice(0, 8).toUpperCase()}` }));
    setCheckedOut(true);
  };

  return (
    <div className="page-container container">
      <section className="page-intro">
        <span className="eyebrow">YOUR LINEUP</span><h1>The <span>good stuff.</span></h1><p>All the experiences you picked, in one place.</p>
      </section>
      {!items.length ? <div className="cart-empty panel"><span className="empty-bag"><ShoppingBag size={27} /></span><h2>Your cart’s taking a breather.</h2><p>There are plenty of good things to add to it.</p><Link className="button button-primary" to="/events">Find an event <ArrowRight size={16} /></Link></div> : <div className="cart-layout">
        <section className="cart-items panel"><div className="cart-table-heading"><h2>Your events <span>({items.reduce((sum, item) => sum + item.quantity, 0)})</span></h2><button className="text-button" onClick={clearCart}>Clear cart</button></div>
          {items.map(item => <article className="cart-item" key={item.id}><img src={item.image} alt="" /><div className="cart-item-info"><span className="event-category">{item.category}</span><h3>{item.title}</h3><p>{item.date} · Qty {item.quantity}</p></div><strong>{money(item.fee * item.quantity)}</strong><button className="icon-button remove-item" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.title}`}><Trash2 size={17} /></button></article>)}
          <Link className="text-link continue-link" to="/events"><ArrowLeft size={16} /> Keep exploring</Link>
        </section>
        <aside className="order-summary panel"><span className="eyebrow">THE RECAP</span><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><span>{money(total)}</span></div><div className="summary-line"><span>Event tax · 5%</span><span>{money(tax)}</span></div><div className="summary-line summary-total"><strong>Total</strong><strong>{money(grandTotal)}</strong></div><button className="button button-primary button-full" onClick={checkout}>Proceed to checkout <ArrowRight size={16} /></button><p className="secure-note">You won’t be charged in this demo checkout.</p></aside>
      </div>}
      {checkedOut && <Modal title="You’re all set." onClose={() => { setCheckedOut(false); clearCart(); }}><div className="confirmation-content"><div className="confirmation-icon"><Check size={24} /></div><p>Your event selection is confirmed. We can’t wait to see you.</p><div className="checkout-total"><span>Amount due at the fest</span><strong>{money(grandTotal)}</strong></div><button className="button button-primary button-full" onClick={() => { setCheckedOut(false); clearCart(); }}>Back to TechFest</button></div></Modal>}
    </div>
  );
}
