function Billing() {
  return (
    <div>
      <div className="card"><h3>Billing & Invoices</h3><p>Generate invoices and record payment activity for patients.</p></div>
      <div className="card table-card">
        <table>
          <thead><tr><th>Invoice</th><th>Patient</th><th>Status</th><th>Total</th></tr></thead>
          <tbody><tr><td colSpan="4">Billing module is ready to integrate with invoice data.</td></tr></tbody>
        </table>
      </div>
    </div>
  );
}

export default Billing;
