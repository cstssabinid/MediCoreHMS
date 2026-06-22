import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import hospitalLogo from '../assets/logo.PNG';
import '../styles/mission.css';

const navGroups = [
  {
    label: 'Our Mission',
    links: [
      ['/', 'Home'],
      ['/our-story', 'Our Founding Story'],
      ['/future-hospital-vision', 'Future Hospital Vision']
    ]
  },
  {
    label: 'Our Work',
    links: [
      ['/current-work', 'Current Community Work'],
      ['/health-education', 'Health Education'],
      ['/request-guidance', 'Request Health Guidance']
    ]
  },
  {
    label: 'Stories & Impact',
    links: [
      ['/stories', 'Community Stories'],
      ['/our-story', 'Why BERWA Began'],
      ['/future-hospital-vision', 'Development Roadmap']
    ]
  },
  {
    label: 'Get Involved',
    links: [
      ['/get-involved', 'Ways to Help'],
      ['/donate', 'Support the Mission'],
      ['/contact', 'Contact Us']
    ]
  }
];

export function Seo({ title, description }) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
  return null;
}

function PublicLayout({ children }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setOpenMenu(null);
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="mission-site">
      <header className="mission-header">
        <div className="mission-header-top">
          <Link to="/" className="mission-brand" aria-label="BERWA HOSPITALS home">
            <img src={hospitalLogo} alt="BERWA HOSPITALS" />
            <span>
              <strong>BERWA HOSPITALS</strong>
              <small>Health support today · Hospital vision tomorrow</small>
            </span>
          </Link>

          <div className="header-actions">
            <Link to="/login" className="staff-link">Staff Login</Link>
            <Link to="/donate" className="header-donate">Donate Now</Link>
            <button
              type="button"
              className="nav-toggle"
              onClick={() => setMobileNavOpen(open => !open)}
              aria-expanded={mobileNavOpen}
              aria-controls="mission-navigation"
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <nav
          id="mission-navigation"
          className={`mission-nav ${mobileNavOpen ? 'mobile-open' : ''}`}
          aria-label="Main navigation"
          onMouseLeave={() => setOpenMenu(null)}
        >
          {navGroups.map(group => (
            <div
              className={`nav-group ${openMenu === group.label ? 'open' : ''}`}
              key={group.label}
              onMouseEnter={() => setOpenMenu(group.label)}
            >
              <button
                type="button"
                onClick={() => setOpenMenu(current => current === group.label ? null : group.label)}
                aria-expanded={openMenu === group.label}
              >
                {group.label}
                <span className="nav-chevron" aria-hidden="true">⌄</span>
              </button>
              <div className="nav-dropdown">
                {group.links.map(([to, label]) => (
                  <NavLink key={`${group.label}-${to}-${label}`} to={to} end={to === '/'}>
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
          <NavLink to="/contact" className="nav-direct">Contact</NavLink>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="mission-footer" id="contact">
        <div className="mission-container footer-grid">
          <div>
            <h3>BERWA HOSPITALS</h3>
            <p>A growing health initiative supporting education, guidance, and community care while building toward a future hospital.</p>
          </div>
          <div>
            <h4>Mission</h4>
            <Link to="/our-story">Our Story</Link>
            <Link to="/current-work">Current Work</Link>
            <Link to="/future-hospital-vision">Future Hospital Vision</Link>
            <Link to="/stories">Stories</Link>
          </div>
          <div>
            <h4>Take part</h4>
            <Link to="/donate">Donate</Link>
            <Link to="/request-guidance">Request Guidance</Link>
            <Link to="/get-involved">Get Involved</Link>
            <Link to="/login">Staff Login</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <p>berwahospitals@gmail.com</p>
            <p>+250 782 784 599</p>
            <p>Kigali, Rwanda</p>
          </div>
        </div>
        <div className="footer-note">
          <p>BERWA HOSPITALS is currently a growing health initiative and future hospital vision. This website does not provide emergency medical services.</p>
          <p>For urgent symptoms, seek care from the nearest licensed health facility.</p>
        </div>
      </footer>
      <Link className="mobile-donate" to="/donate">Support the Mission</Link>
    </div>
  );
}

export default PublicLayout;
