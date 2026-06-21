import { useEffect, useState } from 'react';
import { fetchPatients } from '../services/api';

function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients().then((res) => setPatients(res.data.patients)).catch(console.error);
  }, []);

  return (
    <div>
      <div className="card">
        <h3>Patient List</h3>
        <p>Review and search registered patients in the hospital system.</p>
      </div>
      <div className="card table-card">
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Insurance</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.patient_id}</td>
                <td>{patient.first_name} {patient.last_name}</td>
                <td>{patient.phone}</td>
                <td>{patient.gender}</td>
                <td>{patient.insurance_provider || 'None'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;
