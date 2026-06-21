function Reports() {
  return (
    <div>
      <div className="card"><h3>Reports</h3><p>View hospital statistics, revenue, and operational summaries.</p></div>
      <div className="card-grid">
        <div className="card"><h3>Appointments Trend</h3><p>Daily and weekly appointment counts.</p></div>
        <div className="card"><h3>Revenue Summary</h3><p>Invoice totals and paid collections.</p></div>
      </div>
    </div>
  );
}

export default Reports;
