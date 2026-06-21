import { Link } from 'react-router-dom';
import '../styles/public.css';
import hospitalLogo from '../assets/logo.PNG';

function Public() {
  const services = [
    { icon: '📅', title: 'Book Appointment', desc: 'Schedule with our doctors', link: '/public/appointments' },
    { icon: '🏥', title: 'Our Specialities', desc: 'View all departments', link: '/public/specialities' },
    { icon: '📍', title: 'Our Locations', desc: 'Find nearest center', link: '/public/locations' },
    { icon: '👨‍⚕️', title: 'Our Doctors', desc: 'Meet our team', link: '/public/doctors' },
    { icon: '📋', title: 'Medical Records', desc: 'View your records', link: '#' },
    { icon: '🔍', title: 'Free Second Opinion', desc: 'Expert consultation', link: '#' },
    { icon: '💪', title: 'Health Checkups', desc: 'Preventive packages', link: '#' },
    { icon: '🌍', title: 'International Patients', desc: 'Global healthcare', link: '#' },
    { icon: '💻', title: 'Online Consultation', desc: 'Video consultations', link: '#' },
  ];

  const specialities = [
    'Cardiology', 'Neurology', 'Oncology', 'Gastroenterology',
    'Mother & Child', 'Orthopedics', 'Critical Care', 'Nephrology',
    'Ophthalmology', 'Urology', 'Pediatrics', 'Pulmonology'
  ];

  const locations = [
    { name: 'BERWA HOSPITALS Kigali Central', address: '1 Central Ave, Kigali', phone: '+250 782 784 599' },
    { name: 'BERWA HOSPITALS Nyarugenge Medical Centre', address: '12 Nyarugenge Rd, Kigali', phone: '+250 786 664 709' },
    { name: 'BERWA HOSPITALS Remera Specialty Clinic', address: '5 Remera St, Kigali', phone: '+250 782 784 599' },
    { name: 'BERWA HOSPITALS Kicukiro Community Clinic', address: '9 Kicukiro Ln, Kigali', phone: '+250 786 664 709' },
  ];

  const testimonials = [
    { name: 'Patient A', condition: 'Cardiac Surgery', quote: 'Exceptional care and professional team. Highly recommended.' },
    { name: 'Patient B', condition: 'Neurological Treatment', quote: 'Outstanding medical expertise and compassionate staff.' },
    { name: 'Patient C', condition: 'Orthopedic Surgery', quote: 'World-class facilities and excellent post-operative care.' },
  ];

  const news = [
    { title: 'Advanced Robotic Surgery Program Launched', date: '2026-06-15', excerpt: 'BERWA HOSPITALS introduces state-of-the-art robotic surgical systems.' },
    { title: 'New Pediatric Wing Opens', date: '2026-06-10', excerpt: 'Expanded facilities for children\'s healthcare services.' },
    { title: 'International Accreditation Achieved', date: '2026-06-05', excerpt: 'BERWA HOSPITALS receives international healthcare certification.' },
  ];

  return (
    <div className="public-website">
      {/* Header */}
      <header className="public-header">
        <div className="header-top">
          <div className="header-left">
            <div className="logo-section">
              <img className="hospital-logo" src={hospitalLogo} alt="Berwa Hospitals" />
            </div>
          </div>
          <div className="header-right">
            <div className="contact-info">
              <span>📞 24/7 Helpline: +250 782 784 599 | +250 786 664 709</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="public-nav">
          <a href="#about">About</a>
          <a href="#specialities">Specialities</a>
          <a href="#locations">Locations</a>
          <a href="#doctors">Doctors</a>
          <a href="#news">News</a>
          <a href="#contact">Contact</a>
          <Link to="/login" className="nav-login">Staff Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="public-hero">
        <div className="hero-content">
          <h2>Your Trusted Partner in Healthcare</h2>
          <p>Leading multi-speciality hospital providing world-class medical care</p>
        </div>
      </section>

      {/* Find a Doctor Section */}
      <section className="find-doctor-section">
        <div className="container">
          <h3>Let's Find a Doctor</h3>
          <p>You can find nearest Hospital and Doctors</p>
          <div className="search-bar">
            <input type="text" placeholder="Search by Doctor name" />
            <select>
              <option>Select Location</option>
              {locations.map(loc => <option key={loc.name}>{loc.name}</option>)}
            </select>
            <select>
              <option>Select Department</option>
              {specialities.map(spec => <option key={spec}>{spec}</option>)}
            </select>
            <Link to="/public/doctors" className="btn-search">Search</Link>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="quick-services">
        <div className="container">
          <div className="services-grid">
            {services.map((service, idx) => (
              <Link key={idx} to={service.link} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h4>{service.title}</h4>
                <p>{service.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Specialities Section */}
      <section id="specialities" className="specialities-section">
        <div className="container">
          <h3>Our Specialities</h3>
          <div className="specialities-grid">
            {specialities.map((spec, idx) => (
              <Link key={idx} to={`/public/specialities/${spec}`} className="specialty-card">
                {spec}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="locations-section">
        <div className="container">
          <h3>Our Locations</h3>
          <div className="locations-grid">
            {locations.map((loc, idx) => (
              <div key={idx} className="location-card">
                <h4>{loc.name}</h4>
                <p>📍 {loc.address}</p>
                <p>📞 {loc.phone}</p>
                <p>🕐 24/7 Available</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h3>Patient Testimonials</h3>
          <div className="testimonials-grid">
            {testimonials.map((test, idx) => (
              <div key={idx} className="testimonial-card">
                <p className="quote">"{test.quote}"</p>
                <p className="patient-name">- {test.name}</p>
                <p className="condition">{test.condition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="news-section">
        <div className="container">
          <h3>Latest News & Updates</h3>
          <div className="news-grid">
            {news.map((article, idx) => (
              <div key={idx} className="news-card">
                <h4>{article.title}</h4>
                <p className="date">{new Date(article.date).toLocaleDateString()}</p>
                <p>{article.excerpt}</p>
                <a href="#" className="read-more">Read More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h3>Ready to Schedule Your Appointment?</h3>
          <p>Book with our experienced doctors today</p>
          <div className="cta-buttons">
            <Link to="/public/appointments" className="btn-primary">Book Appointment</Link>
            <a href="#contact" className="btn-secondary">Contact Us</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="public-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>About BERWA HOSPITALS</h4>
              <p>Leading multi-speciality healthcare provider serving the community with excellence.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#doctors">Our Doctors</a></li>
                <li><a href="#locations">Locations</a></li>
                <li><a href="#news">News</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>📞 +250 782 784 599</p>
              <p>📞 +250 786 664 709</p>
              <p>📧 berwahospitals@gmail.com</p>
              <p>📍 Multiple locations in Kigali</p>
            </div>
            <div className="footer-section">
              <h4>Hours</h4>
              <p>24/7 Emergency Services</p>
              <p>Outpatient: Mon-Sat 8AM-6PM</p>
              <p>Sunday by Appointment</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 BERWA HOSPITALS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Public;
