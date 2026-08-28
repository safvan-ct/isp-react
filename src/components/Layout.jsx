import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import useScrollToTop from '../hooks/useScrollToTop';

export default function Layout() {
  const { pathname } = useLocation();
  // Execute scroll-to-top handler on path changes
  useScrollToTop();

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Announcement Strip (Only on Homepage) */}
      {pathname === '/' && (
        <div className="py-2 text-center text-white small" style={{ backgroundColor: 'var(--desert-night)' }}>
          <i className="bi bi-moon-stars me-1 text-warning"></i> Ramadan Intensive & Tajweed Batches Now Open •
          <Link to="/courses" className="text-decoration-underline text-white ms-1">Explore Programs</Link>
        </div>
      )}
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
