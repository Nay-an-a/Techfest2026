import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import Cart from './pages/Cart.jsx';
import Contact from './pages/Contact.jsx';
import Events from './pages/Events.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Registration from './pages/Registration.jsx';
import Tasks from './pages/Tasks.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

const Gallery = lazy(() => import('./pages/Gallery.jsx'));

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/register/:eventId" element={<Registration />} />
          <Route path="/gallery" element={<Suspense fallback={<LoadingSpinner label="Loading gallery" />}><Gallery /></Suspense>} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
