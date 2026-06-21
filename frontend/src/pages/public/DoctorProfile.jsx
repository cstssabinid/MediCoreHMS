import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useParams, Link } from 'react-router-dom';

function DoctorProfile() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  useEffect(() => {
    api.get(`/public/doctors/${id}`).then(r => { setDoc(r.data.doctor); }).catch(console.error);
  }, [id]);
  if (!doc) return <div className="card">Loading...</div>;
  return (
    <div>
      <div className="card">
        <h2>{doc.first_name} {doc.last_name}</h2>
        <p>{doc.qualifications} — {doc.experience_years} yrs</p>
        <p>{doc.bio}</p>
        <p><strong>Consultation:</strong> {doc.consultation_type} — Fee: ${doc.consultation_fee}</p>
        <Link to="/public/appointments" className="button-primary">Book Appointment</Link>
      </div>
      <div className="card table-card">
        <h3>Schedules</h3>
        <table>
          <thead><tr><th>Day</th><th>Location</th><th>Start</th><th>End</th></tr></thead>
          <tbody>
            {Array.isArray(doc.schedules) && doc.schedules.map(s => (
              <tr key={s.id}><td>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][s.day_of_week] || s.day_of_week}</td><td>{s.location_name}</td><td>{s.start_time}</td><td>{s.end_time}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorProfile;
