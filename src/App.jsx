import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Artists from './pages/Artists';
import ArtistDetail from './pages/ArtistDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Gallery from './pages/Gallery';
import Mixes from './pages/Mixes';
import Merch from './pages/Merch';
import Contact from './pages/Contact';

// Lazy-loaded admin panel (Telegram Mini App)
const AdminApp = React.lazy(() => import('./admin/AdminApp'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin Mini App — no public Layout */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div style={{ background: '#1a1a1a', minHeight: '100vh' }} />}>
              <AdminApp />
            </Suspense>
          }
        />

        {/* Public site */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artists/:id" element={<ArtistDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/mixes" element={<Mixes />} />
              <Route path="/merch" element={<Merch />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </>
  );
}
