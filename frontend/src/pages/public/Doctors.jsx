import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/public.css';
import hospitalLogo from '../../assets/logo.PNG';
import api from '../../services/api';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/public/doctors')
      .then(r => {
        setDoctors(r.data.doctors);
        setFilteredDoctors(r.data.doctors);
      })
      .catch(console.error);
  }, []);

  const handleDepartmentFilter = (dept) => {
    setDepartment(dept);
    if (dept === '') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter(d => d.department_name === dept));
    }
  };

  const departments = [...new Set(doctors.map(d => d.department_name))];

  return (
    <div className="public-website">
      {/* Header */}
      <header className="public-header">
        <div className="header-top">
          <div className="header-left">
            <div className="logo-section">
              <Link to="/" aria-label="Go to landing page">
                <img className="hospital-logo" src={hospitalLogo} alt="Berwa Hospitals" />
              </Link>
            </div>
          </div>
          <div className="header-right">
            <div className="contact-info">
              <span>📞 24/7 Helpline: +250 782 784 599 | +250 786 664 709</span>
            </div>
          </div>
        </div>
        <nav className="public-nav">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <a href="/#specialities">Specialities</a>
          <a href="/#locations">Locations</a>
          <a href="/">Doctors</a>
          <a href="/#news">News</a>
          <a href="/#contact">Contact</a>
          <Link to="/login" className="nav-login">Staff Login</Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container" style={{ padding: '48px 24px' }}>
        <h2 style={{ color: '#1f3f8b', marginBottom: '8px' }}>Our Doctors</h2>
        <p style={{ color: '#667795', marginBottom: '32px' }}>Meet our experienced medical professionals</p>

        {/* Filter */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ marginRight: '16px', fontWeight: '600', color: '#4b5b79' }}>Filter by Department:</label>
          <select 
            value={department} 
            onChange={(e) => handleDepartmentFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid #d3d9e6',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontFamily: 'inherit'
            }}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Doctors Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} style={{
              background: '#ffffff',
              border: '1px solid #e8ecf3',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👨‍⚕️</div>
              <h3 style={{ color: '#1f3f8b', margin: '12px 0 4px 0' }}>
                {doctor.first_name} {doctor.last_name}
              </h3>
              <p style={{ color: '#667795', margin: '0 0 12px 0', fontSize: '0.95rem' }}>
                {doctor.department_name}
              </p>
              <p style={{ color: '#4b5b79', margin: '0 0 16px 0', fontSize: '0.9rem' }}>
                {doctor.experience_years} years experience
              </p>
              <p style={{ color: '#667795', margin: '0 0 12px 0', fontSize: '0.9rem' }}>
                Consultation: {doctor.consultation_type}
              </p>
              <p style={{ color: '#4b5b79', margin: '0 0 16px 0', fontSize: '0.85rem', fontStyle: 'italic' }}>
                📍 {doctor.locations}
              </p>
              <Link 
                to={`/public/doctors/${doctor.id}`}
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: '#1f3f8b',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>

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
                <li><Link to="/">Home</Link></li>
                <li><a href="/#doctors">Our Doctors</a></li>
                <li><a href="/#locations">Locations</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>📞 +250 782 784 599</p>
              <p>📞 +250 786 664 709</p>
              <p>📧 berwahospitals@gmail.com</p>
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

export default Doctors;
