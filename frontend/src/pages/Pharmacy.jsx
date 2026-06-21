import { useEffect, useState } from 'react';
import { fetchReports } from '../services/api';

function Pharmacy() {
  const [stock] = useState([]);
  const [summary] = useState({});

  useEffect(() => {
    fetchReports().then(() => {}).catch(console.error);
  }, []);

  return (
    <div>
      <div className="card"><h3>Pharmacy Dashboard</h3><p>Manage medicine stock and dispensing records.</p></div>
      <div className="card-grid">
        <div className="card"><h3>Low Stock Alerts</h3><strong>{0}</strong></div>
        <div className="card"><h3>Pending Prescriptions</h3><strong>{0}</strong></div>
      </div>
      <div className="card table-card">
        <table>
          <thead><tr><th>Medicine</th><th>Category</th><th>Stock</th><th>Price</th></tr></thead>
          <tbody>{stock.length === 0 ? <tr><td colSpan="4">No stock data available.</td></tr> : stock.map((item) => (<tr key={item.id}><td>{item.name}</td><td>{item.category}</td><td>{item.quantity}</td><td>${item.unit_price.toFixed(2)}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Pharmacy;
